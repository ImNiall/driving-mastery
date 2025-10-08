-- Ensure quiz_answers has question_id and a unique constraint per attempt
-- Safe to run multiple times

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='quiz_answers' AND column_name='question_id'
  ) THEN
    ALTER TABLE public.quiz_answers ADD COLUMN question_id int;
  END IF;
END $$;

-- Unique per attempt per question
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND indexname='quiz_answers_attempt_question_uniq'
  ) THEN
    CREATE UNIQUE INDEX quiz_answers_attempt_question_uniq
      ON public.quiz_answers (attempt_id, question_id);
  END IF;
END $$;

-- Helpful index
CREATE INDEX IF NOT EXISTS quiz_answers_attempt_idx ON public.quiz_answers (attempt_id);
