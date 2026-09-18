---
name: release-db-migrate
description: Apply pending Supabase database migrations to Production with dry-run preview and human confirmation before applying.

metadata:
  domain: devops
  trigger: manual
  priority: high
  blocking: true

argument-hint: "<version> — e.g. 1.4.0"
---

# Skill: DB Migration

## When to use
- **Before merging to main** — apply migrations to Production before the code deploy goes live.
- Never apply Production migrations after the code deploy — schema must be ready before the app.

## Context
Local dev and QA both point to the same Supabase project (QA). Migrations applied during development are already live on QA. This skill is **only needed for Production** — run it once, just before merging the release PR.

**Claude never runs any command that connects to a linked Supabase project itself** — `supabase link`, `db:link:status`, `db:push:dry-run`, `db:push`, `db:types`, etc. all authenticate against the account and touch a live database, and this is Production. Every command below is run by the user; Claude's job is to give the exact command, wait for the user to run it, and read the output they paste back.

## Inputs
- `$ARGUMENTS` (required): version string, e.g. `1.4.0`.

## Prerequisites
- **Supabase CLI available:** ask the user to run `pnpm supabase --version` and confirm it's installed.
- **Logged in:** ask the user to run `pnpm db:link:status` and share the output. If it contains "not logged in" or fails → stop, tell user to run `supabase login` then retry.
- **On correct branch:** Must be on `release-<x-x-x>` (after QA passed, before merging).
- **`SUPABASE_PRODUCTION_PROJECT_REF` set in `.env.local`** — this is the Production project ref. If missing → stop, tell the user to add it (see `.env.example`).

---

## Workflow

### ⏸️ BREAKPOINT 1 — Relink to Production and Confirm

Ask the user to relink to the Production project themselves, using the ref from `.env.local`:

```bash
pnpm supabase link --project-ref $SUPABASE_PRODUCTION_PROJECT_REF
```

Then ask them to verify and share the output:

```bash
pnpm db:link:status
```

Once they paste it, confirm:
> "The linked project shown above should be your **Production** project, not QA. Please confirm this is correct before we proceed."

**Wait for explicit confirmation. This is irreversible.**

---

### 1. Check for Pending Migrations

Ask the user to run and share the full output:

```bash
pnpm db:push:dry-run
```

If no pending migrations → inform user:
> "No pending migrations for this environment. Nothing to apply."
Then stop — do not proceed.

---

### ⏸️ BREAKPOINT 2 — Review Dry Run

Ask:
> "The above migrations will be applied to **PRODUCTION**. Shall I have you proceed?"

**Wait for explicit confirmation before applying.**

---

### 2. Apply Migrations

Ask the user to run and share the output:

```bash
pnpm db:push
```

Note: `pnpm db:push` has a built-in confirmation prompt — the user types `y` in their own terminal. If the output shows any errors → stop immediately, do NOT suggest retrying, show the error and ask the user how to proceed.

---

### ⏸️ BREAKPOINT 3 — Confirm Success

Ask the user to verify:
> "Migrations applied. Please verify in the Supabase dashboard that the schema changes look correct before continuing. Reply 'verified' when ready."

Spot-check the live app immediately after the code deploy.

**Wait for confirmation before marking this step complete.**

---

### 3. Regenerate Supabase Types

After migrations are confirmed applied, ask the user to regenerate TypeScript types from the live schema themselves:

```bash
pnpm db:types
```

Once they confirm it's done, stage and commit the updated file yourself (this is a local git operation, not a remote-DB command):

```bash
git add types/supabase.types.ts
git commit -m "chore(db): regenerate Supabase types after v$ARGUMENTS migrations"
```

> Note: this commit goes on the release branch before merging to main.

---

## Constraints

- Do NOT apply Production migrations after the code is already deployed — always DB first.
- Do NOT skip the dry-run — always show what will be applied before applying.
- Do NOT suggest retrying on error — stop and surface the failure for the user to investigate.
- Do NOT ask the user to link/relink without explicit confirmation first — linking to the wrong project is destructive.
- Never delete or edit existing migration files.
- Never run `supabase link`, `db:link:status`, `db:push:dry-run`, `db:push`, `db:types`, or any other command that connects to the linked project yourself — the user runs every one of these and reports the result back.

## Output

- Migrations applied to the target environment.
- User has verified schema in Supabase dashboard.

## Verification

- [ ] User ran `pnpm db:link:status` and confirmed the correct project before applying
- [ ] Dry run reviewed and confirmed by user
- [ ] User ran `pnpm db:push` and it completed without errors
- [ ] User has verified schema changes in dashboard
- [ ] User ran `pnpm db:types`, and the updated `supabase.types.ts` is committed to the release branch
