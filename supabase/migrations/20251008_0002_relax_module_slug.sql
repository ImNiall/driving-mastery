-- Relax NOT NULL on module_slug for mock attempts and enforce source/slug consistency
-- Safe to run multiple times

alter table if exists public.quiz_attempts
  alter column module_slug drop not null;

-- Add a CHECK constraint to ensure valid combinations
-- mock => module_slug IS NULL
-- mini/module => module_slug IS NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'quiz_attempts_source_slug_check'
  ) THEN
    ALTER TABLE public.quiz_attempts
      ADD CONSTRAINT quiz_attempts_source_slug_check
      CHECK (
        (source = 'mock' AND module_slug IS NULL)
        OR (source IN ('mini','module') AND module_slug IS NOT NULL)
      );
  END IF;
END$$;

-- Helpful index for queries
create index if not exists quiz_attempts_user_started_idx
  on public.quiz_attempts (user_id, started_at desc);
