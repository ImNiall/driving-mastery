-- Create quiz_attempts table for persistent quiz state with attempt ID
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY,
  user_id TEXT NULL, -- Allow null, will be backfilled when auth resolves
  module_slug TEXT NOT NULL,
  current_index INTEGER NOT NULL DEFAULT 0,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  state TEXT NOT NULL CHECK (state IN ('idle', 'active', 'finished')) DEFAULT 'idle',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_answers table for individual answers
CREATE TABLE IF NOT EXISTS quiz_answers (
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  q_index INTEGER NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Each question can only have one answer per attempt
  PRIMARY KEY (attempt_id, q_index)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS quiz_attempts_user_module_idx ON quiz_attempts(user_id, module_slug);
CREATE INDEX IF NOT EXISTS quiz_attempts_state_idx ON quiz_attempts(state);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at for attempts
DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts;
CREATE TRIGGER update_quiz_attempts_updated_at
BEFORE UPDATE ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at for answers
DROP TRIGGER IF EXISTS update_quiz_answers_updated_at ON quiz_answers;
CREATE TRIGGER update_quiz_answers_updated_at
BEFORE UPDATE ON quiz_answers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
