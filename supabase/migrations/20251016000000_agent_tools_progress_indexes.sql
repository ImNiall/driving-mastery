do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'question_attempts'
      and column_name = 'created_at'
  ) then
    execute 'create index if not exists idx_question_attempts_user_created on public.question_attempts(user_id, created_at)';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'question_attempts'
      and column_name = 'answered_at'
  ) then
    execute 'create index if not exists idx_question_attempts_user_answered on public.question_attempts(user_id, answered_at)';
  end if;
end;
$$;

create index if not exists idx_question_attempts_topic
  on question_attempts(topic);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'quiz_attempts'
      and column_name = 'created_at'
  ) then
    execute 'create index if not exists idx_quiz_attempts_user_created on public.quiz_attempts(user_id, created_at)';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'quiz_attempts'
      and column_name = 'attempted_at'
  ) then
    execute 'create index if not exists idx_quiz_attempts_user_attempted on public.quiz_attempts(user_id, attempted_at)';
  end if;
end;
$$;
