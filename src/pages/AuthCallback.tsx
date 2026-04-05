import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { currentUser, initialized, isAuthLoading } = useStore();
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    console.info('📡 Auth Callback: Observing store...', { 
      hasUser: !!currentUser, 
      initialized, 
      isAuthLoading,
      hash: window.location.hash ? 'Present' : 'None'
    });

    // Case 1: Session Found!
    if (currentUser) {
      console.info('✅ Auth Callback: Session confirmed, moving to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Case 2: Initialization complete but no user found
    // We wait a bit longer specifically on this page before redirecting to login
    if (initialized && !isAuthLoading && hasTimedOut) {
      console.warn('⚠️ Auth Callback: Timeout reached with no session, back to /login');
      navigate('/login', { replace: true });
      return;
    }
  }, [currentUser, initialized, isAuthLoading, navigate, hasTimedOut]);

  // Safety Timeout: If we haven't found a user within 5 seconds, give up
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return <LoadingScreen message="Unlocking your quest..." />;
}
