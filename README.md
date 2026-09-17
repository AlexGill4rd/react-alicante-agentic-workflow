# React Alicante Companion

Conference companion app for the React Alicante workshop: schedule, stats and tech news.

Built with Next.js (App Router), Chakra UI v3, Tailwind CSS, Recharts and Supabase. There's no login: every page is public, and the schedule is read from a Supabase `sessions` table.

## Run locally

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy the example env file and fill in your Supabase project URL and publishable key

   ```bash
   cp .env.example .env.local
   ```

3. Create the database tables in your Supabase project

   ```bash
   pnpm supabase login
   pnpm supabase link --project-ref <project-ref>
   pnpm supabase db push
   ```

   `<project-ref>` is the id in your project URL: `https://<project-ref>.supabase.co`. If `db push` can't connect, use the **Session pooler** connection string from the dashboard's **Connect** button: `pnpm supabase db push --db-url "<connection-string>"`.

4. Start the dev server

   ```bash
   pnpm dev
   ```

   Open [localhost:3000/sessions](http://localhost:3000/sessions). If the schedule shows, Supabase is connected.

## Environment variables

| Variable | Where it's read | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Server (`services/supabase.ts`) | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Server (`services/supabase.ts`) | Publishable key; row level security keeps the data read-only |
| `NEWS_API_URL` | Server only (`services/news.ts`) | Base URL of the Hacker News API behind `/news` |
| `NEXT_PUBLIC_ENABLE_STATS` | Server and browser | Set to `false` to hide the Stats page and its nav link |

Variables without the `NEXT_PUBLIC_` prefix never reach the browser. `NEXT_PUBLIC_` variables are inlined into the client bundle **at build time**, so changing one means rebuilding or redeploying.

## Database migrations

Schema changes live in `supabase/migrations/`. Add a new file for each change, never edit one that has already been applied, then run `pnpm supabase db push`.

## Claude Code security settings

`.claude/settings.json` stops Claude from reading `.env` files and from running `supabase db push` or force-pushing. You run those yourself. It also asks before every `git push`.

## Deploy to Vercel

1. Import the repo in Vercel.
2. Add the four variables above under **Settings → Environment Variables**.
3. Deploy.
