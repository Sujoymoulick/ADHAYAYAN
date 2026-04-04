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
