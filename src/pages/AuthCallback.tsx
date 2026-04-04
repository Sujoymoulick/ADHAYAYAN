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
        console.info('📡 AuthCallback: Exchanging code for session...');
        
        // 1. Manually trigger session recovery if Supabase hasn't yet
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          console.info('✅ AuthCallback: Session confirmed!', session.user.email);
          // 2. Re-initialize the store to ensure backend sync happens with the new session
          await init();
          // 3. Final redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          console.warn('⚠️ AuthCallback: No session found, redirecting to login...');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('❌ AuthCallback: Failed to exchange session:', err);
        navigate('/login?error=bad_oauth_state', { replace: true });
      }
    };

    handleAuthCallback();
  }, [init, navigate]);

  return <LoadingScreen />;
}
