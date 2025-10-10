-- Ensure required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.progress (
  clerk_user_id text NOT NULL,
  category text NOT NULL,
  correct integer NOT NULL DEFAULT 0 CHECK (correct >= 0),
  total integer NOT NULL DEFAULT 0 CHECK (total >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT progress_pkey PRIMARY KEY (clerk_user_id, category)
);

ALTER TABLE public.progress
  ALTER COLUMN correct SET DEFAULT 0,
  ALTER COLUMN total SET DEFAULT 0,
  ALTER COLUMN updated_at SET DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'progress'
      AND column_name = 'clerk_user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.progress
      ALTER COLUMN clerk_user_id TYPE text USING clerk_user_id::text;
  END IF;
END
$$;

-- quiz_attempts table records the lifecycle of a quiz session
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  source text NOT NULL DEFAULT 'module',
  module_slug text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  total integer NOT NULL DEFAULT 0 CHECK (total >= 0),
  correct integer NOT NULL DEFAULT 0 CHECK (correct >= 0),
  score_percent integer,
  duration_sec integer,
  current_index integer NOT NULL DEFAULT 0 CHECK (current_index >= 0),
  questions jsonb,
  state jsonb
);

ALTER TABLE public.quiz_attempts
  ALTER COLUMN source SET DEFAULT 'module',
  ALTER COLUMN started_at SET DEFAULT now(),
  ALTER COLUMN total SET DEFAULT 0,
  ALTER COLUMN correct SET DEFAULT 0,
  ALTER COLUMN current_index SET DEFAULT 0;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quiz_attempts'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.quiz_attempts
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END
$$;

-- quiz_answers table stores answer-level history per attempt
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  attempt_id uuid NOT NULL,
  user_id text NOT NULL,
  question_id integer NOT NULL,
  category text NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT quiz_answers_pkey PRIMARY KEY (attempt_id, question_id)
);

ALTER TABLE public.quiz_answers
  ALTER COLUMN created_at SET DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quiz_answers'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.quiz_answers
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'quiz_answers_attempt_id_fkey'
      AND conrelid = 'public.quiz_answers'::regclass
  ) THEN
    ALTER TABLE public.quiz_answers
      ADD CONSTRAINT quiz_answers_attempt_id_fkey
      FOREIGN KEY (attempt_id) REFERENCES public.quiz_attempts(id) ON DELETE CASCADE;
  END IF;
END
$$;

-- lesson_progress table for lesson-level progression
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  user_id text NOT NULL,
  lesson_id text NOT NULL,
  progress_count integer NOT NULL DEFAULT 0 CHECK (progress_count >= 0),
  last_progressed_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT lesson_progress_pkey PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress
  ALTER COLUMN progress_count SET DEFAULT 0,
  ALTER COLUMN last_progressed_at SET DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lesson_progress'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.lesson_progress
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lesson_progress'
      AND column_name = 'lesson_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.lesson_progress
      ALTER COLUMN lesson_id TYPE text USING lesson_id::text;
  END IF;
END
$$;

-- module_mastery table aggregates mastery points per module category
CREATE TABLE IF NOT EXISTS public.module_mastery (
  user_id text NOT NULL,
  category text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  mastered_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT module_mastery_pkey PRIMARY KEY (user_id, category)
);

ALTER TABLE public.module_mastery
  ALTER COLUMN points SET DEFAULT 0,
  ALTER COLUMN mastered_at SET DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'module_mastery'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.module_mastery
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END
$$;

-- study_plan_state stores personalised study plans
CREATE TABLE IF NOT EXISTS public.study_plan_state (
  user_id text NOT NULL,
  plan_key text NOT NULL,
  steps jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT study_plan_state_pkey PRIMARY KEY (user_id, plan_key)
);

ALTER TABLE public.study_plan_state
  ALTER COLUMN updated_at SET DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'study_plan_state'
      AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.study_plan_state
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END
$$;

-- usage_limits tracks once-per-day feature usage
CREATE TABLE IF NOT EXISTS public.usage_limits (
  clerk_user_id text NOT NULL,
  feature text NOT NULL,
  used_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT usage_limits_pkey PRIMARY KEY (clerk_user_id, feature, used_on)
);

ALTER TABLE public.usage_limits
  ADD COLUMN IF NOT EXISTS created_at timestamptz;

ALTER TABLE public.usage_limits
  ALTER COLUMN used_on SET DEFAULT current_date,
  ALTER COLUMN created_at SET DEFAULT now();

UPDATE public.usage_limits
SET created_at = now()
WHERE created_at IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'usage_limits'
      AND column_name = 'clerk_user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.usage_limits
      ALTER COLUMN clerk_user_id TYPE text USING clerk_user_id::text;
  END IF;
END
$$;

-- quiz_history stores lightweight summaries of past quiz runs
CREATE TABLE IF NOT EXISTS public.quiz_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_history
  ALTER COLUMN created_at SET DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quiz_history'
      AND column_name = 'clerk_user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.quiz_history
      ALTER COLUMN clerk_user_id TYPE text USING clerk_user_id::text;
  END IF;
END
$$;

