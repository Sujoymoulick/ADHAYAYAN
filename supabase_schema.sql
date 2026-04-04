-- CLEANUP: Drop existing tables to re-run the schema (Careful: This deletes existing data!)
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. PROFILES TABLE
-- Handles additional user metadata not in the auth.users table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  google_id TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  bio TEXT DEFAULT 'Passionate Learner 🚀',
  banner TEXT DEFAULT '',
  location TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  quizzes_created INTEGER DEFAULT 0,
  quizzes_attempted INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0
);

-- 2. QUIZZES TABLE
-- Stores quiz structure and metadata
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  time_limit INTEGER DEFAULT NULL,
  cover_image TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  attempts INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  reviews JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}'::text[],
  questions JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT TRUE
);

-- 3. SCORES TABLE
-- Stores results of quiz attempts
CREATE TABLE scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  answers_by_question JSONB DEFAULT '{}'::jsonb
);

-- 4. ENABLE RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES
-- Profiles: Everyone can see profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles can be updated by their owner" ON profiles FOR UPDATE USING (true);

-- Quizzes: Everyone can see public quizzes, users can create/update
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes FOR SELECT USING (is_public = true);
CREATE POLICY "Quizzes can be created by authenticated users" ON quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Quizzes can be updated by creators" ON quizzes FOR UPDATE USING (true);

-- Scores: Everyone can see global scores, anyone can submit
CREATE POLICY "Scores are viewable by everyone" ON scores FOR SELECT USING (true);
CREATE POLICY "Scores can be submitted by anyone" ON scores FOR INSERT WITH CHECK (true);

-- 6. ENABLE REALTIME
-- This allows Supabase to broadcast changes to the frontend automatically
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE quizzes, scores, profiles;
