-- Roll back mandatory leaderboard sharing; restore opt-in default
alter table public.profiles
  alter column share_on_leaderboard set default false;

update public.profiles
set share_on_leaderboard = coalesce(share_on_leaderboard, false);
