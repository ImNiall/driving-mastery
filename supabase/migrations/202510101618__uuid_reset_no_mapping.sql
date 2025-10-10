-- Destructive UUID reset migration without legacy mapping
-- All data loss in scope tables is intentional and owner-approved.

CREATE OR REPLACE FUNCTION public._drop_policy_if_exists(tbl regclass, pol_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  target_schema text := split_part(tbl::text, '.', 1);
  target_table text := split_part(tbl::text, '.', 2);
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = target_schema
      AND tablename = target_table
      AND policyname = pol_name
  ) THEN
    EXECUTE format('DROP POLICY %I ON %s', pol_name, tbl::text);
  END IF;
END;
$$;

-- Reset progress table
TRUNCATE TABLE public.progress CASCADE;
ALTER TABLE public.progress
  DROP CONSTRAINT IF EXISTS progress_clerk_user_id_category_key,
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.progress
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now();
DROP INDEX IF EXISTS idx_progress_user;
DROP INDEX IF EXISTS idx_progress_user_cat;
ALTER TABLE public.progress
  ADD CONSTRAINT progress_user_id_category_key UNIQUE (user_id, category);
CREATE INDEX IF NOT EXISTS progress_user_id_idx ON public.progress (user_id);
CREATE INDEX IF NOT EXISTS progress_user_id_category_idx ON public.progress (user_id, category);
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.progress', 'progress_select_own');
SELECT public._drop_policy_if_exists('public.progress', 'progress_insert_own');
SELECT public._drop_policy_if_exists('public.progress', 'progress_update_own');
SELECT public._drop_policy_if_exists('public.progress', 'progress_delete_own');
CREATE POLICY progress_select_own ON public.progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY progress_insert_own ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY progress_update_own ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY progress_delete_own ON public.progress
  FOR DELETE USING (auth.uid() = user_id);

-- Reset quiz_history table
TRUNCATE TABLE public.quiz_history CASCADE;
DROP INDEX IF EXISTS idx_quiz_history_user;
DROP INDEX IF EXISTS idx_quiz_history_user_time;
ALTER TABLE public.quiz_history
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.quiz_history
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now();
CREATE INDEX IF NOT EXISTS quiz_history_user_idx ON public.quiz_history (user_id);
CREATE INDEX IF NOT EXISTS quiz_history_user_time_idx ON public.quiz_history (user_id, created_at DESC);
ALTER TABLE public.quiz_history ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.quiz_history', 'quiz_history_select_own');
SELECT public._drop_policy_if_exists('public.quiz_history', 'quiz_history_insert_own');
SELECT public._drop_policy_if_exists('public.quiz_history', 'quiz_history_update_own');
SELECT public._drop_policy_if_exists('public.quiz_history', 'quiz_history_delete_own');
CREATE POLICY quiz_history_select_own ON public.quiz_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY quiz_history_insert_own ON public.quiz_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY quiz_history_update_own ON public.quiz_history
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY quiz_history_delete_own ON public.quiz_history
  FOR DELETE USING (auth.uid() = user_id);

-- Reset usage_limits table
TRUNCATE TABLE public.usage_limits CASCADE;
ALTER TABLE public.usage_limits
  DROP CONSTRAINT IF EXISTS usage_limits_clerk_user_id_feature_used_on_key;
DROP INDEX IF EXISTS idx_usage_limits;
ALTER TABLE public.usage_limits
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.usage_limits
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN used_on SET DEFAULT (now() AT TIME ZONE 'utc')::date,
  ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.usage_limits
  ADD CONSTRAINT usage_limits_user_id_feature_used_on_key UNIQUE (user_id, feature, used_on);
CREATE INDEX IF NOT EXISTS usage_limits_user_idx ON public.usage_limits (user_id, feature, used_on);
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.usage_limits', 'usage_limits_select_own');
SELECT public._drop_policy_if_exists('public.usage_limits', 'usage_limits_insert_own');
SELECT public._drop_policy_if_exists('public.usage_limits', 'usage_limits_update_own');
SELECT public._drop_policy_if_exists('public.usage_limits', 'usage_limits_delete_own');
CREATE POLICY usage_limits_select_own ON public.usage_limits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY usage_limits_insert_own ON public.usage_limits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY usage_limits_update_own ON public.usage_limits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY usage_limits_delete_own ON public.usage_limits
  FOR DELETE USING (auth.uid() = user_id);

-- Reset bookmarks table
TRUNCATE TABLE public.bookmarks CASCADE;
ALTER TABLE public.bookmarks
  DROP CONSTRAINT IF EXISTS bookmarks_clerk_user_id_lesson_id_key,
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.bookmarks
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.bookmarks
  ADD CONSTRAINT bookmarks_user_id_lesson_id_key UNIQUE (user_id, lesson_id);
