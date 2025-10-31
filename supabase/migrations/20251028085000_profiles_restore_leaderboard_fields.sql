-- Restore profile columns required by leaderboard and profile features
alter table public.profiles
  add column if not exists display_name text,
  add column if not exists country text,
  add column if not exists region text,
  add column if not exists test_date date,
  add column if not exists last_active timestamptz,
  add column if not exists updated_at timestamptz default now();

-- Ensure updated_at stays in sync when the profile row changes
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at := coalesce(new.updated_at, now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before insert or update on public.profiles
for each row
execute function public.set_profiles_updated_at();
