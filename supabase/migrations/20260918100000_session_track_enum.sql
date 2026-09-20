-- `track` was text with a check constraint, so generated types saw it as a
-- plain string. An enum makes the allowed values part of the schema, and
-- `pnpm db:types` then generates a union type for them.

create type public.session_track as enum (
  'React',
  'Agentic AI',
  'Performance',
  'Architecture'
);

-- Drop the old check constraint, whatever Postgres named it.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.sessions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%track%'
  loop
    execute format(
      'alter table public.sessions drop constraint %I',
      constraint_name
    );
  end loop;
end $$;

alter table public.sessions
  alter column track type public.session_track
  using track::public.session_track;
