import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Quiz, Score } from '../types';
import { supabase } from '../lib/supabase';

// Helper to convert snake_case (DB) to camelCase (Frontend) for Realtime payloads
const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) return obj;
  
  return Object.keys(obj).reduce((acc: any, key) => {
    const camelKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

interface AppState {
  users: User[];
  quizzes: Quiz[];
  scores: Score[];
  currentUser: User | null;
  initialized: boolean;
  isAuthLoading: boolean;

  // Initialization
  init: () => Promise<void>;
  migrateLocalData: () => Promise<void>;

  // Auth & Profile
  login: (email: string, passwordHash: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (userData: Partial<User> & { id?: string; email: string; name: string; avatar: string }) => Promise<void>;
  resetPassword: (email: string, newPasswordHash: string) => boolean;
  register: (user: Omit<User, 'id' | 'createdAt' | 'badges'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  continueAsGuest: () => void;
  setUser: (user: User) => void; 
  completeOnboarding: (data: Partial<User>) => Promise<void>;

  // Quizzes
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'attempts' | 'rating' | 'ratingCount' | 'reviews'>) => Promise<string>;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => void;
  incrementQuizAttempts: (id: string) => void;
  submitQuizRating: (id: string, newRating: number, comment: string, userName: string) => Promise<void>;

  // Scores
  addScore: (score: Omit<Score, 'id' | 'answeredAt'>) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      quizzes: [],
      scores: [],
      currentUser: null,
      initialized: false,
      isAuthLoading: true,

      init: async () => {
        try {
          // 1. Initial State Setup
          set({ isAuthLoading: true });
          console.info('📡 Initializing Adhyayan Store...');

          // 2. Definitive Session Check (Handles Hash/Code Redirects Automatically)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('❌ Session recovery failed:', sessionError);
          }

          if (session?.user) {
            console.info('✅ Active session recovered:', session.user.email);
            await get().loginWithOAuth({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
              avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
            });
          } else {
            console.info('👤 Continuing as guest');
          }

          // 3. Setup Auth State Listener (Only once)
          if (!get().initialized) {
            supabase.auth.onAuthStateChange(async (event, session) => {
              console.info(`🔐 Auth event triggered: ${event}`);
              if (session?.user) {
                const { user } = session;
                await get().loginWithOAuth({
                  id: user.id,
                  email: user.email || '',
                  name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                  avatar: user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                });
              } else if (event === 'SIGNED_OUT') {
                set({ currentUser: null });
              }
            });
          }

          // 4. Data Loading (Quizzes/Scores)
          const { currentUser } = get();
          const [quizzesRes, scoresRes] = await Promise.all([
            fetch(`/api/quizzes?userId=${currentUser?.id || ''}`),
            fetch('/api/scores')
          ]);

          if (quizzesRes.ok && scoresRes.ok) {
            const quizzes = (await quizzesRes.json()) || [];
            const scores = (await scoresRes.json()) || [];
            set({ 
              quizzes: quizzes.length > 0 ? quizzes : get().quizzes, 
              scores: scores.length > 0 ? scores : get().scores
            });
          }

          // 5. Setup Realtime Listeners
          if (!get().initialized) {
            const quizChannel = supabase
              .channel('public:quizzes')
              .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quizzes' }, (payload) => {
                const quiz = snakeToCamel(payload.new);
                set(state => ({ quizzes: [quiz, ...state.quizzes] }));
              })
              .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quizzes' }, (payload) => {
                const updatedQuiz = snakeToCamel(payload.new);
                set(state => ({
                  quizzes: state.quizzes.map(q => 
                    (q.id === updatedQuiz.id || q._id === updatedQuiz.id) ? updatedQuiz : q
                  )
                }));
              })
              .subscribe();

            const scoreChannel = supabase
              .channel('public:scores')
              .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, (payload) => {
                const score = snakeToCamel(payload.new);
                set(state => ({ scores: [score, ...state.scores] }));
              })
              .subscribe();
          }

          // 6. Complete Initialization
          set({ initialized: true, isAuthLoading: false });
        } catch (err) {
          console.error('❌ Backend initialization failed:', err);
          set({ initialized: true, isAuthLoading: false });
        }
      },

      // Profile Actions
      setUser: async (user) => {
        try {
          const { currentUser } = get();
          if (!currentUser) return;

          const res = await fetch('/api/user/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              bio: user.bio,
              avatar: user.avatar
            })
          });

          if (!res.ok) throw new Error('Failed to update profile');
          
          const { user: updatedUser } = await res.json();
          set(state => ({
            currentUser: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
          }));
        } catch (err) {
          console.error('Update profile failed:', err);
          // Fallback to local update
          set(state => ({
            currentUser: user,
            users: state.users.map(u => u.id === user.id ? user : u)
          }));
        }
      },

      completeOnboarding: async (data) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        await get().loginWithOAuth({
          ...currentUser,
          ...data,
          isOnboarded: true
        });
      },

      // Auth Actions
      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            await get().loginWithOAuth({
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'User',
              avatar: data.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`
            });
            return { success: true };
          }
          return { success: false, error: 'No user data returned' };
        } catch (err: any) {
          console.error('Login error:', err);
          return { success: false, error: err.message || 'Invalid email or password' };
        }
      },

      loginWithOAuth: async (userData) => {
        try {
          set({ isAuthLoading: true });
          
          // Only attempt backend sync if we have a valid UUID (which comes from Supabase auth)
          const isValidUuid = userData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userData.id);
          
          if (isValidUuid) {
            const res = await fetch('/api/user/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                isOnboarded: userData.isOnboarded,
                isFirstTimeUser: userData.isFirstTimeUser,
                profession: userData.profession,
                interestedCategories: userData.interestedCategories
              })
            });
            
            if (res.ok) {
              const { user } = await res.json();
              console.info('✅ User synchronized with backend:', user.email);
              
              set(state => ({
                currentUser: user,
                isAuthLoading: false,
                users: state.users.some(u => u.id === user.id) 
                  ? state.users.map(u => u.id === user.id ? user : u)
                  : [...state.users, user]
              }));

              // Fetch quizzes again with the user's ID
              const quizzesRes = await fetch(`/api/quizzes?userId=${user.id}`);
              if (quizzesRes.ok) {
                const quizzes = await quizzesRes.json();
                set({ quizzes });
              }
              return;
            }
          }

          console.warn('❌ Sync skipped or failed, using local session');
          // Fallback to local session if sync fails or ID is not a UUID
          const newUser: User = {
            ...userData,
            passwordHash: 'oauth_user',
            id: userData.id || `u_${Date.now()}`,
            createdAt: Date.now(),
            badges: ['First Quiz'],
            bio: "Passionate Learner 🚀",
            isOnboarded: userData.isOnboarded ?? false
          } as User;
          set({ currentUser: newUser, isAuthLoading: false });
        } catch (err) {
          console.error('❌ OAuth sync failed or timed out:', err);
          set({ isAuthLoading: false });
        }
      },

      register: async (userData) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.passwordHash, // Using the same field but it's the raw pass for Supabase
            options: {
              data: {
                full_name: userData.name,
                avatar_url: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
              }
            }
          });

          if (error) throw error;

          if (data.user) {
            await get().loginWithOAuth({
              id: data.user.id,
              email: data.user.email || '',
              name: userData.name,
              avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`
            });
            return { success: true };
          }
          return { success: false, error: 'Registration failed' };
        } catch (err: any) {
          console.error('Registration error:', err);
          return { success: false, error: err.message || 'Registration failed' };
        }
      },

      resetPassword: (email, newPasswordHash) => {
        const user = get().users.find(u => u.email === email);
        if (!user) return false;

        const updatedUser = { ...user, passwordHash: newPasswordHash };
        set(state => ({
          users: state.users.map(u => u.id === user.id ? updatedUser : u)
        }));
        return true;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ currentUser: null });
      },
      continueAsGuest: () => set({ currentUser: null }),

      // Quiz Actions
      addQuiz: async (quizData) => {
        try {
          const res = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...quizData, createdBy: get().currentUser?.id || 'guest' })
          });
          const newQuiz = await res.json();
          // Local update (socket will also broadcast this, but doing it here for immediate feedback)
          set(state => ({ quizzes: [newQuiz, ...state.quizzes] }));
          return newQuiz._id || newQuiz.id;
        } catch (err) {
          console.error('Add quiz failed:', err);
          return '';
        }
      },

      updateQuiz: async (id, quizData) => {
        // Simple optimistic update for now, could be enhanced with an API call
        set(state => ({
          quizzes: state.quizzes.map(q => (q.id === id || q._id === id) ? { ...q, ...quizData } : q)
        }));
      },

      deleteQuiz: (id) => {
        set(state => ({
          quizzes: state.quizzes.filter(q => q.id !== id && q._id !== id)
        }));
      },

      incrementQuizAttempts: async (id) => {
        try {
          await fetch(`/api/quizzes/${id}/attempt`, { method: 'POST' });
          // Local state will be updated by socket (if realtime is active)
          // or we can do a local update here for immediate feedback
          set(state => ({
            quizzes: state.quizzes.map(q => (q.id === id || q._id === id) ? { ...q, attempts: (q.attempts || 0) + 1 } : q)
          }));
        } catch (err) {
          console.error('Increment attempt failed:', err);
        }
      },

      submitQuizRating: async (id, newRating, comment, userName) => {
        try {
          await fetch(`/api/quizzes/${id}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: newRating, comment, userName })
          });
          // Local state will be updated by socket 'new_review'
        } catch (err) {
          console.error('Rating failed:', err);
        }
      },

      addScore: async (scoreData) => {
        try {
          const res = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...scoreData, userId: get().currentUser?.id || 'guest' })
          });
          if (res.ok) {
            const newScore = await res.json();
            set(state => ({ scores: [newScore, ...state.scores] }));
          }
        } catch (err) {
          console.error('Score submission failed:', err);
        }
      },

      migrateLocalData: async () => {
        try {
          const raw = localStorage.getItem('adhyayan-storage-v2');
          if (!raw) {
            alert("No legacy data found in your browser's memory.");
            return;
          }
          const data = JSON.parse(raw);
          const state = data.state;
          
          let migratedQuizzes = 0;
          let migratedScores = 0;
          let migratedUsers = 0;

          if (state && state.users && state.users.length > 0) {
            const currentUsers = get().users;
            for (const user of state.users) {
              if (!currentUsers.find(u => u.id === user.id || u.email === user.email)) {
                // Since there's no /api/users POST currently, we just add locally
                set(s => ({ users: [...s.users, user] }));
                migratedUsers++;
              }
            }
          }

          if (state && state.quizzes && state.quizzes.length > 0) {
            for (const quiz of state.quizzes) {
              if (!get().quizzes.find(q => q.id === quiz.id || q._id === quiz.id)) {
                await get().addQuiz(quiz);
                migratedQuizzes++;
              }
            }
          }
          if (state && state.scores && state.scores.length > 0) {
            for (const score of state.scores) {
              if (!get().scores.find(s => s.id === score.id || s._id === score._id)) {
                await get().addScore(score);
                migratedScores++;
              }
            }
          }

          await get().init();
          
          if (migratedQuizzes > 0 || migratedScores > 0 || migratedUsers > 0) {
            alert(`Success! Migrated ${migratedUsers} users, ${migratedQuizzes} quizzes, and ${migratedScores} scores.`);
          } else {
            alert("No new data found to migrate.");
          }
        } catch (err) {
          console.error('Migration failed:', err);
          alert("Migration failed. Please check the console for details.");
        }
      }
    }),
    {
      name: 'adhyayan-storage-v4',
    }
  )
);