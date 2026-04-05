import { createClient } from '@supabase/supabase-js';

// Accessing environment variables with flexible detection (Vite and Node.js)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process?.env?.VITE_SUPABASE_URL || process?.env?.SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process?.env?.VITE_SUPABASE_ANON_KEY || process?.env?.SUPABASE_ANON_KEY || '';

// Backend-only key (Secure, Not for browser use)
const supabaseServiceRoleKey = (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY || process?.env?.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing! (Checked VITE_SUPABASE_URL/SUPABASE_URL and VITE_SUPABASE_ANON_KEY/SUPABASE_ANON_KEY)');
}

// Backend use (with service role for admin tasks) - Only initialized if on server with key provided
export const supabaseAdmin = (supabaseServiceRoleKey && supabaseUrl) 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// General use (with anon key)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
