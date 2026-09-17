create table public.sessions (
  id text primary key,
  title text not null,
  speaker text not null,
  track text not null
    check (track in ('React', 'Agentic AI', 'Performance', 'Architecture')),
  room text not null,
  start_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

-- The schedule is public: anyone can read it, nobody can write through the API.
create policy "Sessions are publicly readable"
  on public.sessions
  for select
  to anon, authenticated
  using (true);

grant select on public.sessions to anon, authenticated;
