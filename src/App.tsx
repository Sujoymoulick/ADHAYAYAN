import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import { AITutor } from './components/AITutor';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import CreateQuiz from './pages/CreateQuiz';
import QuizAttempt from './pages/QuizAttempt';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import QuizDetails from './pages/QuizDetails';

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser && currentUser.isOnboarded === false && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
    }
  }, [currentUser, location.pathname, navigate]);

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((state) => state.currentUser);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function GlobalAuthHandler() {
  const { loginWithOAuth } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    // The previous purge of dummy users has been removed as it was intentionally 
    // wiping seed data that users expected to see for demonstration and testing.


    const handlePendingLogin = () => {
      const pendingLogin = localStorage.getItem('oauth_pending_login');
      if (pendingLogin) {
        try {
          const data = JSON.parse(pendingLogin);
          if (data.type === 'OAUTH_AUTH_SUCCESS') {
            const { user, provider } = data;
            loginWithOAuth({
              email: user.email,
              name: user.name || `${provider} User`,
              avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
            });
            localStorage.removeItem('oauth_pending_login');

            // If we are in the popup window, try to close it
            if (window.name === 'oauth_popup') {
              window.close();
            } else {
              // If we are in the main window, navigate to home
              navigate('/');
            }
          }
        } catch (e) {
          console.error('Error parsing pending login', e);
        }
      }
    };

    // Check on mount
    handlePendingLogin();

    // Check if we should close this window (popup fallback)
    if (window.location.search.includes('close_popup=true')) {
      window.close();
      // If it didn't close, remove the query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Listen for changes from other windows (e.g., the popup)
    window.addEventListener('storage', handlePendingLogin);
    return () => window.removeEventListener('storage', handlePendingLogin);
  }, [loginWithOAuth, navigate]);

  return null;
}

function StoreInitializer() {
  const init = useStore(state => state.init);
  
  useEffect(() => {
    init();
  }, [init]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreInitializer />
      <GlobalAuthHandler />
      <div className="min-h-screen flex flex-col text-slate-50 font-sans" style={{ background: 'transparent' }}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          <OnboardingGuard>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <CreateQuiz />
                </ProtectedRoute>
              } />
              <Route path="/quiz-details/:id" element={<QuizDetails />} />

              <Route path="/quiz/:id" element={<QuizAttempt />} />

              <Route path="/results/:id" element={<Results />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </OnboardingGuard>
        </main>
        <AITutor />
      </div>
    </BrowserRouter>
  );
}
