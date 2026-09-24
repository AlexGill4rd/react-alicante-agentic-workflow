create table public.announcements (
  id text primary key,
  title text not null,
  body text not null,
  published_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Announcements are publicly readable"
  on public.announcements
  for select
  to anon, authenticated
  using (true);

grant select on public.announcements to anon, authenticated;

insert into public.announcements (id, title, body, published_at) values
  (
    'doors-open',
    'Doors open at 08:30',
    'Registration and coffee in the main lobby. First session starts at 09:30.',
    '2026-09-24 07:00:00+00'
  ),
  (
    'lunch-break',
    'Lunch break 12:30–13:30',
    'Catering is on the terrace. Afternoon tracks resume in all rooms at 13:30.',
    '2026-09-24 11:00:00+00'
  ),
  (
    'party',
    'Community party tonight',
    'Join speakers and attendees from 19:00 at the harbour venue — details at the info desk.',
    '2026-09-24 14:00:00+00'
  );
