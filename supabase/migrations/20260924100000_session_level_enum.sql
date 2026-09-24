create type public.session_level as enum (
  'beginner',
  'intermediate',
  'advanced'
);

alter table public.sessions
  add column level public.session_level;

update public.sessions
set level = 'beginner'
where id in ('opening-keynote', 'closing-panel');

update public.sessions
set level = 'intermediate'
where id in (
  'build-your-agentic-workflow',
  'server-components-deep-dive',
  'testing-ai-generated-code'
);

update public.sessions
set level = 'advanced'
where id in (
  'rsc-payload-budget',
  'agent-context-windows',
  'micro-frontends-2026'
);

alter table public.sessions
  alter column level set not null;
