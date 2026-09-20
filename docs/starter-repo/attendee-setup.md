# React Alicante Workshop — Attendee Setup

Do all of this before the workshop. It takes about half an hour, most of it
waiting for installs and account confirmations.

## Prerequisites

Install:

- **Node.js 22 or newer** (check with `node -v`). Download the LTS installer
  from [nodejs.org](https://nodejs.org), or on macOS run `brew install node`.
- **pnpm** (`npm install -g pnpm`, check with `pnpm -v`)
- **Git** (`git --version`). macOS: `xcode-select --install`. Windows:
  [Git for Windows](https://git-scm.com/download/win), which Claude Code on
  Windows also needs.
- **Google Chrome**, used by the Playwright browser tools (step 3)
- **Playwright's browsers**, downloaded once with
  `npx playwright install chromium`. Do this before the workshop: the download
  is about 700 MB. The repo already ships the Playwright MCP server in
  `.mcp.json`, so there is nothing else to configure. Claude Code asks you to
  approve it the first time you start it in the project.
- GitHub CLI and Claude Code: steps 1 and 3 below

Accounts:

- GitHub, Supabase (step 4), Vercel (step 10)
- Claude: a paid plan (Pro or Max) or Anthropic API credits. The free plan
  doesn't include Claude Code.

Not needed: TypeScript and the Supabase CLI come with `pnpm install`;
Docker (Supabase runs in the cloud); the Vercel CLI.

## 1. Install the GitHub CLI

```bash
brew install gh        # macOS
winget install --id GitHub.cli   # Windows
```

Linux: [cli.github.com](https://cli.github.com). Then:

```bash
gh auth login
gh auth status   # verify
```

## 2. Fork and clone

Open a terminal in the folder where you keep your projects, then run:

```bash
gh repo fork engineering-workshops/react-alicante-agentic-workflow --clone
cd react-alicante-agentic-workflow
pnpm install
```

The first command makes your own copy of the repo on GitHub (the fork) and
downloads it to your computer (`--clone`). From here on, run every command
inside this folder.

Check: `git remote -v` shows your fork as `origin` and the workshop repo as
`upstream`.

## 3. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Run `claude` from inside the repo folder and log in when prompted.
[claude.com/claude-code](https://claude.com/claude-code) for install issues.

## 4. Create a Supabase account

You need **two projects**, one for QA and one for Production, and the free tier
caps at exactly 2 per account (across all orgs). So start from a fresh account:

- New to Supabase: sign up normally.
- Already have projects elsewhere: sign up again with an email alias
  (`you+react-alicante@gmail.com`) using **email/password**, not "Sign in
  with GitHub" — GitHub login ignores the alias and resolves to your
  existing account. A fresh account has both project slots free.

## 5. Create an organization

Any name. Type: Educational (cosmetic only, no effect on limits).

## 6. Create two Supabase projects

Create them one after the other: **`ra-qa`** and **`ra-prod`**. QA is what you
develop against; Production is what your deployed site uses. Different
projects mean different credentials.

For each:

- Database password: use the generator, save it, and note which project it
  belongs to.
- Region: closest to you.
- Security options: leave "Enable Data API" checked, uncheck "Automatically
  expose new tables", leave "Enable automatic RLS" unchecked. The migrations
  grant read access to the one table they create and enable row level security
  on it, so nothing else is exposed by default.

Note each project's ref, the id in its URL `https://<ref>.supabase.co`. You
need both in the next step.

## 7. Wire up environment variables

```bash
cp .env.example .env.local
```

Local development points at **QA**. From the `ra-qa` project: **Settings →
Data API** for the Project URL, **Settings → API Keys** for the publishable
key. `SUPABASE_PRODUCTION_PROJECT_REF` is the **`ra-prod`** ref, used later to
relink before applying migrations to Production.

```
NEXT_PUBLIC_SUPABASE_URL=your-qa-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-qa-publishable-key
SUPABASE_PRODUCTION_PROJECT_REF=your-prod-project-ref
NEWS_API_URL=https://hn.algolia.com/api/v1
NEXT_PUBLIC_ENABLE_STATS=true
```

## 8. Connect Supabase and create the tables

The schedule lives in a `sessions` table, created by the migrations in
`supabase/migrations/`. The Supabase CLI comes with `pnpm install`.

Link to **QA** and push. Production gets the same migrations later, at release
time, through `release-db-migrate`.

```bash
pnpm supabase login                          # opens browser, one-time
pnpm supabase link --project-ref <qa-ref>    # asks for that project's DB password
pnpm db:push                                 # creates and fills the tables
```

`<qa-ref>` is the id in the `ra-qa` project URL: `https://<qa-ref>.supabase.co`.

Check: in `ra-qa`, **Table Editor → sessions** shows 8 rows. `ra-prod` stays
empty for now.

**`db push` can't connect?** The direct database connection is often IPv6
only, and some networks are IPv4 only. Use the
Session pooler instead, which works everywhere:

1. Supabase → **Connect** → **Session pooler** → copy the connection string.
2. Replace `[YOUR-PASSWORD]` in it with your DB password.
3. Run:

   ```bash
   pnpm supabase db push --db-url "<connection-string>"
   ```

## 9. Run it locally

```bash
pnpm dev
```

Visit `localhost:3000` — it redirects to `/en`. Open `/en/sessions`, and if
the schedule shows up, Supabase is connected. `/es/sessions` is the same page
in Spanish.

## 10. Deploy to Vercel

1. [vercel.com](https://vercel.com) → **Continue with GitHub**. This creates
   the account if you don't have one; there is no separate signup. Authorise
   Vercel's GitHub app when asked — it needs access to import your fork.
2. **Add New → Project → Import Git Repository** → pick your fork.
3. Add the env vars. The names are the same, and the values differ per
   environment:

   | Variable                               | Preview      | Production    |
   | -------------------------------------- | ------------ | ------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`             | `ra-qa` URL  | `ra-prod` URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `ra-qa` key  | `ra-prod` key |
   | `NEWS_API_URL`                         | same in both | same in both  |
   | `NEXT_PUBLIC_ENABLE_STATS`             | `true`       | `false`       |

   In Vercel each variable has checkboxes for Production, Preview and
   Development, so add the Supabase ones twice, once per environment.

   Set `NEXT_PUBLIC_ENABLE_STATS` to `false` in Production. `NEXT_PUBLIC_`
   values are baked in at build time, so changing one needs a redeploy.

4. **Settings → Environments → Production → Branch Tracking**: confirm it says
   `main`. Vercel picks `main` on import, so it should already be right.
   Production deploys when the release PR merges into `main`; `dev` and feature
   branches get Preview deployments.
5. Deploy.

The first deployment of a new Vercel project is always a Production one, from
whatever the repo is at right now — so your site is live before you have
released anything. After that, only merges into `main` update Production.

Production has no tables yet, so `/en/sessions` there stays empty until the
release step applies the migrations to `ra-prod`. Preview, which points at QA,
works straight away.

## 11. Create your workshop tickets

```bash
pnpm workshop:tickets
```

Creates the workshop tickets as issues in your fork. Forks start with Issues
turned off; the script turns them on and points `gh` at your fork, so the
agents read tickets from your repo, not the starter repo. Safe to run twice:
tickets that already exist are skipped.

Check: your fork's **Issues** tab shows 3 open issues.

## 12. Start the agents

Start a session as the agent you want to talk to. Run it from the repo root and
add your first request in quotes:

```bash
claude --agent feature-builder "#1"
claude --agent release-manager "next minor"
```

You then talk to the agent directly.

Always start the agent with `claude --agent`. Asking a normal session to "run
release-manager" does not work.

Check: the agent greets you and asks its first question.
