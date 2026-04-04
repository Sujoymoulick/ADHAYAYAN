import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthCallback() {
  const navigate = useNavigate();
  const init = useStore(state => state.init);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        await init();
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('❌ Auth Fresh Start Error:', err);
        navigate('/login?error=bad_oauth_state', { replace: true });
      }
    };

    handleAuthCallback();
  }, [init, navigate]);

  return <LoadingScreen />;
}
