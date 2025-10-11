create type "public"."plan_t" as enum ('free', 'pro');

create type "public"."sub_status_t" as enum ('trialing', 'active', 'canceled', 'past_due');

drop policy "lesson_progress_owner" on "public"."lesson_progress";

drop policy "module_mastery_owner" on "public"."module_mastery";

drop policy "progress_owner" on "public"."progress";

drop policy "quiz_answers_owner" on "public"."quiz_answers";

drop policy "quiz_attempts_owner" on "public"."quiz_attempts";

drop policy "quiz_history_owner" on "public"."quiz_history";

drop policy "study_plan_state_owner" on "public"."study_plan_state";

drop policy "usage_limits_owner" on "public"."usage_limits";

revoke delete on table "public"."lesson_progress" from "anon";

revoke insert on table "public"."lesson_progress" from "anon";

revoke references on table "public"."lesson_progress" from "anon";

revoke select on table "public"."lesson_progress" from "anon";

revoke trigger on table "public"."lesson_progress" from "anon";

revoke truncate on table "public"."lesson_progress" from "anon";

revoke update on table "public"."lesson_progress" from "anon";

revoke delete on table "public"."lesson_progress" from "authenticated";

revoke insert on table "public"."lesson_progress" from "authenticated";

revoke references on table "public"."lesson_progress" from "authenticated";

revoke select on table "public"."lesson_progress" from "authenticated";

revoke trigger on table "public"."lesson_progress" from "authenticated";

revoke truncate on table "public"."lesson_progress" from "authenticated";

revoke update on table "public"."lesson_progress" from "authenticated";

revoke delete on table "public"."lesson_progress" from "service_role";

revoke insert on table "public"."lesson_progress" from "service_role";

revoke references on table "public"."lesson_progress" from "service_role";

revoke select on table "public"."lesson_progress" from "service_role";

revoke trigger on table "public"."lesson_progress" from "service_role";

revoke truncate on table "public"."lesson_progress" from "service_role";

revoke update on table "public"."lesson_progress" from "service_role";

alter table "public"."lesson_progress" drop constraint "lesson_progress_progress_count_check";

alter table "public"."progress" drop constraint "progress_correct_check";

alter table "public"."progress" drop constraint "progress_total_check";

alter table "public"."quiz_attempts" drop constraint "quiz_attempts_correct_check";

alter table "public"."quiz_attempts" drop constraint "quiz_attempts_current_index_check";

alter table "public"."quiz_attempts" drop constraint "quiz_attempts_total_check";

drop function if exists "public"."current_subject"();

drop function if exists "public"."increment_progress"(p_clerk_user_id uuid, p_category text, p_correct integer, p_total integer);

drop function if exists "public"."increment_progress"(p_lesson_id uuid, p_inc integer);

drop view if exists "public"."v_category_performance";

alter table "public"."lesson_progress" drop constraint "lesson_progress_pkey";

alter table "public"."module_mastery" drop constraint "module_mastery_pkey";

alter table "public"."progress" drop constraint "progress_pkey";

alter table "public"."quiz_answers" drop constraint "quiz_answers_pkey";

alter table "public"."usage_limits" drop constraint "usage_limits_pkey";

drop index if exists "public"."lesson_progress_pkey";

drop index if exists "public"."lesson_progress_user_idx";

drop index if exists "public"."module_mastery_pkey";

drop index if exists "public"."module_mastery_user_idx";

drop index if exists "public"."quiz_answers_user_idx";

drop index if exists "public"."quiz_attempts_user_source_idx";

drop index if exists "public"."quiz_history_user_idx";

drop index if exists "public"."study_plan_state_user_idx";

drop index if exists "public"."usage_limits_user_idx";

drop index if exists "public"."progress_pkey";

drop index if exists "public"."quiz_answers_pkey";

drop index if exists "public"."usage_limits_pkey";

drop table "public"."lesson_progress";

create table "public"."achievements" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "name" text not null,
    "description" text,
    "criteria" jsonb
);


