# Agents

This repo defines its agents once, in `.claude/agents/`, and every AI tool
working in this codebase reads from that same source — no per-tool copies.

## Layout

| Folder                 | Holds                                                    |
| ---------------------- | -------------------------------------------------------- |
| `app/[locale]/`        | App Router routes, with page-local `_components/`        |
| `components/`          | Shared components, grouped by role (`layout/`, `ui/`)    |
| `hooks/`               | Reusable React hooks                                     |
| `services/`            | Data access — Supabase, external APIs                    |
| `utils/`               | Pure functions, no dependencies                          |
| `types/`               | Shared types, including generated `supabase.types.ts`    |
| `i18n/`                | next-intl routing, navigation helpers and request config |
| `messages/`            | `en.json`, `es.json` — every user-facing string          |
| `supabase/migrations/` | Schema changes, one file each                            |

## Internationalisation

Every route lives under `app/[locale]/`, so URLs are `/en/sessions`,
`/es/sessions`, and `/` redirects to the default locale. `middleware.ts` does
that redirect.

- Server Components: `getTranslations` from `next-intl/server`, or
  `useTranslations` when the component is not async.
- Client Components: `useTranslations` from `next-intl`.
- Links and navigation: `Link`, `useRouter`, `usePathname` from
  `@/i18n/navigation` — never `next/link` or `next/navigation` directly, or the
  locale prefix is lost.
- A new page needs `setRequestLocale(locale)` if it should stay static.
- New strings go in both `messages/en.json` and `messages/es.json`.

## Supabase

This app has no authentication — every page is public and the database is
read-only from the app's side. One client, `createSupabaseClient` from
`services/supabase.ts`, built with the publishable key and
`persistSession: false`. Row level security is what protects the data.

Data access goes through `services/`, never a Supabase call inside a component.

## Styling

**Chakra UI v3 only.** Layout, spacing and typography are Chakra props; there
is no Tailwind, no CSS modules and no `className` outside Next's font variable.
Its rules are in `.claude/rules/chakra-v3.md`.

Colour comes from the CSS variables in `app/globals.css`, defined in both the
dark block and the `[data-theme="light"]` override — never a hex in a
component, never a stock Chakra scale like `red.500`.

## Branches

`dev` is the default branch and the base for everything: feature branches cut
from it and merge back into it, and skills that diff a branch compare against
`origin/dev`. `main` only ever receives a release PR, and a merge there is what
deploys production.

## Commands

| Command                | What it does                                                               |
| ---------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`             | Dev server                                                                 |
| `pnpm build`           | Production build — catches Server/Client boundary errors nothing else does |
| `pnpm lint`            | ESLint                                                                     |
| `pnpm type-check`      | Type check (`tsc --noEmit`)                                                |
| `pnpm test`            | Vitest, co-located `*.test.ts(x)` files                                    |
| `pnpm db:push:dry-run` | Shows pending migrations                                                   |
| `pnpm db:types`        | Regenerates `types/supabase.types.ts`                                      |

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
