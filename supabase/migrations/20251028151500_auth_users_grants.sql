-- Allow service role to read auth.users for leaderboard aggregates
grant usage on schema auth to service_role;

grant select on table auth.users to service_role;
