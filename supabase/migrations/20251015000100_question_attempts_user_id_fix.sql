-- Ensure question_attempts has user ownership column required by downstream indexes
alter table public.question_attempts
  add column if not exists user_id uuid;

update public.question_attempts qa
set user_id = qa.user_id
where false;

update public.question_attempts qa
set user_id = sub.user_id
from public.quiz_attempts sub
where qa.quiz_id = sub.id
  and qa.user_id is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'question_attempts_user_fk'
      and conrelid = 'public.question_attempts'::regclass
  ) then
    alter table public.question_attempts
      add constraint question_attempts_user_fk
        foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end;
$$;
