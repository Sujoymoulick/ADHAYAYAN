import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Error: Supabase environment variables are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  const tables = ['quizzes', 'profiles', 'scores'];
  console.log('Checking for tables in Supabase...');

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(0);
    if (error) {
      console.log(`❌ Table '${table}': Not found or Error - ${error.message}`);
    } else {
      console.log(`✅ Table '${table}': Found!`);
    }
  }
}

checkTables();
