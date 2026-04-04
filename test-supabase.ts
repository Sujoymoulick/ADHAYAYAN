import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Checking Supabase connection...');
console.log('URL:', supabaseUrl ? 'Present' : 'MISSING');
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'MISSING');

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Error: Supabase environment variables are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('quizzes').select('*').limit(1);
    if (error) {
      console.error('Connection error:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Data sample:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
