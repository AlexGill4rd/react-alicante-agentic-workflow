# React Alicante Workshop — Attendee Setup

It takes about half an hour, most of it waiting for installs and account
confirmations.

You will create four accounts as you go: GitHub and Claude in step 1, Supabase
in step 3, and Vercel in step 9. Docker and the Vercel CLI are not needed.

## 1. Install the tools

### Node.js 22.13 or newer

```bash
node -v   # v22.13.0 or higher is fine
```

Not installed, or a lower version? Install the LTS version:

1. Download the **LTS** installer from [nodejs.org](https://nodejs.org).
2. Run it and accept the defaults.
3. Open a new terminal and run `node -v` again.

Tested on Node 22 and 24. If you get errors, use Node 24 LTS.

### Git

```bash
git --version   # any version is fine
```

Not installed? Install it, then open a new terminal and run `git --version`:

- macOS: run `xcode-select --install` and click **Install**.
- Windows: download from [git-scm.com/download/win](https://git-scm.com/download/win) and accept the defaults.
- Linux: [git-scm.com/downloads](https://git-scm.com/downloads).

### Google Chrome

Download it from [google.com/chrome](https://www.google.com/chrome/).

### pnpm

```bash
npm install -g pnpm
pnpm -v   # prints a version number, e.g. 11.25.0
```

### GitHub CLI

You need a GitHub account: sign up at [github.com/signup](https://github.com/signup).

```bash
brew install gh                   # macOS
winget install --id GitHub.cli    # Windows (Linux: cli.github.com)
```

Check if you are already logged in:

```bash
gh auth status   # "Logged in to github.com" means you are done
```

If not, run `gh auth login`. It asks a few questions. Use the arrow keys and
press Enter to answer:

1. Account: **GitHub.com**
2. Protocol: **HTTPS**
3. How to authenticate: **Login with a web browser**

For any other question, press Enter to accept the default.

The terminal then shows a one-time code. Copy it and press Enter. Your browser
opens and asks for that code: paste it and authorise. Then run `gh auth status`
again.

### Claude Code

You log in with a Claude account. You need a paid plan (Pro or Max) from
[claude.com/pricing](https://claude.com/pricing), or Anthropic API credits from
[platform.claude.com/settings/billing](https://platform.claude.com/settings/billing). The free plan doesn't
include Claude Code.

**Native install (recommended).** Needs no Node.js.

macOS, Linux, WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Or install with npm.** Works on every system.

```bash
npm install -g @anthropic-ai/claude-code
```

Check:

```bash
claude --version   # prints a version number, e.g. 2.1.278 (Claude Code)
```

### Browser for Playwright

Claude tests the app in a browser with the Playwright tools, which the repo
already configures. The download is about 700 MB.

```bash
npx playwright install chromium
```

## 2. Fork and clone

Open a terminal in the folder where you keep your projects. Then fork and clone
in one command:

```bash
gh repo fork engineering-workshops/react-alicante-agentic-workflow --clone
```

Or click **Fork** on
[github.com/engineering-workshops/react-alicante-agentic-workflow](https://github.com/engineering-workshops/react-alicante-agentic-workflow),
then clone your fork:

```bash
git clone https://github.com/<your-username>/react-alicante-agentic-workflow.git
```

Then, inside the folder:

```bash
cd react-alicante-agentic-workflow
pnpm install
claude   # log in, approve the Playwright server, then exit
```

Check: `git remote -v` shows your fork as `origin`.

## 3. Create a Supabase account

You need two projects, and the free tier allows only 2 per account. Use a fresh
account:

- New to Supabase: sign up at [supabase.com/dashboard/sign-up](https://supabase.com/dashboard/sign-up).
- Already have projects: sign up again at the same link with an email alias
  (`you+react-alicante@gmail.com`) and **email/password**. Don't use "Sign in
  with GitHub": it picks your existing account.

## 4. Create an organization

Go to [supabase.com/dashboard/new](https://supabase.com/dashboard/new). Any name. Type: Educational.

## 5. Create two Supabase projects

Open [supabase.com/dashboard/projects](https://supabase.com/dashboard/projects)
and click **New project**. Create **`ra-qa`** and **`ra-prod`**. QA is for
development, Production is for your deployed site.

For each:

- Database password: use the generator and save it. Note which project it
  belongs to.
- Region: closest to you.
- Security options: keep "Enable Data API" checked, uncheck "Automatically
  expose new tables", keep "Enable automatic RLS" unchecked.

Note each project's ref, the id in its URL `https://<ref>.supabase.co`. You
need both in the next step.

## 6. Wire up environment variables

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

## 7. Connect Supabase and create the tables

The schedule lives in a `sessions` table, created by the migrations in
`supabase/migrations/`. Link to **QA** and push:

```bash
pnpm supabase login                          # opens browser, one-time
pnpm supabase link --project-ref <qa-ref>    # asks for the DB password
pnpm db:push                                 # creates and fills the tables
```

`<qa-ref>` is the `ra-qa` ref from step 5.

Check: in `ra-qa`, **Table Editor → sessions** shows 8 rows.

**`db push` can't connect?** Some networks are IPv4 only, and the direct
connection needs IPv6. Use the Session pooler instead:

1. Supabase → **Connect** → **Session pooler** → copy the connection string.
2. Replace `[YOUR-PASSWORD]` in it with your DB password.
3. Run:

   ```bash
   pnpm supabase db push --db-url "<connection-string>"
   ```

## 8. Run it locally

```bash
pnpm dev
```

Open `localhost:3000/en/sessions`.

Check: the schedule shows up, so Supabase is connected. Then stop the server
with `Ctrl+C`.

## 9. Deploy to Vercel

1. Create a Vercel account at [vercel.com/signup](https://vercel.com/signup):
   click **Continue with GitHub** and authorise Vercel's GitHub app. Already
   have an account? Skip this step.
2. Go to [vercel.com/new](https://vercel.com/new) and, under **Import Git
   Repository**, pick your fork.
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
5. Click **Deploy**.

Check: the deployment shows **Ready** and your site opens. Its `/en/sessions`
stays empty until the release step applies the migrations to `ra-prod`.

## 10. Check both environments

**Production:** open your site from the Vercel dashboard. It loads.
`/en/sessions` is empty for now, because `ra-prod` has no tables yet.

**Preview (QA):** push an empty commit to `dev`:

```bash
git commit --allow-empty -m "Trigger a preview"
git push origin dev
```

In Vercel → **Deployments**, open the new Preview when it shows **Ready**.

Check: its `/en/sessions` shows the schedule from `ra-qa`.

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