create table "public"."bookmarks" (
    "id" uuid not null default gen_random_uuid(),
    "clerk_user_id" text not null,
    "lesson_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."bookmarks" enable row level security;

create table "public"."dvsa_categories" (
    "key" text not null,
    "display_name" text not null,
    "sort_order" integer default 0
);


create table "public"."lessons" (
    "id" uuid not null default gen_random_uuid(),
    "category_key" text not null,
    "slug" text not null,
    "title" text not null,
    "excerpt" text,
    "content" text,
    "status" text not null default 'published'::text,
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "clerk_user_id" text not null,
    "email" text,
    "name" text,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."purchases" (
    "id" uuid not null default gen_random_uuid(),
    "clerk_user_id" text not null,
    "stripe_customer_id" text,
    "stripe_subscription_id" text,
    "plan" text,
    "status" text,
    "current_period_end" timestamp with time zone,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."purchases" enable row level security;

create table "public"."quiz_sessions" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" text not null,
    "module_slug" text not null,
    "current_index" integer not null default 0,
    "questions" jsonb not null,
    "answers" jsonb not null default '[]'::jsonb,
    "state" text not null default 'idle'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "quiz_id" text not null default 'default_quiz'::text
);


alter table "public"."quiz_sessions" enable row level security;

create table "public"."user_achievements" (
    "id" uuid not null default gen_random_uuid(),
    "clerk_user_id" text not null,
    "achievement_key" text not null,
    "unlocked_at" timestamp with time zone not null default now()
);


alter table "public"."user_achievements" enable row level security;

alter table "public"."module_mastery" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."progress" add column "id" uuid not null default gen_random_uuid();

alter table "public"."quiz_answers" add column "answer" jsonb not null;

alter table "public"."quiz_answers" add column "q_index" integer not null;

alter table "public"."quiz_answers" add column "updated_at" timestamp with time zone default now();

alter table "public"."quiz_answers" alter column "category" drop not null;

alter table "public"."quiz_answers" alter column "created_at" drop not null;

alter table "public"."quiz_answers" alter column "is_correct" drop not null;

alter table "public"."quiz_answers" alter column "question_id" drop not null;

alter table "public"."quiz_answers" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."quiz_attempts" add column "created_at" timestamp with time zone default now();

alter table "public"."quiz_attempts" add column "updated_at" timestamp with time zone default now();

alter table "public"."quiz_attempts" alter column "correct" drop not null;

alter table "public"."quiz_attempts" alter column "questions" set default '[]'::jsonb;

alter table "public"."quiz_attempts" alter column "questions" set not null;

alter table "public"."quiz_attempts" alter column "source" drop not null;

alter table "public"."quiz_attempts" alter column "started_at" drop not null;

alter table "public"."quiz_attempts" alter column "state" set default '"idle"'::jsonb;

alter table "public"."quiz_attempts" alter column "state" set not null;

alter table "public"."quiz_attempts" alter column "state" set data type text using "state"::text;

alter table "public"."quiz_attempts" alter column "total" drop not null;

alter table "public"."quiz_attempts" alter column "user_id" drop not null;

alter table "public"."quiz_attempts" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."quiz_attempts" disable row level security;

alter table "public"."study_plan_state" alter column "steps" drop not null;

alter table "public"."study_plan_state" alter column "updated_at" drop not null;

alter table "public"."study_plan_state" alter column "user_id" set data type uuid using "user_id"::uuid;

alter table "public"."usage_limits" drop column "created_at";

alter table "public"."usage_limits" add column "id" uuid not null default gen_random_uuid();

alter table "public"."usage_limits" alter column "used_on" set default ((now() AT TIME ZONE 'utc'::text))::date;

CREATE UNIQUE INDEX achievements_key_key ON public.achievements USING btree (key);

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE UNIQUE INDEX bookmarks_clerk_user_id_lesson_id_key ON public.bookmarks USING btree (clerk_user_id, lesson_id);

CREATE UNIQUE INDEX bookmarks_pkey ON public.bookmarks USING btree (id);

CREATE UNIQUE INDEX dvsa_categories_pkey ON public.dvsa_categories USING btree (key);

CREATE INDEX idx_progress_updated ON public.progress USING btree (updated_at DESC);

CREATE INDEX idx_progress_user ON public.progress USING btree (clerk_user_id);

CREATE INDEX idx_progress_user_cat ON public.progress USING btree (clerk_user_id, category);

CREATE INDEX idx_purchases_user ON public.purchases USING btree (clerk_user_id);

CREATE INDEX idx_purchases_user_status ON public.purchases USING btree (clerk_user_id, status);

CREATE INDEX idx_quiz_answers_user_category ON public.quiz_answers USING btree (user_id, category);

CREATE INDEX idx_quiz_history_user ON public.quiz_history USING btree (clerk_user_id);

CREATE INDEX idx_quiz_history_user_time ON public.quiz_history USING btree (clerk_user_id, created_at DESC);

CREATE INDEX idx_quiz_sessions_quiz_id ON public.quiz_sessions USING btree (quiz_id);

CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions USING btree (user_id);

CREATE INDEX idx_usage_limits ON public.usage_limits USING btree (clerk_user_id, feature, used_on);

CREATE UNIQUE INDEX lessons_pkey ON public.lessons USING btree (id);

CREATE UNIQUE INDEX lessons_slug_key ON public.lessons USING btree (slug);

CREATE UNIQUE INDEX module_mastery_user_category_key ON public.module_mastery USING btree (user_id, category);

CREATE UNIQUE INDEX profiles_clerk_user_id_key ON public.profiles USING btree (clerk_user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX progress_clerk_user_id_category_key ON public.progress USING btree (clerk_user_id, category);

CREATE UNIQUE INDEX purchases_pkey ON public.purchases USING btree (id);

CREATE INDEX quiz_answers_attempt_idx ON public.quiz_answers USING btree (attempt_id);

CREATE UNIQUE INDEX quiz_answers_attempt_question_uniq ON public.quiz_answers USING btree (attempt_id, question_id);

CREATE INDEX quiz_attempts_state_idx ON public.quiz_attempts USING btree (state);

CREATE INDEX quiz_attempts_user_module_idx ON public.quiz_attempts USING btree (user_id, module_slug);

CREATE UNIQUE INDEX quiz_sessions_pkey ON public.quiz_sessions USING btree (user_id, quiz_id);

CREATE INDEX quiz_sessions_user_module_idx ON public.quiz_sessions USING btree (user_id, module_slug);

CREATE UNIQUE INDEX unique_user_module ON public.quiz_sessions USING btree (user_id, module_slug);

CREATE UNIQUE INDEX uq_active_sub ON public.purchases USING btree (clerk_user_id) WHERE (status = 'active'::text);

CREATE UNIQUE INDEX usage_limits_clerk_user_id_feature_used_on_key ON public.usage_limits USING btree (clerk_user_id, feature, used_on);

CREATE UNIQUE INDEX user_achievements_clerk_user_id_achievement_key_key ON public.user_achievements USING btree (clerk_user_id, achievement_key);

CREATE UNIQUE INDEX user_achievements_pkey ON public.user_achievements USING btree (id);

CREATE UNIQUE INDEX progress_pkey ON public.progress USING btree (id);

CREATE UNIQUE INDEX quiz_answers_pkey ON public.quiz_answers USING btree (attempt_id, q_index);

CREATE UNIQUE INDEX usage_limits_pkey ON public.usage_limits USING btree (id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."bookmarks" add constraint "bookmarks_pkey" PRIMARY KEY using index "bookmarks_pkey";

alter table "public"."dvsa_categories" add constraint "dvsa_categories_pkey" PRIMARY KEY using index "dvsa_categories_pkey";

alter table "public"."lessons" add constraint "lessons_pkey" PRIMARY KEY using index "lessons_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."purchases" add constraint "purchases_pkey" PRIMARY KEY using index "purchases_pkey";

alter table "public"."quiz_sessions" add constraint "quiz_sessions_pkey" PRIMARY KEY using index "quiz_sessions_pkey";

alter table "public"."user_achievements" add constraint "user_achievements_pkey" PRIMARY KEY using index "user_achievements_pkey";

alter table "public"."progress" add constraint "progress_pkey" PRIMARY KEY using index "progress_pkey";

alter table "public"."quiz_answers" add constraint "quiz_answers_pkey" PRIMARY KEY using index "quiz_answers_pkey";

alter table "public"."usage_limits" add constraint "usage_limits_pkey" PRIMARY KEY using index "usage_limits_pkey";

alter table "public"."achievements" add constraint "achievements_key_key" UNIQUE using index "achievements_key_key";

alter table "public"."bookmarks" add constraint "bookmarks_clerk_user_id_lesson_id_key" UNIQUE using index "bookmarks_clerk_user_id_lesson_id_key";

alter table "public"."bookmarks" add constraint "bookmarks_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE not valid;

alter table "public"."bookmarks" validate constraint "bookmarks_lesson_id_fkey";

alter table "public"."lessons" add constraint "lessons_category_key_fkey" FOREIGN KEY (category_key) REFERENCES dvsa_categories(key) ON DELETE CASCADE not valid;

alter table "public"."lessons" validate constraint "lessons_category_key_fkey";

alter table "public"."lessons" add constraint "lessons_slug_key" UNIQUE using index "lessons_slug_key";

alter table "public"."module_mastery" add constraint "module_mastery_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."module_mastery" validate constraint "module_mastery_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_clerk_user_id_key" UNIQUE using index "profiles_clerk_user_id_key";

alter table "public"."progress" add constraint "progress_clerk_user_id_category_key" UNIQUE using index "progress_clerk_user_id_category_key";

alter table "public"."quiz_answers" add constraint "quiz_answers_user_fk" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."quiz_answers" validate constraint "quiz_answers_user_fk";

alter table "public"."quiz_attempts" add constraint "quiz_attempts_source_check" CHECK ((source = ANY (ARRAY['mock'::text, 'mini'::text, 'module'::text]))) not valid;

alter table "public"."quiz_attempts" validate constraint "quiz_attempts_source_check";

alter table "public"."quiz_attempts" add constraint "quiz_attempts_source_slug_check" CHECK ((((source = 'mock'::text) AND (module_slug IS NULL)) OR ((source = ANY (ARRAY['mini'::text, 'module'::text])) AND (module_slug IS NOT NULL)))) not valid;

alter table "public"."quiz_attempts" validate constraint "quiz_attempts_source_slug_check";

alter table "public"."quiz_attempts" add constraint "quiz_attempts_state_check" CHECK ((state = ANY (ARRAY['idle'::text, 'active'::text, 'finished'::text]))) not valid;

alter table "public"."quiz_attempts" validate constraint "quiz_attempts_state_check";

alter table "public"."quiz_sessions" add constraint "unique_user_module" UNIQUE using index "unique_user_module";

alter table "public"."study_plan_state" add constraint "study_plan_state_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."study_plan_state" validate constraint "study_plan_state_user_id_fkey";

alter table "public"."usage_limits" add constraint "usage_limits_clerk_user_id_feature_used_on_key" UNIQUE using index "usage_limits_clerk_user_id_feature_used_on_key";

alter table "public"."user_achievements" add constraint "user_achievements_achievement_key_fkey" FOREIGN KEY (achievement_key) REFERENCES achievements(key) ON DELETE CASCADE not valid;

alter table "public"."user_achievements" validate constraint "user_achievements_achievement_key_fkey";

alter table "public"."user_achievements" add constraint "user_achievements_clerk_user_id_achievement_key_key" UNIQUE using index "user_achievements_clerk_user_id_achievement_key_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_progress(p_clerk_user_id text, p_category text, p_correct integer, p_total integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  insert into public.progress (clerk_user_id, category, correct, total)
  values (p_clerk_user_id, p_category, greatest(p_correct,0), greatest(p_total,0))
  on conflict (clerk_user_id, category)
  do update set
    correct = public.progress.correct + greatest(excluded.correct,0),
    total   = public.progress.total   + greatest(excluded.total,0),
    updated_at = now();
end $function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

create or replace view "public"."v_category_performance" as  SELECT user_id,
    COALESCE(category, 'uncategorised'::text) AS category,
    (sum(
        CASE
            WHEN (is_correct IS TRUE) THEN 1
            ELSE 0
        END))::integer AS correct,
    (count(*))::integer AS total
   FROM quiz_answers qa
  GROUP BY user_id, COALESCE(category, 'uncategorised'::text);


grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."bookmarks" to "anon";

grant insert on table "public"."bookmarks" to "anon";

grant references on table "public"."bookmarks" to "anon";

grant select on table "public"."bookmarks" to "anon";

grant trigger on table "public"."bookmarks" to "anon";

grant truncate on table "public"."bookmarks" to "anon";

grant update on table "public"."bookmarks" to "anon";

grant delete on table "public"."bookmarks" to "authenticated";

grant insert on table "public"."bookmarks" to "authenticated";

grant references on table "public"."bookmarks" to "authenticated";

grant select on table "public"."bookmarks" to "authenticated";

grant trigger on table "public"."bookmarks" to "authenticated";

grant truncate on table "public"."bookmarks" to "authenticated";

grant update on table "public"."bookmarks" to "authenticated";

grant delete on table "public"."bookmarks" to "service_role";

grant insert on table "public"."bookmarks" to "service_role";

grant references on table "public"."bookmarks" to "service_role";

grant select on table "public"."bookmarks" to "service_role";

grant trigger on table "public"."bookmarks" to "service_role";

grant truncate on table "public"."bookmarks" to "service_role";

grant update on table "public"."bookmarks" to "service_role";

grant delete on table "public"."dvsa_categories" to "anon";

grant insert on table "public"."dvsa_categories" to "anon";

grant references on table "public"."dvsa_categories" to "anon";

grant select on table "public"."dvsa_categories" to "anon";

grant trigger on table "public"."dvsa_categories" to "anon";

grant truncate on table "public"."dvsa_categories" to "anon";

grant update on table "public"."dvsa_categories" to "anon";

grant delete on table "public"."dvsa_categories" to "authenticated";

grant insert on table "public"."dvsa_categories" to "authenticated";

grant references on table "public"."dvsa_categories" to "authenticated";

grant select on table "public"."dvsa_categories" to "authenticated";

grant trigger on table "public"."dvsa_categories" to "authenticated";

grant truncate on table "public"."dvsa_categories" to "authenticated";

grant update on table "public"."dvsa_categories" to "authenticated";

grant delete on table "public"."dvsa_categories" to "service_role";

grant insert on table "public"."dvsa_categories" to "service_role";

grant references on table "public"."dvsa_categories" to "service_role";

grant select on table "public"."dvsa_categories" to "service_role";

grant trigger on table "public"."dvsa_categories" to "service_role";

grant truncate on table "public"."dvsa_categories" to "service_role";

grant update on table "public"."dvsa_categories" to "service_role";

grant delete on table "public"."lessons" to "anon";

grant insert on table "public"."lessons" to "anon";

grant references on table "public"."lessons" to "anon";

grant select on table "public"."lessons" to "anon";

grant trigger on table "public"."lessons" to "anon";

grant truncate on table "public"."lessons" to "anon";

grant update on table "public"."lessons" to "anon";

grant delete on table "public"."lessons" to "authenticated";

grant insert on table "public"."lessons" to "authenticated";

grant references on table "public"."lessons" to "authenticated";

grant select on table "public"."lessons" to "authenticated";

grant trigger on table "public"."lessons" to "authenticated";

grant truncate on table "public"."lessons" to "authenticated";

grant update on table "public"."lessons" to "authenticated";

grant delete on table "public"."lessons" to "service_role";

grant insert on table "public"."lessons" to "service_role";

grant references on table "public"."lessons" to "service_role";

grant select on table "public"."lessons" to "service_role";

grant trigger on table "public"."lessons" to "service_role";

grant truncate on table "public"."lessons" to "service_role";

grant update on table "public"."lessons" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."purchases" to "anon";

grant insert on table "public"."purchases" to "anon";

grant references on table "public"."purchases" to "anon";

grant select on table "public"."purchases" to "anon";

grant trigger on table "public"."purchases" to "anon";

grant truncate on table "public"."purchases" to "anon";

grant update on table "public"."purchases" to "anon";

grant delete on table "public"."purchases" to "authenticated";

grant insert on table "public"."purchases" to "authenticated";

grant references on table "public"."purchases" to "authenticated";

grant select on table "public"."purchases" to "authenticated";

grant trigger on table "public"."purchases" to "authenticated";

grant truncate on table "public"."purchases" to "authenticated";

grant update on table "public"."purchases" to "authenticated";

grant delete on table "public"."purchases" to "service_role";

grant insert on table "public"."purchases" to "service_role";

grant references on table "public"."purchases" to "service_role";

grant select on table "public"."purchases" to "service_role";

grant trigger on table "public"."purchases" to "service_role";

grant truncate on table "public"."purchases" to "service_role";

grant update on table "public"."purchases" to "service_role";

grant delete on table "public"."quiz_sessions" to "anon";

grant insert on table "public"."quiz_sessions" to "anon";

grant references on table "public"."quiz_sessions" to "anon";

grant select on table "public"."quiz_sessions" to "anon";

grant trigger on table "public"."quiz_sessions" to "anon";

grant truncate on table "public"."quiz_sessions" to "anon";

grant update on table "public"."quiz_sessions" to "anon";

grant delete on table "public"."quiz_sessions" to "authenticated";

grant insert on table "public"."quiz_sessions" to "authenticated";

grant references on table "public"."quiz_sessions" to "authenticated";

grant select on table "public"."quiz_sessions" to "authenticated";

grant trigger on table "public"."quiz_sessions" to "authenticated";

grant truncate on table "public"."quiz_sessions" to "authenticated";

grant update on table "public"."quiz_sessions" to "authenticated";

grant delete on table "public"."quiz_sessions" to "service_role";

grant insert on table "public"."quiz_sessions" to "service_role";

grant references on table "public"."quiz_sessions" to "service_role";

grant select on table "public"."quiz_sessions" to "service_role";

grant trigger on table "public"."quiz_sessions" to "service_role";

grant truncate on table "public"."quiz_sessions" to "service_role";

grant update on table "public"."quiz_sessions" to "service_role";

grant delete on table "public"."user_achievements" to "anon";

grant insert on table "public"."user_achievements" to "anon";

grant references on table "public"."user_achievements" to "anon";

grant select on table "public"."user_achievements" to "anon";

grant trigger on table "public"."user_achievements" to "anon";

grant truncate on table "public"."user_achievements" to "anon";

grant update on table "public"."user_achievements" to "anon";

grant delete on table "public"."user_achievements" to "authenticated";

grant insert on table "public"."user_achievements" to "authenticated";

grant references on table "public"."user_achievements" to "authenticated";

grant select on table "public"."user_achievements" to "authenticated";

grant trigger on table "public"."user_achievements" to "authenticated";

grant truncate on table "public"."user_achievements" to "authenticated";

grant update on table "public"."user_achievements" to "authenticated";

grant delete on table "public"."user_achievements" to "service_role";

grant insert on table "public"."user_achievements" to "service_role";

grant references on table "public"."user_achievements" to "service_role";

grant select on table "public"."user_achievements" to "service_role";

grant trigger on table "public"."user_achievements" to "service_role";

grant truncate on table "public"."user_achievements" to "service_role";

grant update on table "public"."user_achievements" to "service_role";

create policy "mm_delete_own"
on "public"."module_mastery"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "mm_insert_own"
on "public"."module_mastery"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "mm_select_own"
on "public"."module_mastery"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "mm_update_own"
on "public"."module_mastery"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "answers_insert_own"
on "public"."quiz_answers"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "answers_select_own"
on "public"."quiz_answers"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "attempts_select_own"
on "public"."quiz_attempts"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "delete_own_sessions"
on "public"."quiz_sessions"
as permissive
for delete
to public
using (((( SELECT auth.uid() AS uid))::text = user_id));


create policy "insert_own_sessions"
on "public"."quiz_sessions"
as permissive
for insert
to public
with check (((( SELECT auth.uid() AS uid))::text = user_id));


create policy "select_own_sessions"
on "public"."quiz_sessions"
as permissive
for select
to public
using (((( SELECT auth.uid() AS uid))::text = user_id));


create policy "update_own_sessions"
on "public"."quiz_sessions"
as permissive
for update
to public
using (((( SELECT auth.uid() AS uid))::text = user_id));


create policy "sps_all_own"
on "public"."study_plan_state"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


CREATE TRIGGER update_quiz_answers_updated_at BEFORE UPDATE ON public.quiz_answers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON public.quiz_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_sessions_updated_at BEFORE UPDATE ON public.quiz_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



