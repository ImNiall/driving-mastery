-- Create quiz_sessions table for persistent quiz state
CREATE TABLE IF NOT EXISTS quiz_sessions (
  user_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, quiz_id)
);

-- Add RLS policies
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for selecting: users can only see their own sessions
CREATE POLICY select_own_sessions ON quiz_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for inserting: users can only insert their own sessions
CREATE POLICY insert_own_sessions ON quiz_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for updating: users can only update their own sessions
CREATE POLICY update_own_sessions ON quiz_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for deleting: users can only delete their own sessions
CREATE POLICY delete_own_sessions ON quiz_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_id ON quiz_sessions (quiz_id);

-- Add comment to table
COMMENT ON TABLE quiz_sessions IS 'Stores persistent quiz state for users across sessions';
