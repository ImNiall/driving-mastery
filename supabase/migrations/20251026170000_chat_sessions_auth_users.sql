-- Change chat_sessions.user_id FK to reference auth.users(id) instead of public.users(id)
ALTER TABLE public.chat_sessions DROP CONSTRAINT IF EXISTS chat_sessions_user_id_fkey;
ALTER TABLE public.chat_sessions
  ADD CONSTRAINT chat_sessions_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES auth.users(id) ON DELETE CASCADE;
