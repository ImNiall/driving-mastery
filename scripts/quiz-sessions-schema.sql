-- Create quiz_sessions table for persistent quiz state
CREATE TABLE IF NOT EXISTS quiz_sessions (
  user_id UUID NOT NULL,
  quiz_id TEXT NOT NULL,
  state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, quiz_id)
);

-- Add RLS policies
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent execution)
DROP POLICY IF EXISTS select_own_sessions ON quiz_sessions;
DROP POLICY IF EXISTS insert_own_sessions ON quiz_sessions;
DROP POLICY IF EXISTS update_own_sessions ON quiz_sessions;
DROP POLICY IF EXISTS delete_own_sessions ON quiz_sessions;

-- Policy for selecting: users can only see their own sessions
CREATE POLICY select_own_sessions ON quiz_sessions
  FOR SELECT USING ((SELECT auth.uid())::uuid = user_id);

-- Policy for inserting: users can only insert their own sessions
CREATE POLICY insert_own_sessions ON quiz_sessions
  FOR INSERT WITH CHECK ((SELECT auth.uid())::uuid = user_id);

-- Policy for updating: users can only update their own sessions
CREATE POLICY update_own_sessions ON quiz_sessions
  FOR UPDATE USING ((SELECT auth.uid())::uuid = user_id);

-- Policy for deleting: users can only delete their own sessions
CREATE POLICY delete_own_sessions ON quiz_sessions
  FOR DELETE USING ((SELECT auth.uid())::uuid = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_id ON quiz_sessions (quiz_id);

-- Add comment to table
COMMENT ON TABLE quiz_sessions IS 'Stores persistent quiz state for users across sessions';
