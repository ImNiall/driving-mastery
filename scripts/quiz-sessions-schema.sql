-- Create quiz_sessions table for persistent quiz state
-- First, check if the table exists and create it if needed
DO $$ 
BEGIN
  -- Create the table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quiz_sessions') THEN
    CREATE TABLE quiz_sessions (
      user_id TEXT NOT NULL, -- Using TEXT for maximum compatibility
      quiz_id TEXT NOT NULL,
      state JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, quiz_id)
    );
  ELSE
    -- If table exists but quiz_id column doesn't, add it
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'quiz_sessions' AND column_name = 'quiz_id') THEN
      ALTER TABLE quiz_sessions ADD COLUMN quiz_id TEXT DEFAULT 'default_quiz';
      
      -- Drop existing primary key if it exists
      DO $$ 
      BEGIN
        IF EXISTS (SELECT FROM information_schema.table_constraints 
                  WHERE table_schema = 'public' AND table_name = 'quiz_sessions' AND constraint_type = 'PRIMARY KEY') THEN
          ALTER TABLE quiz_sessions DROP CONSTRAINT quiz_sessions_pkey;
        END IF;
      END $$;
      
      -- Add new primary key
      ALTER TABLE quiz_sessions ADD PRIMARY KEY (user_id, quiz_id);
    END IF;
  END IF;
END $$;

-- Add RLS policies
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent execution)
DROP POLICY IF EXISTS select_own_sessions ON quiz_sessions;
DROP POLICY IF EXISTS insert_own_sessions ON quiz_sessions;
DROP POLICY IF EXISTS update_own_sessions ON quiz_sessions;
DROP POLICY IF EXISTS delete_own_sessions ON quiz_sessions;

-- Policy for selecting: users can only see their own sessions
CREATE POLICY select_own_sessions ON quiz_sessions
  FOR SELECT USING ((SELECT auth.uid())::text = user_id);

-- Policy for inserting: users can only insert their own sessions
CREATE POLICY insert_own_sessions ON quiz_sessions
  FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id);

-- Policy for updating: users can only update their own sessions
CREATE POLICY update_own_sessions ON quiz_sessions
  FOR UPDATE USING ((SELECT auth.uid())::text = user_id);

-- Policy for deleting: users can only delete their own sessions
CREATE POLICY delete_own_sessions ON quiz_sessions
  FOR DELETE USING ((SELECT auth.uid())::text = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_id ON quiz_sessions (quiz_id);

-- Add comment to table
COMMENT ON TABLE quiz_sessions IS 'Stores persistent quiz state for users across sessions';
