-- Theo assistant chat persistence schema

create table if not exists public.assistant_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  openai_thread_id text not null unique,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb default '{}'
);

create table if not exists public.assistant_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.assistant_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null,
  raw jsonb,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assistant_threads_user_idx
  on public.assistant_threads (user_id, updated_at desc);

create index if not exists assistant_messages_thread_idx
  on public.assistant_messages (thread_id, created_at asc);

create index if not exists assistant_messages_role_idx
  on public.assistant_messages (role);

-- maintain updated_at timestamps
create or replace function public.set_assistant_thread_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at := coalesce(new.updated_at, now());
  return new;
end;
$$;

create or replace function public.set_assistant_message_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at := coalesce(new.updated_at, now());
  return new;
end;
$$;

create trigger assistant_threads_set_updated_at
before insert or update on public.assistant_threads
for each row execute function public.set_assistant_thread_updated_at();

create trigger assistant_messages_set_updated_at
before insert or update on public.assistant_messages
for each row execute function public.set_assistant_message_updated_at();

create or replace function public.touch_assistant_thread()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.assistant_threads
    set updated_at = now()
    where id = new.thread_id;
  return new;
end;
$$;

create trigger assistant_messages_touch_thread
after insert or update on public.assistant_messages
for each row execute function public.touch_assistant_thread();

-- Row Level Security
alter table public.assistant_threads enable row level security;
alter table public.assistant_messages enable row level security;

create policy assistant_threads_select_own
  on public.assistant_threads
  for select
  using (user_id = auth.uid());

create policy assistant_threads_insert_own
  on public.assistant_threads
  for insert
  with check (user_id = auth.uid());

create policy assistant_threads_update_own
  on public.assistant_threads
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy assistant_threads_delete_own
  on public.assistant_threads
  for delete
  using (user_id = auth.uid());

create policy assistant_messages_select_own
  on public.assistant_messages
  for select
  using (
    exists (
      select 1
      from public.assistant_threads t
      where t.id = assistant_messages.thread_id
        and t.user_id = auth.uid()
    )
  );

create policy assistant_messages_insert_own
  on public.assistant_messages
  for insert
  with check (
    exists (
      select 1
      from public.assistant_threads t
      where t.id = assistant_messages.thread_id
        and t.user_id = auth.uid()
    )
  );

create policy assistant_messages_update_own
  on public.assistant_messages
  for update
  using (
    exists (
      select 1
      from public.assistant_threads t
      where t.id = assistant_messages.thread_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.assistant_threads t
      where t.id = assistant_messages.thread_id
        and t.user_id = auth.uid()
    )
  );

create policy assistant_messages_delete_own
  on public.assistant_messages
  for delete
  using (
    exists (
      select 1
      from public.assistant_threads t
      where t.id = assistant_messages.thread_id
        and t.user_id = auth.uid()
    )
  );
