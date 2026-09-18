# Database Migrations

## The rule: always use `db:push`, never the SQL editor for schema changes

The Supabase SQL editor does not reliably record applied SQL in `schema_migrations`. If you run schema changes manually, the migration file and the actual DB state silently drift — and `db:push` at release time becomes unpredictable (may skip or re-run).

**The only correct workflow:**

1. Write a `.sql` file in `apps/academy/supabase/migrations/` with a timestamp filename
2. Commit it to git
3. Run `pnpm db:push` from `apps/academy/` to apply it to QA
4. Run `pnpm db:types` to regenerate `src/types/supabase.types.ts` from the live QA schema
5. Commit the updated types file
6. At release, the release process applies it to production via the same mechanism

```bash
# Create a new migration file
pnpm db:migration:new <descriptive_name>

# Dry run — see what would be applied without touching the DB
pnpm db:push:dry-run

# Apply pending migrations to the linked project (QA)
pnpm db:push

# Regenerate TypeScript types from the live schema — always run after db:push
pnpm db:types

# Verify state — Local and Remote columns must match for all rows
pnpm db:migrations:list
```

## Migration file conventions

- Filename: `<timestamp>_<description>.sql` — generated automatically by `db:migration:new`
- One concern per file — don't bundle unrelated schema changes
- Always use `IF EXISTS` / `IF NOT EXISTS` guards so migrations are safe to re-inspect
- Pair `ENABLE ROW LEVEL SECURITY` and its policies in the same file as the `CREATE TABLE`

## Environments

- **Local dev + QA** share the same Supabase project. `pnpm db:push` targets QA.
- **Production** is a separate project. Migrations are applied during the release process via the `release-db-migrate` skill — never manually.
- Never run `db:push` targeting production outside of the release process.
- Before the first `db:push`/`supabase link` of a session, confirm the target with `supabase projects list` and check the project **name**, not just the ref — don't assume an already-linked ref (inherited from another checkout/worktree) is QA.

## Claude must never run `supabase`/`db:*` commands itself — hand them to the user

Any command that connects to a linked Supabase project (`supabase link`, `migration list`, `db:push`, `db:push:dry-run`, `db:types`, `migration repair`, `migration down`, etc.) authenticates against the account and touches a live database — that's sensitive regardless of whether the specific command is destructive. Claude should write/edit the `.sql` migration file itself, then give the user the exact command to run and wait for them to run it and report the result. This applies to read-only commands too (a dry run, a migration list) — not just ones with an interactive confirmation prompt.

## Run all `supabase`/`db:*` commands from `apps/academy/`

`supabase link` and the `pnpm db:*` scripts write local state (`.temp/`, config) to whatever directory they're run from. Running `supabase link` from the repo root instead of `apps/academy/` silently creates a stray `supabase/` folder at the root — it doesn't error, so it's easy to miss. Always `cd apps/academy` (or confirm you're already there) before any `supabase`/`db:*` command, and if a stray root-level `supabase/.temp/` ever shows up in `git status`, it's CLI cache, not code — safe to delete.

## What the SQL editor is for

- One-off data queries and debugging
- Inspecting table structure
- **Never** for schema changes (DDL: CREATE, ALTER, DROP, policies, indexes)

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
