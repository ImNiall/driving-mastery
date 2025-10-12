create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  dvsa_category text,
  score integer,
  attempted_at timestamp with time zone not null default now()
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quiz_attempts(id) on delete cascade,
  question_id text not null,
  was_correct boolean not null,
  topic text,
  answered_at timestamp with time zone not null default now()
);

alter table public.quiz_attempts
  add column if not exists dvsa_category text;

alter table public.quiz_attempts
  add column if not exists score integer;

alter table public.quiz_attempts
  alter column score drop not null;

alter table public.quiz_attempts
  alter column score type integer using score::integer;

create index if not exists quiz_attempts_user_idx on public.quiz_attempts(user_id);
create index if not exists quiz_attempts_category_idx on public.quiz_attempts(dvsa_category);

create index if not exists question_attempts_quiz_idx on public.question_attempts(quiz_id);
create index if not exists question_attempts_topic_idx on public.question_attempts(topic);
create index if not exists question_attempts_correct_idx on public.question_attempts(was_correct);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quiz_attempts_score_range'
      and conrelid = 'public.quiz_attempts'::regclass
  ) then
    alter table public.quiz_attempts
      add constraint quiz_attempts_score_range
      check (score between 0 and 100);
  end if;
end;
$$;

create or replace function public.get_weakest_category(user_uuid uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  result record;
begin
  select qa.dvsa_category,
         avg(qa.score)::int as average_score
    into result
    from public.quiz_attempts qa
   where qa.user_id = user_uuid
     and qa.dvsa_category is not null
   group by qa.dvsa_category
   order by avg(qa.score) asc
   limit 1;

  if result is null then
    return null;
  end if;

  return jsonb_build_object(
    'dvsa_category', result.dvsa_category,
    'average_score', result.average_score
  );
end;
$$;
