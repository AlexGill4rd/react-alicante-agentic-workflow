# Show each session's level

## What
Every session gets a level (Beginner, Intermediate or Advanced), stored in the database and shown as a badge on the schedule and on the session page.

## Why
Attendees pick sessions that match their experience. A beginner shouldn't walk into an advanced deep dive by accident.

## Acceptance Criteria
- [ ] A new migration in `supabase/migrations/` adds a `level` column to `sessions`: not null, and only `beginner`, `intermediate` or `advanced` allowed.
- [ ] The same migration sets a level for all 8 existing sessions, so no row is left empty.
- [ ] Existing migration files are not edited.
- [ ] The `Session` type and `services/sessions.ts` include the level.
- [ ] The session page shows the level as a badge next to the track.
- [ ] The timeline block shows the level without breaking the block layout.
- [ ] `pnpm supabase db push --dry-run` lists only the new migration.
- [ ] After `pnpm supabase db push`, `/sessions` and `/sessions/[id]` show the levels.

## Notes
- You run `pnpm supabase db push` yourself. `.claude/settings.json` blocks Claude from running it, on purpose.
- The table's read policy is per row, so the new column needs no RLS change.
- Deploying to production: `release-db-migrate` walks through applying the migration there.
