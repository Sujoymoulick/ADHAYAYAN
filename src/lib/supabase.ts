import { createClient } from '@supabase/supabase-js';

// Support both Vite (browser) and Node (server) environments
const supabaseUrl = 
  (typeof (import.meta as any).env !== 'undefined' && (import.meta as any).env.VITE_SUPABASE_URL) || 
  process.env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  (typeof (import.meta as any).env !== 'undefined' && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) || 
  process.env.SUPABASE_ANON_KEY || 
  '';

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Backend use (with service role for admin tasks)
// Only initialize if service role key is present (server-side)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// General use (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
