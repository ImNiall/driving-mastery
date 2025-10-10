# Supabase UUID Reset Report

## Overview

- **Objective**: Remove all Clerk-era text identifiers, enforce UUID ownership, and align RLS with `auth.uid()` after owner-approved data reset.
- **Authorization**: Destructive changes were explicitly approved. All truncated data originated from personal test accounts.
- **Migration**: `supabase/migrations/202510101618__uuid_reset_no_mapping.sql` (idempotent) performs the reset, recreates policies, and updates RPCs.

## Data Impact

- **Intentional truncation**: `progress`, `quiz_history`, `usage_limits`, `bookmarks`, `profiles`, `purchases`, `quiz_sessions`, `user_achievements` are emptied via `TRUNCATE ... CASCADE` before schema rebuild.☑
- **Legacy columns removed**: `clerk_user_id` columns dropped everywhere; replaced with `user_id uuid NOT NULL`.
- **RPC update**: `public.increment_progress()` now accepts `p_user_id uuid` and writes to the new `progress.user_id` column.

## Schema & RLS Summary

| Table                      | Key columns after reset                                             | Indexes / Constraints                                                             | RLS policies                                               |
| -------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `public.progress`          | `user_id uuid`, `category`, `correct`, `total`, `updated_at`        | Unique `(user_id, category)`, idx on `(user_id)` & `(user_id, category)`          | select/insert/update/delete require `auth.uid() = user_id` |
| `public.quiz_history`      | `user_id uuid`, `score`, `total`, `details`, `created_at`           | idx `(user_id)`, `(user_id, created_at DESC)`                                     | select/insert/update/delete require `auth.uid() = user_id` |
| `public.usage_limits`      | `id uuid`, `user_id uuid`, `feature`, `used_on` default UTC date    | Unique `(user_id, feature, used_on)`                                              | select/insert/update/delete require `auth.uid() = user_id` |
| `public.bookmarks`         | `id uuid`, `user_id uuid`, `lesson_id uuid`, `created_at`           | FK to `lessons`, unique `(user_id, lesson_id)`                                    | select/insert/update/delete require `auth.uid() = user_id` |
| `public.profiles`          | `id uuid`, `user_id uuid`, `email`, `name`, `created_at`            | Unique `(user_id)`                                                                | select/insert/update/delete require `auth.uid() = user_id` |
| `public.purchases`         | `id uuid`, `user_id uuid`, plan/stripe fields, timestamps           | idx `(user_id)`, `(user_id, status)`, partial active unique                       | select/insert/update/delete require `auth.uid() = user_id` |
| `public.quiz_sessions`     | rebuilt table: `id uuid`, `user_id uuid`, question state, `quiz_id` | PK `(user_id, quiz_id)`, unique `(id)`, idx `(user_id)`, `(user_id, module_slug)` | select/insert/update/delete require `auth.uid() = user_id` |
| `public.user_achievements` | `id uuid`, `user_id uuid`, `achievement_key`, `unlocked_at`         | unique `(user_id, achievement_key)`                                               | select/insert/update/delete require `auth.uid() = user_id` |

Additional safeguards:

- **Public content**: `modules` and `lessons` tables now have enforced public-read policies via `modules_public_read` / `lessons_public_read`.
- **Helper**: `public._drop_policy_if_exists()` introduced for idempotent policy recreation.

## Validation

- **Schema audit**:
  - `psql` confirms every scope table now exposes `user_id uuid` ([see command output](#validation-commands)).
  - `pg_policies` shows four policies per table with `auth.uid() = user_id` in each qualifier.
- **Types**: Regenerated with `supabase gen types typescript --db-url "$SUPABASE_DB_URL_DEV" > src/types/supabase.ts` (Docker shadow DB required).
- **Build**: `npm run build` passes, verifying Next.js project compiles after schema changes.

## Deployment Notes

- **Apply to other environments**: set the appropriate `$SUPABASE_DB_URL_*` and run:
  ```bash
  supabase db push --db-url "$SUPABASE_DB_URL_<env>"
  supabase gen types typescript --db-url "$SUPABASE_DB_URL_<env>" > src/types/supabase.ts
  npm run build
  ```
- **Rollback (commented)**: re-seed legacy tables from backup if available, or restore from a snapshot prior to migration.

## Follow-up

- Add application dual-writes to populate UUID columns everywhere (completed via table rebuild; ensure API clients now send UUID `user_id`).
- Monitor Supabase logs for policy violations post-deploy.
- Plan final cleanup migrations only if new columns/policies require adjustments.

## Validation Commands

```
psql "$SUPABASE_DB_URL_DEV" -c "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('progress','quiz_history','usage_limits','bookmarks','profiles','purchases','quiz_sessions','user_achievements') ORDER BY table_name, ordinal_position;"

psql "$SUPABASE_DB_URL_DEV" -c "SELECT tablename, policyname, qual, with_check FROM pg_policies WHERE schemaname='public' AND tablename IN ('progress','quiz_history','usage_limits','bookmarks','profiles','purchases','quiz_sessions','user_achievements');"

npm run build
```
