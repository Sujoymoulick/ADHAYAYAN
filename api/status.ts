import { createClient } from '@supabase/supabase-js';

// Minimalistic diagnostic function for Vercel
export default async function handler(req: any, res: any) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const diagnostics = {
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: {
      isVercel: !!process.env.VERCEL,
      nodeVersion: process.version,
    },
    envVars: {
      supabaseUrl: supabaseUrl ? '✅ Found' : '❌ MISSING',
      supabaseAnonKey: supabaseAnonKey ? '✅ Found' : '❌ MISSING',
      serviceRoleKey: supabaseServiceRoleKey ? '✅ Found' : '❌ MISSING',
      geminiKey: process.env.GEMINI_API_KEY ? '✅ Found' : '❌ MISSING',
    }
  };

  try {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      return res.status(200).json({
        ...diagnostics,
        database: {
          connection: error ? '❌ FAILED' : '✅ SUCCESS',
          error: error ? error.message : null,
          profileCount: data || 0
        }
      });
    }
    
    res.status(200).json({
      ...diagnostics,
      database: { connection: '⚠️ SKIPPED (Missing Keys)' }
    });
  } catch (err: any) {
    res.status(500).json({
      ...diagnostics,
      error: err.message
    });
  }
}
