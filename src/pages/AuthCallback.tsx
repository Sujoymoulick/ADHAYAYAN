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
        console.info('📡 Auth Fresh Start: Waiting for session settlement (500ms)...');
        
        // Give Supabase a tiny window to finish processing the Hash/Code internally
        await new Promise(r => setTimeout(r, 500));
        
        await init();
        
        const { currentUser } = useStore.getState();
        if (currentUser) {
          console.info('✅ Auth Fresh Start: Session confirmed, moving to dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          console.warn('⚠️ Auth Fresh Start: No session detected after init, back to /login');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('❌ Auth Fresh Start Error:', err);
        navigate('/login?error=bad_oauth_state', { replace: true });
      }
    };

    handleAuthCallback();
  }, [init, navigate]);

  return <LoadingScreen />;
}
