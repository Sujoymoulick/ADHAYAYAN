import { create } from 'zustand';
import { User, Quiz, Score } from '../types';
import { supabase } from '../lib/supabase';
 
 const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

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

export const useStore = create<AppState>()((set, get) => ({
  users: [],
  quizzes: [],
  scores: [],
  currentUser: null,
  initialized: false,
  isAuthLoading: true,

  init: async () => {
    try {
      set({ isAuthLoading: true });
      console.info('📡 Adhyayan (Fresh) Init Start...', {
        origin: window.location.origin,
        pathname: window.location.pathname,
        timestamp: new Date().toISOString()
      });

      // 1. Get Session Directly (Critical for OAuth callback)
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
        console.info('👤 No session found, user is guest');
        set({ currentUser: null, isAuthLoading: false });
      }

      // 2. Setup Auth State Listener (Only once)
      if (!get().initialized) {
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.info(`🔐 Auth event triggered: ${event}`);
          if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            const { user } = session;
            // Only re-sync if the user has changed or currentUser is basic fallback
            if (get().currentUser?.id !== user.id) {
              await get().loginWithOAuth({
                id: user.id,
                email: user.email || '',
                name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                avatar: user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
              });
            }
          } else if (event === 'SIGNED_OUT') {
            set({ currentUser: null, initialized: true, isAuthLoading: false });
          }
        });
      };

      // 4. Data Loading (Quizzes/Scores)
      const { currentUser } = get();
      if (currentUser) {
        const [quizzesRes, scoresRes] = await Promise.all([
          fetch(`${API_BASE}/api/quizzes?userId=${currentUser?.id || ''}`),
          fetch(`${API_BASE}/api/scores`)
        ]).catch(err => {
          console.error('Fetch error during init:', err);
          return [null, null];
        });

        if (quizzesRes?.ok && scoresRes?.ok) {
          const quizzes = (await quizzesRes.json()) || [];
          const scores = (await scoresRes.json()) || [];
          set({ 
            quizzes: quizzes.length > 0 ? quizzes : get().quizzes, 
            scores: scores.length > 0 ? scores : get().scores
          });
        }
      }

      // 5. Setup Realtime Listeners
      if (!get().initialized) {
        supabase
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

        supabase
          .channel('public:scores')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scores' }, (payload) => {
            const score = snakeToCamel(payload.new);
            set(state => ({ scores: [score, ...state.scores] }));
          })
          .subscribe();
      }

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

      const res = await fetch(`${API_BASE}/api/user/update`, {
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
      // Removed local update fallback to ensure consistency with backend
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
      
      // Only attempt backend sync if we have a valid UUID
      const isValidUuid = userData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userData.id);
      
      if (isValidUuid) {
        try {
          const res = await fetch(`${API_BASE}/api/user/sync`, {
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
            set(state => ({
              currentUser: user,
              isAuthLoading: false,
              users: state.users.some(u => u.id === user.id) 
                ? state.users.map(u => u.id === user.id ? user : u)
                : [...state.users, user]
            }));

            const quizzesRes = await fetch(`${API_BASE}/api/quizzes?userId=${user.id}`);
            if (quizzesRes.ok) {
              const quizzes = await quizzesRes.json();
              set({ quizzes });
            }
            return;
          }
        } catch (syncErr) {
          console.error('⚠️ Sync failed or timeout, falling back to local Supabase profile:', syncErr);
        }
      }

      console.warn('❌ Backend sync failed! Falling back to base session data to prevent login loop.');
      set({ 
        currentUser: {
          ...get().currentUser, // Preserve existing data
          id: userData.id || `temp_${Date.now()}`,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          bio: userData.bio || 'Passionate Learner 🚀',
          isOnboarded: userData.isOnboarded ?? get().currentUser?.isOnboarded ?? false,
          isFirstTimeUser: userData.isFirstTimeUser ?? get().currentUser?.isFirstTimeUser ?? true,
          profession: userData.profession ?? get().currentUser?.profession ?? '',
          interestedCategories: userData.interestedCategories ?? get().currentUser?.interestedCategories ?? [],
          totalScore: userData.totalScore || get().currentUser?.totalScore || 0,
          passwordHash: '',
          badges: userData.badges || get().currentUser?.badges || [],
          createdAt: userData.createdAt || get().currentUser?.createdAt || Date.now()
        } as User,
        isAuthLoading: false 
      });
    } catch (err) {
      console.error('❌ Authentication flow error:', err);
      set({ currentUser: null, isAuthLoading: false });
    }
  },

  register: async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.passwordHash,
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
      const res = await fetch(`${API_BASE}/api/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...quizData, createdBy: get().currentUser?.id || 'guest' })
      });
      const newQuiz = await res.json();
      set(state => ({ quizzes: [newQuiz, ...state.quizzes] }));
      return newQuiz._id || newQuiz.id;
    } catch (err) {
      console.error('Add quiz failed:', err);
      return '';
    }
  },

  updateQuiz: async (id, quizData) => {
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
      await fetch(`${API_BASE}/api/quizzes/${id}/attempt`, { method: 'POST' });
      set(state => ({
        quizzes: state.quizzes.map(q => (q.id === id || q._id === id) ? { ...q, attempts: (q.attempts || 0) + 1 } : q)
      }));
    } catch (err) {
      console.error('Increment attempt failed:', err);
    }
  },

  submitQuizRating: async (id, newRating, comment, userName) => {
    try {
      await fetch(`${API_BASE}/api/quizzes/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, comment, userName })
      });
    } catch (err) {
      console.error('Rating failed:', err);
    }
  },

  addScore: async (scoreData) => {
    try {
      const res = await fetch(`${API_BASE}/api/scores`, {
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
  }
}));
