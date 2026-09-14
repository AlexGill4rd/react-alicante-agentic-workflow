# Agents

This repo defines its agents once, in `.claude/agents/`, and every AI tool
working in this codebase reads from that same source — no per-tool copies.

## Supabase clients

This starter uses the standard `with-supabase` split — 3 clients, by execution
context:

| Context | Use | Notes |
| --- | --- | --- |
| Browser / Client Components | `createClient` from `lib/supabase/client.ts` | Public anon key; browser-safe. |
| Server Components, Server Actions, Route Handlers | `createClient` from `lib/supabase/server.ts` | Anon key + cookies; respects the current user and RLS. |
| Middleware session refresh | `updateSession` from `lib/supabase/proxy.ts` | Middleware-only — refreshes the auth cookie on every request. |

Both `client.ts` and `server.ts` export a function named `createClient` —
which one you get depends on which file you import from, not the name. Don't
reach for the browser client on the server or vice versa; each is wired for
its own context (cookies vs. no cookies, anon key handling).

No service-role/admin client, and no separate "public reads without cookies"
client — this starter doesn't need that distinction. If a real project grows
into needing admin operations that bypass RLS, that's a 4th client to add
deliberately, not something to default to.

## Available agents

- [feature-builder.md](.claude/agents/feature-builder.md) — Execute a scoped GitHub issue: derive the phase breakdown, scaffold components, hooks, pages, server actions, data files, tests, and open a PR.
- [release-manager.md](.claude/agents/release-manager.md) — Orchestrate a release following the project's release process — delegates every step to a skill and enforces human confirmation between each phase.
- [accessibility-auditor.md](.claude/agents/accessibility-auditor.md) — Audit components or pages for WCAG 2.1 AA compliance and provide actionable fixes.
- [database-manager.md](.claude/agents/database-manager.md) — Manage Supabase schema changes, generate and validate migrations, inspect table structures, diagnose database-layer errors.
- [bug-triager.md](.claude/agents/bug-triager.md) — Investigate a reported bug from a GitHub issue, local repro, or user description — diagnose root cause, propose a fix, and suggest a regression test.
- [devops-manager.md](.claude/agents/devops-manager.md) — Diagnose and fix CI/CD pipeline failures, GitHub Actions workflows, Vercel deployments, and build/deploy health.

For the full contract of any agent — role, workflow, constraints, boundaries — open its file in `.claude/agents/`.
