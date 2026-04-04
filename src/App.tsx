import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import CreateQuiz from './pages/CreateQuiz';
import QuizAttempt from './pages/QuizAttempt';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import LoadingScreen from './components/LoadingScreen';
import QuizDetails from './pages/QuizDetails';
import AuthCallback from './pages/AuthCallback';

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthLoading, initialized } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Wait for the store to be at least once initialized
    if (!initialized || isAuthLoading) return;

    if (currentUser) {
      const needsOnboarding = currentUser.isOnboarded === false || currentUser.isOnboarded === undefined;
      
      if (needsOnboarding && location.pathname !== '/onboarding' && !location.pathname.startsWith('/login')) {
        console.info('🛡️ Guard: Redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else if (!needsOnboarding && location.pathname === '/onboarding') {
        console.info('🛡️ Guard: Onboarding complete, to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, isAuthLoading, initialized, location.pathname, navigate]);

  if (!initialized || isAuthLoading) return <LoadingScreen />;

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthLoading, initialized } = useStore();
  
  if (!initialized || isAuthLoading) return <LoadingScreen />;
  
  if (!currentUser) {
    console.warn('🛡️ ProtectedRoute: Unauthenticated, to /login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function HomeRedirect() {
  const { currentUser, isAuthLoading } = useStore();
  
  if (isAuthLoading) return <LoadingScreen />;
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
}

function StoreInitializer() {
  const { init, currentUser, isAuthLoading, initialized } = useStore();
  
  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (initialized) {
      console.info('🛡️ App Guard State:', { 
        hasUser: !!currentUser, 
        email: currentUser?.email,
        isAuthLoading,
        initialized,
        path: window.location.pathname
      });
    }
  }, [currentUser, isAuthLoading, initialized]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreInitializer />
      <div className="min-h-screen flex flex-col text-slate-50 font-sans" style={{ background: 'transparent' }}>
        <Navbar />
        <main className="flex-1 flex flex-col">
          <OnboardingGuard>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
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
      </div>
    </BrowserRouter>
  );
}
