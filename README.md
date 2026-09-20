# React Alicante App

A small app for the React Alicante workshop: the conference schedule, stats and tech news.

Built with Next.js (App Router), Chakra UI v3, next-intl, Recharts and Supabase. There is no login: every page is public, and the schedule is read from a Supabase `sessions` table.

## Workshop

Follow these three guides, in order:

1. [Attendee setup](docs/starter-repo/attendee-setup.md): accounts, tools, both Supabase projects, Vercel and your tickets.
2. [Feature-builder walkthrough](docs/starter-repo/feature-builder-walkthrough.md): build the tickets with the agent.
3. [Release-manager walkthrough](docs/starter-repo/release-manager-walkthrough.md): release them to Production.

## Requirements

Node.js 22.13 or newer and pnpm. The setup guide covers the rest.

## Commands

| Command                | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `pnpm dev`             | Dev server                                                    |
| `pnpm build`           | Production build                                              |
| `pnpm lint`            | ESLint                                                        |
| `pnpm type-check`      | Type check                                                    |
| `pnpm test`            | Tests                                                         |
| `pnpm db:link:status`  | Lists your Supabase projects and shows the linked one         |
| `pnpm db:push:dry-run` | Shows which migrations would be applied                       |
| `pnpm db:push`         | Applies them to the linked project                            |
| `pnpm db:types`        | Regenerates `types/supabase.types.ts` from the linked project |

Schema changes live in `supabase/migrations/`. Add a new file for each change and never edit one that has already been applied.

## Claude Code

Start an agent as its own session, from the repo root: `claude --agent <name>`. Do not ask a normal session to "run release-manager": it starts as a subagent, and a subagent cannot take your "yes".

`.claude/settings.json` stops Claude from reading `.env` files, from applying migrations (`db:push`) and from force-pushing, and asks before every `git push`. You run the blocked commands yourself.
