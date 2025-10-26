-- Change chat_messages.user_id FK to reference auth.users(id) instead of public.users(id)
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_user_id_fkey;
ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES auth.users(id) ON DELETE CASCADE;
