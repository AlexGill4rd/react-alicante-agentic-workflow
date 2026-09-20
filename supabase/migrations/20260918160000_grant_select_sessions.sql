-- Grants and row level security are two separate checks: a grant decides
-- whether a role may touch the table at all, a policy decides which rows it
-- sees. A missing grant fails with 42501 before any policy runs, so the two
-- belong in the same migration.
--
-- Projects created with "Automatically expose new tables" turned off issue no
-- grants of their own, which is why this is explicit.

grant select on table public.sessions to anon, authenticated;
