# Stack-Dependent Skill Parts

Parts of skills and agents that change with a mentee's stack. The workflow itself stays the same.

| Part        | Philomath                                                         | Alternatives                                                  | Skills                                                                                                                                                                                                    | Agents                                                                                     |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Test runner | Jest + RTL                                                        | Vitest                                                        | `engineering-new-test`, `engineering-new-component`, `engineering-new-hook`, `engineering-new-server-action`, `audit-test-coverage`                                                                       | —                                                                                          |
| UI library  | Chakra UI v3                                                      | shadcn/ui + Tailwind, MUI, raw Tailwind                       | `engineering-new-component`, `engineering-review-component`, `engineering-code-review`, `engineering-new-page`                                                                                            | `accessibility-auditor`, `feature-builder`                                                 |
| Styling     | CSS variables + SCSS + Tailwind                                   | Tailwind only, CSS-in-JS                                      | `engineering-new-component`, `engineering-review-component`                                                                                                                                               | —                                                                                          |
| Framework   | Next.js App Router                                                | Pages Router, Vite SPA, Remix                                 | most `engineering-*`, `audit-security`, `audit-i18n`                                                                                                                                                      | `feature-builder`, `feature-planner`, `bug-triager`, `accessibility-auditor`               |
| Forms       | react-hook-form + Zod                                             | Formik + Yup                                                  | `engineering-new-component`, `engineering-new-page`, `engineering-new-server-action`, `audit-security`                                                                                                    | `feature-builder`, `bug-triager`                                                           |
| i18n        | next-intl (the starter too, since it moved to `[locale]` routing) | react-i18next, none                                           | `audit-i18n`, `engineering-new-component`, `audit-test-coverage`                                                                                                                                          | `feature-builder`, `feature-planner`, `bug-triager`, `accessibility-auditor`               |
| Database    | Supabase                                                          | Prisma, Firebase                                              | `audit-database-health`, `audit-security`, `release-db-migrate`                                                                                                                                           | `database-manager`, `feature-builder`, `feature-planner`, `bug-triager`, `release-manager` |
| Logging     | pino + Sentry                                                     | none, Datadog                                                 | `engineering-new-server-action`, `engineering-review-component`, `audit-security`, `release-qa-bugs`                                                                                                      | `bug-triager`                                                                              |
| CI / deploy | GitHub Actions + Vercel                                           | GitLab, Netlify                                               | `release-*`, `product-create-pr-description`, `engineering-code-review`                                                                                                                                   | `devops-manager`, `release-manager`, `feature-planner`, `feature-builder`                  |
| Repo layout | Monorepo: app in `apps/academy`, `pnpm db:*` scripts              | Single app at the repo root (the workshop starter)            | `audit-database-health`, `audit-security`, `release-bump-version`, `release-check-env-vars`, `release-db-migrate`, `release-fix-bugs`, `release-generate-changelog`, `release-open-pr`, `release-qa-bugs` | `bug-triager`, `database-manager`, `devops-manager`, `feature-builder`, `release-manager`  |
| Shell tools | `grep -oE` + `sed` (was `grep -oP`)                               | `rg`. Perl regex needs GNU grep; macOS's built-in has no `-P` | `release-check-env-vars`                                                                                                                                                                                  | —                                                                                          |

## Guards, and how to write one that travels

A skill often opens with a prerequisite that decides whether it should run at
all. `audit-i18n` is the clearest case: without a guard it reports every string
in the codebase as a missing translation, which is hundreds of wrong findings
in an app that was never translated.

The guard is right. What doesn't travel is naming one library in it:

```markdown
- Verify `next-intl` is listed in `package.json`. ← breaks on every other stack
- Confirm the project has a translation setup at all — ← same intent, any stack
  a library in `package.json` or a translations module.
  If it has none, say so and stop.
```

The rule: **guard on the capability, not on the product that provides it.** Ask
"does this project translate strings", not "is next-intl installed". Same for a
rate limiter, an error tracker, a test runner — the skill needs to know whether
the capability exists, and the answer is a different package name in every
codebase.

Where the capability is genuinely missing, the skill should say so out loud and
stop, not quietly skip the step. A skipped check that reports nothing looks
exactly like a check that passed.

## The shell-tools row, in practice

`release-check-env-vars` used `grep -oP` to list `process.env.*` references
for a long time. It works when Claude runs it, because Claude Code defines its
own `grep` shim (ugrep, which does support `-P`) as a shell function. Run the
same line yourself in a plain terminal and Apple's grep answers:

```
$ /usr/bin/grep -oP 'process\.env\.\K[A-Z_]+'
grep: invalid option -- P
```

So the step either errors or returns nothing, and "no missing variables" reads
like a pass. Worse than it sounds: the skill passes when the agent runs it and
fails when a human runs the same command by hand, so nobody sees the gap.

The skill now uses `grep -oE` with `sed`, which every grep understands.

The first run of the fixed command reported `ADMIN_USER_ID` as used in code
but missing from `.env.example` — and that was wrong too. The variable is
there, commented out on purpose because it is optional. The audit was reading
only uncommented lines, so a documented-but-optional variable looked
undocumented. Two bugs, one hiding the other.

Worth repeating for any command a skill runs: pin it to the tools you can
assume, not the ones your shell happens to have.

Idea: keep these in rule files (`rules/testing.md`, `rules/ui.md`, …), not inside skills. Mentees then edit a few rules, not every skill.

## A global skill silently overrides the repo's

Skills load from `~/.claude/skills/` and from a repo's `.claude/skills/`. When both hold the same name, **global wins** — the repo's copy never loads, with no warning.

This bit us: skill refactors committed to platform-website between June and September never ran, because stale global copies from June shadowed them. Verified by invoking a skill and reading the base directory it reported.

Attendees won't hit this — fresh machines have no global skills. The presenter will, so check before demoing:

```bash
comm -12 <(ls .claude/skills | sort) \
         <(find ~/.claude/skills -maxdepth 1 -type d ! -name skills -exec basename {} \; | sort)
```

Anything it prints is a repo skill that will not load. Move the global copy aside for the session.

`-type d` matters: a global entry that is a symlink back into the same repo is the same file, not a shadow, and a plain `ls` would report it as a collision.
