# Agents

This repo defines its agents once, in `.claude/agents/`, and every AI tool
working in this codebase reads from that same source — no per-tool copies.

## Layout

| Folder | Holds |
| --- | --- |
| `app/` | App Router routes, with page-local `_components/` |
| `components/` | Shared components, grouped by role (`layout/`, `ui/`) |
| `contexts/` | React context providers |
| `services/` | Data access — Supabase, external APIs |
| `utils/` | Pure functions, no dependencies |
| `types/` | Shared types, including generated `supabase.types.ts` |
| `supabase/migrations/` | Schema changes, one file each |

## Supabase

This app has no authentication — every page is public and the database is
read-only from the app's side. One client, `createSupabaseClient` from
`services/supabase.ts`, built with the publishable key and
`persistSession: false`. Row level security is what protects the data.

Data access goes through `services/`, never a Supabase call inside a component.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build — catches Server/Client boundary errors nothing else does |
| `pnpm lint` | ESLint |
| `npx tsc --noEmit` | Type check (no `type-check` script in this repo) |
| `pnpm test` | Vitest, co-located `*.test.ts(x)` files |
| `pnpm db:push:dry-run` | Shows pending migrations |
| `pnpm db:types` | Regenerates `types/supabase.types.ts` |

`pnpm db:push` and every other command that connects to Supabase is run by the
user, never by an agent — see `.claude/settings.json`.

## Available agents

- [feature-planner.md](.claude/agents/feature-planner.md) — Break down a feature request into a well-scoped GitHub issue with clear acceptance criteria before any code is written.
- [feature-builder.md](.claude/agents/feature-builder.md) — Execute a scoped GitHub issue: derive the phase breakdown, scaffold components, hooks, pages, server actions, data files, tests, and open a PR.
- [release-manager.md](.claude/agents/release-manager.md) — Orchestrate a release following the project's release process — delegates every step to a skill and enforces human confirmation between each phase.
- [accessibility-auditor.md](.claude/agents/accessibility-auditor.md) — Audit components or pages for WCAG 2.1 AA compliance and provide actionable fixes.
- [database-manager.md](.claude/agents/database-manager.md) — Manage Supabase schema changes, generate and validate migrations, inspect table structures, diagnose database-layer errors.
- [bug-triager.md](.claude/agents/bug-triager.md) — Investigate a reported bug from a GitHub issue, local repro, or user description — diagnose root cause, propose a fix, and suggest a regression test.
- [devops-manager.md](.claude/agents/devops-manager.md) — Diagnose and fix CI/CD pipeline failures, GitHub Actions workflows, Vercel deployments, and build/deploy health.

For the full contract of any agent — role, workflow, constraints, boundaries — open its file in `.claude/agents/`.

These agents and skills come from Philomath Academy's production codebase. This
starter carries the subset that fits its stack; the rest were left out.
