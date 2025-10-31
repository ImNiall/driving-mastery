-- Ensure public.users is accessible to required roles
grant usage on schema public to service_role;

grant select, insert, update, delete on table public.users to service_role;

grant select on table public.users to authenticated;
