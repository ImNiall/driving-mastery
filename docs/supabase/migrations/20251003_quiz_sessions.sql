-- Create quiz_sessions table for persistent quiz state
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  module_slug TEXT NOT NULL,
  current_index INTEGER NOT NULL DEFAULT 0,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  state TEXT NOT NULL DEFAULT 'idle',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one active session per user per module
  CONSTRAINT unique_user_module UNIQUE (user_id, module_slug)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS quiz_sessions_user_module_idx ON quiz_sessions(user_id, module_slug);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_quiz_sessions_updated_at ON quiz_sessions;
CREATE TRIGGER update_quiz_sessions_updated_at
BEFORE UPDATE ON quiz_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
