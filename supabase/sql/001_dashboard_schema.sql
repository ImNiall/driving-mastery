-- Dashboard schema for Driving Mastery
-- Run in Supabase SQL editor once. Safe to re-run due to IF NOT EXISTS guards.

-- 1) profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy if not exists profiles_select_own on public.profiles
for select to authenticated
using (auth.uid() = id);

create policy if not exists profiles_update_own on public.profiles
for update to authenticated
using (auth.uid() = id);

create policy if not exists profiles_insert_self on public.profiles
for insert to authenticated
with check (auth.uid() = id);

-- Trigger: create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 2) quiz_attempts
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz default now(),
  finished_at timestamptz,
  total int default 0,
  correct int default 0,
  score_percent int,
  duration_sec int,
  source text check (source in ('mock','mini','module')) default 'module'
);

alter table public.quiz_attempts enable row level security;

create policy if not exists attempts_select_own on public.quiz_attempts
for select to authenticated
using (auth.uid() = user_id);

create policy if not exists attempts_insert_own on public.quiz_attempts
for insert to authenticated
with check (auth.uid() = user_id);

create policy if not exists attempts_update_own on public.quiz_attempts
for update to authenticated
using (auth.uid() = user_id);

-- 3) quiz_answers
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id int not null,
  category text not null,
  is_correct boolean not null,
  created_at timestamptz default now()
);

alter table public.quiz_answers enable row level security;

create policy if not exists answers_select_own on public.quiz_answers
for select to authenticated
using (auth.uid() = user_id);

create policy if not exists answers_insert_own on public.quiz_answers
for insert to authenticated
with check (auth.uid() = user_id);

-- 4) module_mastery
create table if not exists public.module_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  points int default 0,
  mastered_at timestamptz default now(),
  unique(user_id, category)
);

alter table public.module_mastery enable row level security;

create policy if not exists mastery_select_own on public.module_mastery
for select to authenticated
using (auth.uid() = user_id);

create policy if not exists mastery_insert_own on public.module_mastery
for insert to authenticated
with check (auth.uid() = user_id);

-- 5) study_plan_state
create table if not exists public.study_plan_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_key text not null,
  steps jsonb not null,
  updated_at timestamptz default now(),
  unique(user_id, plan_key)
);

alter table public.study_plan_state enable row level security;

create policy if not exists plan_select_own on public.study_plan_state
for select to authenticated
using (auth.uid() = user_id);

create policy if not exists plan_upsert_own on public.study_plan_state
for insert to authenticated
with check (auth.uid() = user_id);

create policy if not exists plan_update_own on public.study_plan_state
for update to authenticated
using (auth.uid() = user_id);

-- 6) helper view for dashboard (category performance)
create or replace view public.v_category_performance as
select
  qa.user_id,
  qa.category,
  sum(case when qa.is_correct then 1 else 0 end) as correct,
  count(*) as total
from public.quiz_answers qa
group by 1,2;

-- Done.
