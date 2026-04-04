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
        // ALWAYS check for session, regardless of initialized flag
        // This prevents the 'initialized: true' state from skipping the OAuth callback
        try {
          // 1. Setup Supabase Auth Listener & Session Check
          const hasAuthFragment = window.location.hash.includes('access_token=') || 
                                  window.location.search.includes('code=');
          
          if (hasAuthFragment) {
            console.info('📡 Auth fragment detected, waiting for session resolution...');
            let retries = 0;
            while (retries < 4) {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.user) {
                console.info('✅ Session resolved from URL hash!');
                await get().loginWithOAuth({
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                  avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
                });
                break;
              }
              await new Promise(r => setTimeout(r, 500));
              retries++;
            }
          } else if (!get().currentUser) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              await get().loginWithOAuth({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                avatar: session.user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`
              });
            }
          }

          // Setup Auth state listener (only once)
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

        } catch (err) {
          console.error('Auth initialization failed:', err);
        }

        if (get().initialized) {
          set({ isAuthLoading: false });
          return;
        }
        
        console.info('🛠️ Initializing Adhyayan Store...');
        try {
          const [quizzesRes, scoresRes] = await Promise.all([
            fetch('/api/quizzes'),
            fetch('/api/scores')
          ]);

          if (quizzesRes.ok && scoresRes.ok) {
            const quizzes = (await quizzesRes.json()) || [];
            const scores = (await scoresRes.json()) || [];

            set({ 
              quizzes: quizzes.length > 0 ? quizzes : get().quizzes, 
              scores: scores.length > 0 ? scores : get().scores, 
              initialized: true 
            });
          }

          // 3. Setup Supabase Realtime Listeners
          const quizChannel = supabase
            .channel('public:quizzes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'quizzes' }, (payload) => {
              const quiz = snakeToCamel(payload.new);
              console.info('📡 Realtime: New quiz received', quiz.title);
              set(state => ({ quizzes: [quiz, ...state.quizzes] }));
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'quizzes' }, (payload) => {
              const updatedQuiz = snakeToCamel(payload.new);
              console.info('📡 Realtime: Quiz updated', updatedQuiz.title);
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

          set({ isAuthLoading: false });
        } catch (err) {
          console.error('Failed to initialize store from server:', err);
          set({ initialized: true, isAuthLoading: false });
        }
      },

      // Profile Actions
      setUser: (user) => set(state => ({
        currentUser: user,
        users: state.users.map(u => u.id === user.id ? user : u)
      })),

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
          
          if (!res.ok) throw new Error('Failed to sync user');
          
          const { user } = await res.json();
          console.info('✅ User synchronized with backend:', user.email);
          
          set(state => ({
            currentUser: user,
            users: state.users.some(u => u.id === user.id) 
              ? state.users.map(u => u.id === user.id ? user : u)
              : [...state.users, user]
          }));
        } catch (err) {
          console.error('❌ OAuth sync failed or timed out:', err);
          // Fallback to local-only if sync fails (offline mode)
          const newUser: User = {
            ...userData,
            passwordHash: 'oauth_user',
            id: userData.id || `u_${Date.now()}`,
            createdAt: Date.now(),
            badges: ['First Quiz'],
            bio: "Passionate Learner 🚀",
            isOnboarded: false
          } as User;
          set({ currentUser: newUser });
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

      incrementQuizAttempts: (id) => {
        set(state => ({
          quizzes: state.quizzes.map(q => (q.id === id || q._id === id) ? { ...q, attempts: (q.attempts || 0) + 1 } : q)
        }));
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
          const newScore = await res.json();
          set(state => ({ scores: [newScore, ...state.scores] }));
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