-- Create helpful indexes
CREATE INDEX IF NOT EXISTS quiz_attempts_user_started_idx ON public.quiz_attempts (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS quiz_attempts_user_source_idx ON public.quiz_attempts (user_id, source, started_at DESC);
CREATE INDEX IF NOT EXISTS quiz_answers_user_idx ON public.quiz_answers (user_id, category);
CREATE INDEX IF NOT EXISTS lesson_progress_user_idx ON public.lesson_progress (user_id, lesson_id);
CREATE INDEX IF NOT EXISTS module_mastery_user_idx ON public.module_mastery (user_id);
CREATE INDEX IF NOT EXISTS study_plan_state_user_idx ON public.study_plan_state (user_id, plan_key);
CREATE INDEX IF NOT EXISTS usage_limits_user_idx ON public.usage_limits (clerk_user_id, feature, used_on);
CREATE INDEX IF NOT EXISTS quiz_history_user_idx ON public.quiz_history (clerk_user_id, created_at DESC);

-- Increment helper for progress updates
CREATE OR REPLACE FUNCTION public.increment_progress(
  p_clerk_user_id uuid,
  p_category text,
  p_correct integer,
  p_total integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.progress AS p (clerk_user_id, category, correct, total, updated_at)
  VALUES (
    p_clerk_user_id,
    p_category,
    GREATEST(p_correct, 0),
    GREATEST(p_total, 0),
    now()
  )
  ON CONFLICT (clerk_user_id, category)
  DO UPDATE SET
    correct = p.correct + GREATEST(p_correct, 0),
    total = p.total + GREATEST(p_total, 0),
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_progress(uuid, text, integer, integer) TO authenticated;

-- Overloaded lesson-level increment helper requested by app design
CREATE OR REPLACE FUNCTION public.increment_progress(
  p_lesson_id uuid,
  p_inc integer DEFAULT 1
) RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF p_lesson_id IS NULL THEN
    RAISE EXCEPTION 'Lesson id is required';
  END IF;

  INSERT INTO public.lesson_progress AS lp (user_id, lesson_id, progress_count, last_progressed_at)
  VALUES (auth.uid(), p_lesson_id, GREATEST(p_inc, 0), now())
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    progress_count = lp.progress_count + GREATEST(p_inc, 0),
    last_progressed_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_progress(uuid, integer) TO authenticated;

-- Derived view for progress overview queries
CREATE OR REPLACE VIEW public.v_category_performance AS
SELECT
  qa.user_id,
  qa.category,
  COUNT(*) FILTER (WHERE qa.is_correct)::int AS correct,
  COUNT(*)::int AS total
FROM public.quiz_answers AS qa
GROUP BY qa.user_id, qa.category;

ALTER VIEW public.v_category_performance SET (security_invoker = true);

CREATE OR REPLACE FUNCTION public.current_subject()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT nullif(auth.jwt()->>'sub', '')
$$;

-- Enable RLS on user-owned tables
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress FORCE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts FORCE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers FORCE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress FORCE ROW LEVEL SECURITY;
ALTER TABLE public.module_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_mastery FORCE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_state FORCE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits FORCE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_history FORCE ROW LEVEL SECURITY;

-- Row level policies (idempotent guards)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'progress' AND policyname = 'progress_owner') THEN
    CREATE POLICY progress_owner ON public.progress
      FOR ALL
      USING (clerk_user_id::text = public.current_subject())
      WITH CHECK (clerk_user_id::text = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quiz_attempts' AND policyname = 'quiz_attempts_owner') THEN
    CREATE POLICY quiz_attempts_owner ON public.quiz_attempts
      FOR ALL
      USING (user_id::text = public.current_subject())
      WITH CHECK (user_id::text = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quiz_answers' AND policyname = 'quiz_answers_owner') THEN
    CREATE POLICY quiz_answers_owner ON public.quiz_answers
      FOR ALL
      USING (user_id::text = public.current_subject())
      WITH CHECK (user_id::text = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'lesson_progress' AND policyname = 'lesson_progress_owner') THEN
    CREATE POLICY lesson_progress_owner ON public.lesson_progress
      FOR ALL
      USING (user_id::text = public.current_subject())
      WITH CHECK (user_id::text = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'module_mastery' AND policyname = 'module_mastery_owner') THEN
    CREATE POLICY module_mastery_owner ON public.module_mastery
      FOR ALL
      USING (user_id::text = public.current_subject())
      WITH CHECK (user_id::text = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'study_plan_state' AND policyname = 'study_plan_state_owner') THEN
    CREATE POLICY study_plan_state_owner ON public.study_plan_state
      FOR ALL
      USING (user_id::text = public.current_subject())
      WITH CHECK (user_id::text = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'usage_limits' AND policyname = 'usage_limits_owner') THEN
    CREATE POLICY usage_limits_owner ON public.usage_limits
      FOR ALL
      USING (clerk_user_id = public.current_subject())
      WITH CHECK (clerk_user_id = public.current_subject());
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'quiz_history' AND policyname = 'quiz_history_owner') THEN
    CREATE POLICY quiz_history_owner ON public.quiz_history
      FOR ALL
      USING (clerk_user_id = public.current_subject())
      WITH CHECK (clerk_user_id = public.current_subject());
  END IF;
END
$$;
