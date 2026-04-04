import { createClient } from '@supabase/supabase-js';

// Safe environment variable accessor for both Browser (Vite) and Node
const getEnv = (key: string): string => {
  // 1. Check Vite's import.meta.env first (Browser)
  try {
    const viteEnv = (import.meta as any).env;
    if (viteEnv && viteEnv[key]) return viteEnv[key];
  } catch (e) {
    // Silence error, we'll try process.env next
  }

  // 2. Check Node's process.env (Server/Vercel Functions)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] || '';
    }
  } catch (e) {
    // Silence error
  }

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing! Authentication features will be disabled.');
}

// Backend use (with service role for admin tasks)
export const supabaseAdmin = (typeof process !== 'undefined' && supabaseServiceRoleKey) 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// General use (with anon key)
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
