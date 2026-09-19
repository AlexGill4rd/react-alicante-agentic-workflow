# React Alicante Companion

Conference companion app for the React Alicante workshop: schedule, stats and tech news.

Built with Next.js (App Router), Chakra UI v3, Tailwind CSS, Recharts and Supabase. There's no login: every page is public, and the schedule is read from a Supabase `sessions` table.

**Workshop attendees: start with [docs/starter-repo/attendee-setup.md](docs/starter-repo/attendee-setup.md)** — accounts, both Supabase projects, Vercel and your tickets, in order. The short version below assumes you already have those.

## Run locally

You need two Supabase projects, one for QA and one for Production. Local development uses the QA one; Production has its own credentials and gets migrations at release time.

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy the example env file and fill in the values from your **QA** project, plus the ref of your Production project

   ```bash
   cp .env.example .env.local
   ```

3. Create the database tables in the QA project

   ```bash
   pnpm supabase login
   pnpm supabase link --project-ref <qa-ref>
   pnpm db:push
   ```

   `<qa-ref>` is the id in that project's URL: `https://<qa-ref>.supabase.co`. If the push can't connect, use the **Session pooler** connection string from the dashboard's **Connect** button: `pnpm db:push --db-url "<connection-string>"`.

4. Start the dev server

   ```bash
   pnpm dev
   ```

   Open [localhost:3000/en/sessions](http://localhost:3000/en/sessions). If the schedule shows, Supabase is connected. Routes are locale-prefixed (`/en`, `/es`); `/` redirects to the default locale.

## Environment variables

| Variable                               | Where it's read                  | Purpose                                                                                      |
| -------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Server (`services/supabase.ts`)  | Project URL: QA locally, Production in production                                            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Server (`services/supabase.ts`)  | Publishable key; row level security keeps the data read-only                                 |
| `SUPABASE_PRODUCTION_PROJECT_REF`      | Release skills                   | Ref of the Production project, used to relink before applying migrations there. Not a secret |
| `NEWS_API_URL`                         | Server only (`services/news.ts`) | Base URL of the Hacker News API behind `/news`                                               |
| `NEXT_PUBLIC_ENABLE_STATS`             | Server and browser               | Set to `false` to hide the Stats page and its nav link                                       |

Variables without the `NEXT_PUBLIC_` prefix never reach the browser. `NEXT_PUBLIC_` variables are inlined into the client bundle **at build time**, so changing one means rebuilding or redeploying.

In Vercel the same names hold different values per environment:

| Variable                         | Preview      | Production         |
| -------------------------------- | ------------ | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL` / key | QA project   | Production project |
| `NEWS_API_URL`                   | same in both | same in both       |
| `NEXT_PUBLIC_ENABLE_STATS`       | `true`       | `false`            |

## Database

Scripts:

| Script                 | What it does                                                  |
| ---------------------- | ------------------------------------------------------------- |
| `pnpm db:link:status`  | Lists your projects and shows which one the CLI is linked to  |
| `pnpm db:push:dry-run` | Shows which migrations would be applied                       |
| `pnpm db:push`         | Applies them to the linked project                            |
| `pnpm db:types`        | Regenerates `types/supabase.types.ts` from the linked project |

Schema changes live in `supabase/migrations/`. Add a new file for each change and never edit one that has already been applied.

## Claude Code security settings

`.claude/settings.json` stops Claude from reading `.env` files, from applying migrations (`db:push`) and from force-pushing, and asks before every `git push`. You run the blocked commands yourself.

Claude can still run `pnpm db:push:dry-run`, so the usual flow is: Claude shows you the dry run, you apply the migration.

## Deploy to Vercel

1. Import the repo in Vercel.
2. Add the variables under **Settings → Environment Variables**, using the per-environment table above.
3. Deploy.
