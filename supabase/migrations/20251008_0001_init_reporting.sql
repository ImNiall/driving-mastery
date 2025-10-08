-- Consolidated, idempotent migration for reporting and mastery features
-- Safe to run multiple times.

-- === quiz_attempts: ensure all columns used by functions ===
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='started_at'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN started_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='finished_at'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN finished_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='total'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN total int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='correct'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN correct int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='score_percent'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN score_percent int;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='duration_sec'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN duration_sec int;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='source'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN source text CHECK (source IN ('mock','mini','module')) DEFAULT 'module';
  END IF;

  -- persist progress (resume support)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='current_index'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN current_index int DEFAULT 0;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='state'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN state text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='questions'
  ) THEN
    ALTER TABLE public.quiz_attempts ADD COLUMN questions jsonb;
  END IF;
END $$;

-- === quiz_attempts.id default: ensure UUID default exists ===
DO $$
BEGIN
  -- Try to enable gen_random_uuid() (pgcrypto) if available; ignore if not permitted
  BEGIN
    EXECUTE 'CREATE EXTENSION IF NOT EXISTS pgcrypto';
  EXCEPTION WHEN OTHERS THEN
    -- ignore
    NULL;
  END;

  -- If id column exists but has no default to gen_random_uuid(), set it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_attempts' AND column_name='id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_attrdef d
      JOIN pg_class t ON d.adrelid = t.oid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname='public'
        AND t.relname='quiz_attempts'
        AND pg_get_expr(d.adbin, d.adrelid) ILIKE '%gen_random_uuid%'
    ) THEN
      ALTER TABLE public.quiz_attempts ALTER COLUMN id SET DEFAULT gen_random_uuid();
    END IF;
  END IF;
END $$;

-- === quiz_answers: ensure required columns (user_id, category, is_correct) ===
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_answers' AND column_name='user_id'
  ) THEN
    ALTER TABLE public.quiz_answers ADD COLUMN user_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_answers' AND column_name='category'
  ) THEN
    ALTER TABLE public.quiz_answers ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_answers' AND column_name='is_correct'
  ) THEN
    ALTER TABLE public.quiz_answers ADD COLUMN is_correct boolean;
  END IF;
END $$;

-- Backfill user_id from attempts where possible
UPDATE public.quiz_answers qa
SET user_id = a.user_id
FROM public.quiz_attempts a
WHERE qa.attempt_id = a.id AND qa.user_id IS NULL;

-- FK + NOT NULL for user_id (only if no nulls remain)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='quiz_answers_user_fk') THEN
    ALTER TABLE public.quiz_answers
      ADD CONSTRAINT quiz_answers_user_fk
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.quiz_answers WHERE user_id IS NULL) THEN
    ALTER TABLE public.quiz_answers ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_category ON public.quiz_answers(user_id, category);

-- === module_mastery: table for mastery points ===
CREATE TABLE IF NOT EXISTS public.module_mastery (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  points int NOT NULL DEFAULT 0,
  mastered_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='module_mastery_user_category_key'
  ) THEN
    CREATE UNIQUE INDEX module_mastery_user_category_key ON public.module_mastery(user_id, category);
  END IF;
END $$;

ALTER TABLE public.module_mastery ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='module_mastery' AND policyname='mm_select_own'
  ) THEN
    CREATE POLICY mm_select_own ON public.module_mastery FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='module_mastery' AND policyname='mm_insert_own'
  ) THEN
    CREATE POLICY mm_insert_own ON public.module_mastery FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='module_mastery' AND policyname='mm_update_own'
  ) THEN
    CREATE POLICY mm_update_own ON public.module_mastery FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='module_mastery' AND policyname='mm_delete_own'
  ) THEN
    CREATE POLICY mm_delete_own ON public.module_mastery FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_mastery TO authenticated;

-- === v_category_performance: aggregation view ===
CREATE OR REPLACE VIEW public.v_category_performance AS
SELECT
  qa.user_id,
  COALESCE(qa.category, 'uncategorised') AS category,
  SUM(CASE WHEN qa.is_correct IS TRUE THEN 1 ELSE 0 END)::int AS correct,
  COUNT(*)::int AS total
FROM public.quiz_answers qa
GROUP BY 1, 2;

GRANT SELECT ON public.v_category_performance TO authenticated;

-- Ask PostgREST to reload its schema cache
-- === study_plan_state: per-user study plan persistence ===
CREATE TABLE IF NOT EXISTS public.study_plan_state (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  plan_key text,
  steps jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, plan_key)
);

ALTER TABLE public.study_plan_state ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='study_plan_state' AND policyname='sps_all_own'
  ) THEN
    CREATE POLICY "sps_all_own" ON public.study_plan_state
      FOR ALL TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Final: reload schema so API sees the changes immediately
NOTIFY pgrst, 'reload schema';
