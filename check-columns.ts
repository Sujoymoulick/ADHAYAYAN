import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log('Error: Supabase environment variables are missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkColumns() {
  console.log('Checking columns in profiles table...');
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  
  if (error) {
    console.error('❌ Error fetching from profiles:', error.message);
    return;
  }
  
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
  console.log('Available columns in profiles:', columns);
  
  const expected = ['profession', 'interested_categories', 'is_onboarded'];
  expected.forEach(col => {
    if (columns.includes(col)) {
      console.log(`✅ Column '${col}': Found!`);
    } else {
      console.log(`❌ Column '${col}': MISSING!`);
    }
  });
}

checkColumns();
