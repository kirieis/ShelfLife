-- ShelfLife: supabase/books.sql
-- Run this script in your Supabase SQL Editor to set up the database

-- 1. Create the books table
CREATE TABLE IF NOT EXISTS books (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title       text NOT NULL CHECK (length(trim(title)) > 0 AND length(title) <= 80),
  author      text NOT NULL CHECK (length(trim(author)) > 0 AND length(author) <= 60),
  pages       integer NOT NULL CHECK (pages >= 1 AND pages <= 5000),
  status      text NOT NULL DEFAULT 'To Read' CHECK (status IN ('To Read', 'Reading', 'Finished')),
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies
-- Users can only read their own rows
CREATE POLICY "Users can view own books"
  ON books FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert rows belonging to themselves
CREATE POLICY "Users can insert own books"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rows
CREATE POLICY "Users can update own books"
  ON books FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own rows
CREATE POLICY "Users can delete own books"
  ON books FOR DELETE
  USING (auth.uid() = user_id);

