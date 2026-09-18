---
name: release-check-env-vars
description: Audit env vars before QA — find new vars added to .env.example since last tag, cross-check all process.env references in code against .env.example to catch mismatches, then confirm everything is set in Vercel.

metadata:
  domain: devops
  trigger: manual
  after: [release-open-pr]
  priority: high
  blocking: true

argument-hint: "<version> — e.g. 4.0.0"
---

# Skill: Check Environment Variables

## When to use
- At the start of the QA phase, before any testing begins. Runs four checks in sequence: env vars, database health, test coverage gaps, and a full security audit.

## Inputs
- `$ARGUMENTS` (required): version string, e.g. `4.0.0`.

## Prerequisites
- **Last tag exists:** Run `git tag --sort=-creatordate | head -1` to find the previous tag.
- **On release branch:** `git branch --show-current` must return `release-<x-x-x>`.

---

## Workflow

### 1. Find New Variables in .env.example

```bash
git diff <last-tag>..HEAD -- .env.example
```

Extract added lines (starting with `+`, excluding `+++`) — these are candidates for Vercel.

---

### 2. Audit All process.env References in Code

```bash
grep -rhoE "process\.env\.[A-Z_]+" app components contexts services utils \
  --include="*.ts" --include="*.tsx" | sed 's/^process\.env\.//' | sort -u
```

Plain `-E` and `sed`, not `grep -P`: macOS's built-in grep has no Perl mode.

Ignore platform-provided variables in the output (`VERCEL_URL`, `VERCEL_ENV`, `NODE_ENV`): nobody sets those by hand, so they don't belong in `.env.example`.

Then read the current `.env.example` keys:

```bash
grep -oE '^[A-Z_]+' .env.example | sort -u
```

**Cross-check:** Find any `process.env.X` references in code where `X` is NOT in `.env.example`. These are missing or misnamed variables — report them as **errors**.

---

### ⏸️ BREAKPOINT — Review Findings

Present two sections:

**New variables (added since `<last-tag>`):**
> | Variable | Preview | Production |
> |---|---|---|
> | `VAR_NAME` | ☐ | ☐ |
> | … | … | … |

**Mismatches (used in code but missing from .env.example):**
> ⚠️ The following variables are referenced in code but not documented in `.env.example`:
> - `SOME_VAR` — found in `src/app/api/foo/route.ts:29`
>
> These must be added to `.env.example` AND set in Vercel before QA.

If no new vars and no mismatches → inform user:
> "No new or missing environment variables found. Nothing to add to Vercel."
Then stop.

Notes to include:
- Variables that differ per environment (Supabase project URL and key, feature flags) → set the QA value for Preview and the Production value for Production
- `NEXT_PUBLIC_*` variables are exposed to the browser — double-check values before saving
- `NEXT_PUBLIC_*` variables require a Vercel redeployment to take effect if the preview was already deployed

> "Go to Vercel → Project → Settings → Environment Variables and add any missing ones.
> Reply 'done' when all variables are set in Vercel."

**Wait for explicit confirmation before marking complete.**

---

### 3. Fix Mismatches in .env.example

For each mismatch identified in step 2 — add the missing variable to `.env.example` with a placeholder value, then commit:

```bash
git add .env.example
git commit -m "chore: add missing env vars to .env.example"
```

---

### 4. Database Health Check

Invoke `/audit-database-health`:
> "/audit-database-health" (runs all three checks: migration drift, RLS audit, index audit)

Report findings. For each issue found:
- **Migration drift** (local migration not pushed to QA) → instruct user to run `pnpm db:push` before QA testing begins
- **Table missing RLS** → flag as a blocker; a release should not proceed with unprotected tables
- **Unindexed foreign key** → note as a follow-up, non-blocking for QA

→ Update state: DB Health ✅ when no blockers found (or all blockers resolved).

---

### 5. Test Coverage Check

Invoke `/audit-test-coverage`:
> "/audit-test-coverage" (scans all components, hooks, utils for missing tests)

Report untested files by priority. This is informational — gaps do not block the release unless they are in newly added code from this release.

For each High-priority untested file added in this release:
> "⚠️ New file `<path>` has no test. This was added in this release — consider adding a test before merging."

---

### 6. Full Security Audit

Invoke `/audit-security --full` — the whole app, not just one feature's diff (each feature was already audited on its diff in feature-builder Phase 6):
> "/audit-security --full"

Report findings. **Critical and High are blockers** — the release should not go to QA with them open. Medium/Low are noted as follow-ups.

→ Update state: Security Audit ✅ when no Critical/High findings remain.

---

## Constraints

- Do NOT attempt to set Vercel env vars automatically — this is a manual step.
- Do NOT skip this step — missing or misnamed env vars cause silent runtime failures.
- Always run BOTH checks (diff + code scan) — the diff alone misses pre-existing mismatches.
- Variables with `NEXT_PUBLIC_` prefix require a redeployment after being added to Vercel.
- DB health RLS failures are **blockers** — do not mark this step complete while tables are unprotected.
- Test coverage gaps are **informational** — only flag new files from this release as requiring attention.
- Security audit Critical/High findings are **blockers** — do not mark this step complete while they are open.

## Output

- All new and mismatched env vars identified and documented in `.env.example`.
- Redis connectivity verified (or confirmed not configured, falling back to in-memory).
- User confirmed all variables are set in Vercel (Preview + Production).
- Database health: migration drift, RLS gaps, and index issues reported.
- Test coverage: untested new files from this release flagged.
- Security: full-app audit run, Critical/High findings resolved.

## Verification

- [ ] `git diff` checked for new `.env.example` lines since last tag
- [ ] `process.env.*` references in code cross-checked against `.env.example`
- [ ] Any mismatches added to `.env.example` and committed
- [ ] Redis connectivity confirmed (PING) if `UPSTASH_REDIS_REST_URL` is configured
- [ ] User confirmed all vars set in Vercel (Preview + Production)
- [ ] `/audit-database-health` run — no RLS blockers outstanding
- [ ] `/audit-test-coverage` run — new untested files flagged to user
- [ ] `/audit-security --full` run — no Critical/High findings outstanding
