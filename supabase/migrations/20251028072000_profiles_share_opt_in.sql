-- Add opt-in flag for leaderboard visibility
alter table public.profiles
  add column if not exists share_on_leaderboard boolean not null default false;

-- Ensure existing rows get the default applied
update public.profiles
set share_on_leaderboard = coalesce(share_on_leaderboard, false);
