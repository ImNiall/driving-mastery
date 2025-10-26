-- Chat sessions table
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  title text,
  archived boolean not null default false
);

-- Chat messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists chat_sessions_user_idx on public.chat_sessions(user_id);
create index if not exists chat_messages_session_idx on public.chat_messages(session_id);

-- RLS
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Only allow users to access their own sessions
create policy if not exists chat_sessions_select_own on public.chat_sessions
  for select using (user_id = auth.uid());
create policy if not exists chat_sessions_insert_own on public.chat_sessions
  for insert with check (user_id = auth.uid());
create policy if not exists chat_sessions_update_own on public.chat_sessions
  for update using (user_id = auth.uid());
create policy if not exists chat_sessions_delete_own on public.chat_sessions
  for delete using (user_id = auth.uid());

-- Only allow users to access their own messages
create policy if not exists chat_messages_select_own on public.chat_messages
  for select using (user_id = auth.uid());
create policy if not exists chat_messages_insert_own on public.chat_messages
  for insert with check (user_id = auth.uid());
create policy if not exists chat_messages_update_own on public.chat_messages
  for update using (user_id = auth.uid());
create policy if not exists chat_messages_delete_own on public.chat_messages
  for delete using (user_id = auth.uid());
