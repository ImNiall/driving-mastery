alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_source_check;

alter table public.quiz_attempts
  add constraint quiz_attempts_source_check
  check (
    source = any (array['mock'::text, 'mini'::text, 'module'::text, 'category'::text])
  );

alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_source_slug_check;

alter table public.quiz_attempts
  add constraint quiz_attempts_source_slug_check
  check (
    (
      source = 'mock'::text
      and module_slug is null
      and dvsa_category is null
    )
    or (
      source = any (array['mini'::text, 'module'::text])
      and module_slug is not null
      and dvsa_category is null
    )
    or (
      source = 'category'::text
      and module_slug is null
      and dvsa_category is not null
    )
  );
