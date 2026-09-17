# React Alicante Companion

Conference companion app for the React Alicante workshop: schedule, stats and tech news.

Built with Next.js (App Router), Chakra UI v3, Tailwind CSS and Recharts. No login and no database — every page is public.

## Run locally

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Copy the example env file

   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server

   ```bash
   pnpm dev
   ```

   Open [localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Where it's read | Purpose |
|---|---|---|
| `NEWS_API_URL` | Server only (`services/news.ts`) | Base URL of the Hacker News API behind `/news` |
| `NEXT_PUBLIC_ENABLE_STATS` | Server and browser | Set to `false` to hide the Stats page and its nav link |

Variables without the `NEXT_PUBLIC_` prefix never reach the browser. `NEXT_PUBLIC_` variables are inlined into the client bundle **at build time**, so changing one means rebuilding or redeploying.

## Deploy to Vercel

1. Import the repo in Vercel.
2. Add the two variables above under **Settings → Environment Variables**.
3. Deploy.
