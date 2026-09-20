# React Alicante Workshop — Attendee Setup

Do all of this before the workshop. It takes about half an hour, most of it
waiting for installs and account confirmations.

## Prerequisites

Install:

- **Node.js 22 or newer**: [nodejs.org](https://nodejs.org), or `brew install node` on macOS. Check with `node -v`.
- **pnpm**: `npm install -g pnpm`. Check with `pnpm -v`.
- **Git**: macOS `xcode-select --install`, Windows [Git for Windows](https://git-scm.com/download/win). Check with `git --version`.
- **Google Chrome**
- **Playwright's browsers**: `npx playwright install chromium`. About 700 MB, so do it before the workshop.
- **GitHub CLI** and **Claude Code**: steps 1 and 3 below.

Accounts:

- GitHub, Supabase (step 4), Vercel (step 10)
- Claude: a paid plan (Pro or Max) or Anthropic API credits. The free plan doesn't include Claude Code.

Not needed: Docker and the Vercel CLI. TypeScript and the Supabase CLI come with `pnpm install`.

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

Run `claude` from inside the repo folder and log in when prompted. The first
time, approve the Playwright server when Claude Code asks.
[claude.com/claude-code](https://claude.com/claude-code) for install issues.

## 4. Create a Supabase account

You need two projects, and the free tier allows only 2 per account. Use a fresh
account:

- New to Supabase: sign up normally.
- Already have projects: sign up again with an email alias
  (`you+react-alicante@gmail.com`) and **email/password**. Don't use "Sign in
  with GitHub": it picks your existing account.

## 5. Create an organization

Any name. Type: Educational.

## 6. Create two Supabase projects

Create **`ra-qa`** and **`ra-prod`**. QA is for development, Production is for
your deployed site.

For each:

- Database password: use the generator and save it. Note which project it
  belongs to.
- Region: closest to you.
- Security options: keep "Enable Data API" checked, uncheck "Automatically
  expose new tables", keep "Enable automatic RLS" unchecked.

Note each project's ref, the id in its URL `https://<ref>.supabase.co`. You
need both in the next step.

## 7. Wire up environment variables

```bash
cp .env.example .env.local
```

Local development uses **QA**. From `ra-qa`: **Settings → Data API** for the
Project URL, **Settings → API Keys** for the publishable key.
`SUPABASE_PRODUCTION_PROJECT_REF` is the `ra-prod` ref.

```
NEXT_PUBLIC_SUPABASE_URL=your-qa-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-qa-publishable-key
SUPABASE_PRODUCTION_PROJECT_REF=your-prod-project-ref
NEWS_API_URL=https://hn.algolia.com/api/v1
NEXT_PUBLIC_ENABLE_STATS=true
```

## 8. Connect Supabase and create the tables

The schedule lives in a `sessions` table, created by the migrations in
`supabase/migrations/`. Link to **QA** and push:

```bash
pnpm supabase login                          # opens browser, one-time
pnpm supabase link --project-ref <qa-ref>    # asks for the DB password
pnpm db:push                                 # creates and fills the tables
```

`<qa-ref>` is the `ra-qa` ref from step 6.

Check: in `ra-qa`, **Table Editor → sessions** shows 8 rows.

**`db push` can't connect?** Some networks are IPv4 only, and the direct
connection needs IPv6. Use the Session pooler instead:

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

Open `localhost:3000/en/sessions`. If the schedule shows up, Supabase is
connected. (`/es/sessions` is the Spanish version.)

## 10. Deploy to Vercel

1. [vercel.com](https://vercel.com) → **Continue with GitHub**. This creates the
   account if you don't have one. Authorise Vercel's GitHub app when asked.
2. **Add New → Project → Import Git Repository** → pick your fork.
3. Add the env vars. The names are the same, and the values differ per
   environment:

   | Variable                               | Preview      | Production    |
   | -------------------------------------- | ------------ | ------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`             | `ra-qa` URL  | `ra-prod` URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `ra-qa` key  | `ra-prod` key |
   | `NEWS_API_URL`                         | same in both | same in both  |
   | `NEXT_PUBLIC_ENABLE_STATS`             | `true`       | `false`       |

   Each variable has checkboxes for Production, Preview and Development, so
   add the Supabase ones twice. `NEXT_PUBLIC_` values are baked in at build
   time, so changing one needs a redeploy.

4. **Settings → Environments → Production → Branch Tracking**: confirm it says
   `main`. Production deploys when the release PR merges into `main`; `dev` and
   feature branches get Preview deployments.
5. Deploy.

The first deployment is a Production one, so your site is live right away.
After that, only merges into `main` update Production. `/en/sessions` in
Production stays empty until the release step applies the migrations to
`ra-prod`. Preview works straight away.

## 11. Create your workshop tickets

```bash
pnpm workshop:tickets
```

Creates the workshop tickets as issues in your fork, and turns Issues on. Safe
to run twice: tickets that already exist are skipped.

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
