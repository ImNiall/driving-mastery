-- Make leaderboard sharing mandatory by default
alter table public.profiles
  alter column share_on_leaderboard set default true;

update public.profiles
set share_on_leaderboard = true
where share_on_leaderboard is distinct from true;
