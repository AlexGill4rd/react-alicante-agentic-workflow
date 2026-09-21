# Changelog

## [0.2.2] — 2026-09-21

### Bug Fixes

- Treat the PostgREST missing-table error as an empty schedule

### Maintenance

- Say what the tickets command does
- Lean README, walkthrough placeholders, setup ends at the tickets
- Show where the Vercel Preview URL is
- Explain when a Vercel variable is ticked for both environments
- Clearer Vercel step, Production values, first deploy is Production
- Check the Production branch after the first Vercel deployment
- Vercel screenshots, fork copies the main branch, Production tracks main
- Troubleshooting for Invalid API key and missing table, ref check
- Session pooler screenshot, smaller login screenshots
- Project ID steps, Supabase login screenshots, dry run and types steps
- Simpler env step, one example and one screenshot per value
- Password and ref steps, clearer env placeholders, API keys and Data API screenshots
- Supabase screenshots, alias email steps, copy-paste env block
- One Supabase step with sub-sections, table of contents, remote check example
- Shorter Claude Code section, paid plan first
- Clearer gh login steps, drop the before-the-workshop notice
- End the run and deploy steps with a check, add a step to check both environments
- Add a Vercel account step, say what the Playwright browser is for
- Shorter fork and clone, add the Fork button option
- Shorter tool steps, native Claude Code install first, exact links
- One section per tool with expected output, native Claude Code install
- Shorter prerequisites and steps 4 to 11
- Install gh first, explain the clone, drop remarks meant for the author

## Test Suite

| Suite          | Status     |
| -------------- | ---------- |
| ESLint         | ⏳ pending |
| Type-check     | ⏳ pending |
| Unit tests     | ⏳ pending |
| Build (Vercel) | ⏳ pending |

## [0.2.1] — 2026-09-20

### Maintenance

- Tell the user which merge method to use
- Show how to check the Supabase link in release-db-migrate
- Add merge best practices, things to improve and how to start the agents
- Add the verifier agent idea to the things to improve

## Test Suite

| Suite          | Status     |
| -------------- | ---------- |
| ESLint         | ⏳ pending |
| Type-check     | ⏳ pending |
| Unit tests     | ⏳ pending |
| Build (Vercel) | ⏳ pending |

CI: pending — branch not yet pushed

## [0.2.0] — 2026-09-20

### Features

- Move to next-intl with locale-prefixed routes
- Add EN/ES language context with nav toggle
- Read the schedule from a Supabase sessions table
- Add sessions pages, strip starter boilerplate
- Add stats page and session timeline
- Grant select on sessions, ship the Playwright MCP server
- Make track a Postgres enum and derive types from the schema
- Restore Supabase login, gate /stats behind sign-in
- Restore /protected as the default post-signin route
- Drop auth, add public /news page driven by env vars
- Add tickets script and simplify the env var ticket

### Bug Fixes

- Use a hamburger menu below md instead of wrapping
- Add missing route layout for nav/container/spacing
- Survive an environment whose migrations have not run
- Make the release skills run in this repo
- Ignore NEXT_RUNTIME and drop Redis leftovers

### Refactoring

- Migrate shadcn primitives to Chakra UI v3
- Move every component to Chakra and drop Tailwind
- Organise components by atomic design
- Split components by purpose and drop the unused ones
- Consolidate lib/ into a single top-level utils/
- Role-based component structure

### Tests

- Add vitest with a first suite, and enum-ify the level ticket
- Add component testing setup and cover nav and timeline

### Maintenance

- Run lint, type-check and tests on pushes and PRs
- Pin the pnpm version for the runner
- Answer pnpm's build-script prompt for every package
- Add prettier, husky and lint-staged
- Pin every version, move to the Next 16 eslint config
- Add version, db scripts and production project ref
- Keep the production project ref out of .env.local
- Block env file reads and remote DB/force pushes
- Copy and calibrate `.claude` skills, agents and rules to this repo's stack
- Bring the workshop notes into the repo, organised by audience
- Update README for QA/Production projects and db scripts

## Test Suite

| Suite          | Status     |
| -------------- | ---------- |
| ESLint         | ✅ passed  |
| Type-check     | ✅ passed  |
| Unit tests     | ✅ passed  |
| Build (Vercel) | ⏳ pending |

CI: https://github.com/engineering-workshops/react-alicante-agentic-workflow/actions/runs/35495399135