ALTER TABLE public.bookmarks
  ADD CONSTRAINT bookmarks_user_fk FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS bookmarks_user_idx ON public.bookmarks (user_id, lesson_id);
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.bookmarks', 'bookmarks_select_own');
SELECT public._drop_policy_if_exists('public.bookmarks', 'bookmarks_insert_own');
SELECT public._drop_policy_if_exists('public.bookmarks', 'bookmarks_update_own');
SELECT public._drop_policy_if_exists('public.bookmarks', 'bookmarks_delete_own');
CREATE POLICY bookmarks_select_own ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY bookmarks_insert_own ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY bookmarks_update_own ON public.bookmarks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY bookmarks_delete_own ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Reset profiles table
TRUNCATE TABLE public.profiles CASCADE;
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_key,
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.profiles
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_fk FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS profiles_user_idx ON public.profiles (user_id);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.profiles', 'profiles_select_own');
SELECT public._drop_policy_if_exists('public.profiles', 'profiles_insert_own');
SELECT public._drop_policy_if_exists('public.profiles', 'profiles_update_own');
SELECT public._drop_policy_if_exists('public.profiles', 'profiles_delete_own');
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY profiles_delete_own ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Reset purchases table
TRUNCATE TABLE public.purchases CASCADE;
DROP INDEX IF EXISTS idx_purchases_user;
DROP INDEX IF EXISTS idx_purchases_user_status;
DROP INDEX IF EXISTS uq_active_sub;
ALTER TABLE public.purchases
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.purchases
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN user_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS purchases_user_idx ON public.purchases (user_id);
CREATE INDEX IF NOT EXISTS purchases_user_status_idx ON public.purchases (user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS purchases_active_unique ON public.purchases (user_id) WHERE status = 'active';
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.purchases', 'purchases_select_own');
SELECT public._drop_policy_if_exists('public.purchases', 'purchases_insert_own');
SELECT public._drop_policy_if_exists('public.purchases', 'purchases_update_own');
SELECT public._drop_policy_if_exists('public.purchases', 'purchases_delete_own');
CREATE POLICY purchases_select_own ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY purchases_insert_own ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY purchases_update_own ON public.purchases
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY purchases_delete_own ON public.purchases
  FOR DELETE USING (auth.uid() = user_id);

DROP TABLE IF EXISTS public.quiz_sessions CASCADE;
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_slug text NOT NULL,
  current_index integer NOT NULL DEFAULT 0,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  state text NOT NULL DEFAULT 'idle'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  quiz_id text NOT NULL DEFAULT 'default_quiz'
);
ALTER TABLE public.quiz_sessions
  ADD CONSTRAINT quiz_sessions_pkey PRIMARY KEY (user_id, quiz_id);
CREATE UNIQUE INDEX IF NOT EXISTS quiz_sessions_id_key ON public.quiz_sessions (id);
CREATE INDEX IF NOT EXISTS quiz_sessions_user_idx ON public.quiz_sessions (user_id);
CREATE INDEX IF NOT EXISTS quiz_sessions_user_module_idx ON public.quiz_sessions (user_id, module_slug);
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY quiz_sessions_select_own ON public.quiz_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY quiz_sessions_insert_own ON public.quiz_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY quiz_sessions_update_own ON public.quiz_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY quiz_sessions_delete_own ON public.quiz_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Reset user_achievements table
TRUNCATE TABLE public.user_achievements CASCADE;
ALTER TABLE public.user_achievements
  DROP CONSTRAINT IF EXISTS user_achievements_clerk_user_id_achievement_key_key,
  DROP COLUMN IF EXISTS clerk_user_id,
  ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.user_achievements
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN unlocked_at SET DEFAULT now(),
  ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_achievements
  ADD CONSTRAINT user_achievements_user_id_achievement_key_key UNIQUE (user_id, achievement_key);
CREATE INDEX IF NOT EXISTS user_achievements_user_idx ON public.user_achievements (user_id, achievement_key);
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
SELECT public._drop_policy_if_exists('public.user_achievements', 'user_achievements_select_own');
SELECT public._drop_policy_if_exists('public.user_achievements', 'user_achievements_insert_own');
SELECT public._drop_policy_if_exists('public.user_achievements', 'user_achievements_update_own');
SELECT public._drop_policy_if_exists('public.user_achievements', 'user_achievements_delete_own');
CREATE POLICY user_achievements_select_own ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_achievements_insert_own ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_achievements_update_own ON public.user_achievements
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_achievements_delete_own ON public.user_achievements
  FOR DELETE USING (auth.uid() = user_id);

-- Align increment_progress RPC with UUID ownership
DROP FUNCTION IF EXISTS public.increment_progress(p_clerk_user_id text, p_category text, p_correct integer, p_total integer);
CREATE OR REPLACE FUNCTION public.increment_progress(p_user_id uuid, p_category text, p_correct integer, p_total integer)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  INSERT INTO public.progress (user_id, category, correct, total, updated_at)
  VALUES (p_user_id, p_category, greatest(p_correct, 0), greatest(p_total, 0), now())
  ON CONFLICT (user_id, category)
  DO UPDATE SET
    correct = public.progress.correct + greatest(EXCLUDED.correct, 0),
    total   = public.progress.total   + greatest(EXCLUDED.total, 0),
    updated_at = now();
END;
$$;

-- Ensure modules/lessons remain publicly readable
DO $$
BEGIN
  IF to_regclass('public.modules') IS NOT NULL THEN
    ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_policy_if_exists('public.modules', 'modules_public_read');
    CREATE POLICY modules_public_read ON public.modules FOR SELECT USING (TRUE);
  END IF;
  IF to_regclass('public.lessons') IS NOT NULL THEN
    ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
    PERFORM public._drop_policy_if_exists('public.lessons', 'lessons_public_read');
    CREATE POLICY lessons_public_read ON public.lessons FOR SELECT USING (TRUE);
  END IF;
END
$$;
