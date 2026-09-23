# Show each session's level

## What

Every session gets a level (beginner, intermediate or advanced), stored in the database and shown as a badge on the schedule and on the session page.

## Expected result

The session page shows the level as a second badge next to the track:

![The session page with the level badge](https://raw.githubusercontent.com/engineering-workshops/react-alicante-agentic-workflow/dev/docs/starter-repo/tickets/images/session-level.png)

It should look similar. The details are yours.

## Why

Attendees pick sessions that match their experience. A beginner shouldn't walk into an advanced deep dive by accident.

## Acceptance Criteria

- [ ] A new migration in `supabase/migrations/` creates a `session_level` enum (`beginner`, `intermediate`, `advanced`) and adds a not-null `level` column to `sessions` using it.
- [ ] The same migration sets a level for all 8 existing sessions, so no row is left empty.
- [ ] Existing migration files are not edited.
- [ ] `pnpm db:push:dry-run` lists only the new migration.
- [ ] After `pnpm db:push` and `pnpm db:types`, the generated `types/supabase.types.ts` contains the `session_level` enum.
- [ ] `Session` in `types/session.ts` picks up `level` from the generated row type, with no hand-written union and no cast.
- [ ] `services/sessions.ts` selects and returns the level.
- [ ] The session page shows the level as a badge next to the track.
- [ ] The timeline block shows the level without breaking the block layout.
- [ ] `/sessions` and `/sessions/[id]` show the levels.

## Notes

- Follow `supabase/migrations/20260918100000_session_track_enum.sql`: `track` is an enum for exactly this reason, so the allowed values live in the schema and the types are generated from it.
- You run `pnpm db:push` yourself. `.claude/settings.json` blocks Claude from running it, on purpose. Claude can run the dry run.
- The table's read policy is per row, so the new column needs no RLS change.
- Deploying to production: `release-db-migrate` walks through applying the migration there.
