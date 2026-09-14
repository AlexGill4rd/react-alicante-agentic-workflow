---
name: audit-security
description: Security audit for apps/academy. Default scope is the current feature's diff — the changed files and the security surfaces they touch. With --full, audits the whole app before a release. Report only. Called by feature-builder Phase 6 (diff) and release-check-env-vars (--full), or engineer directly.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "[--full] [path]"
---

# Skill: Security Audit

## When to use
- Complements the built-in `/security-review`, which finds generic vulnerabilities (injection, auth bypass, XSS, data exposure) but explicitly skips rate limiting, missing hardening, env-var secrets, and dependencies. This skill covers this project's rules.
- Every feature, before the PR — default diff mode (feature-builder Phase 6).
- Before a release — `--full` (release-check-env-vars step 6).
- On a specific path when asked.

## Inputs
- No arguments → **diff mode**: `git diff origin/dev...HEAD --name-only` plus uncommitted files from `git status --short`.
- `--full` → **full mode**: all of `apps/academy`.
- A path → that path only, with the diff-mode checks.

## Prerequisites
- Read `.claude/rules/backend-security.md` first — it holds this project's security rules (RLS, secrets in headers, webhook signatures, `NEXT_PUBLIC_*`, no silent rejection). Audit against it; don't restate it.
- Diff mode: if the diff is empty, say so and stop.
- Read-only — never modify files.

## Workflow

### 1. Determine scope
State the mode and list the files in scope before checking anything.

### 2. Map changed files to security surfaces
Only run the checks for surfaces the scope touches. If a changed utility is imported by a Server Action or route, include that caller.

| Changed file | Check |
|---|---|
| `src/app/actions/**` | Zod validation at the boundary; `checkPublicActionRateLimit` on public mutations; auth guard where the action needs a user; typed `AppError` errors; rejected input is logged, not silently dropped |
| `src/app/api/**/route.ts` | Webhook signature verified before parsing body (`crypto.timingSafeEqual`, 401 when header missing); secrets in `Authorization` header, never query params; custom form routes don't bypass CSRF protection |
| `src/app/auth/**/route.ts`, `src/proxy.ts` | Session/cookie handling; redirects only to allowed paths; anon key only (never service role on the edge); unexpected params logged |
| `supabase/migrations/*.sql` | RLS enabled in the same migration as `CREATE TABLE`, with a policy for every role that needs access |
| `next.config.ts` | Security headers and CSP not removed or weakened |
| `.env.example`, `process.env` usage | No secret behind a `NEXT_PUBLIC_` prefix; no hardcoded keys/tokens |
| `*.tsx` | Frontend checks (step 3) |
| `package.json` | New dependency noted; the `osv-scanner` job in `.github/workflows/ci-academy.yml` still runs |

### 3. Frontend checks (any `.tsx` in scope)
- `dangerouslySetInnerHTML` — content must be sanitized (e.g. DOMPurify). Unsanitized → Critical.
- `target="_blank"` — must have `rel="noopener noreferrer"`. Missing → Medium.
- `eval(` / `new Function(` — Critical.
- User-controlled value passed into `href` without validation (`javascript:` URLs) → Critical.
- Hardcoded API keys, tokens, passwords → Critical.

### 4. Full mode only — app-wide posture
- Security headers and CSP exist in `next.config.ts` `headers()`.
- `.env*` files are gitignored.
- `osv-scanner` job present and enabled in CI.
- Error boundaries and Sentry config exist.
- Every form that captures PII validates input and is rate limited.
- RLS on every table — run `/audit-database-health` for this instead of re-checking by hand.

### 5. Report
Use the output format below.

## Constraints
- Do NOT modify files — report only. Fixing happens when the user says "fix these".
- Do NOT claim an issue without evidence in the repo (file + line).
- Do NOT mark something safe without reading the code that makes it safe (sanitizer, guard, policy).
- Do NOT suggest disabling or bypassing a security mechanism as a fix.
- Diff mode: do NOT audit untouched files, except direct callers of changed code.

## Output Format

```
## Security Audit: [feature / release / path]
Mode: diff | full | path — [N files in scope]

### Critical
| File:line | Issue | Risk | Suggested Fix |
|-----------|-------|------|---------------|

### High
| File:line | Issue | Risk | Suggested Fix |
|-----------|-------|------|---------------|

### Medium
| File:line | Issue | Risk | Suggested Fix |
|-----------|-------|------|---------------|

### Low
| File:line | Issue | Risk | Suggested Fix |
|-----------|-------|------|---------------|

### Surfaces checked
- [surface] — [files] — clean / N findings

### Recommendations
1. [priority-ordered]
```

## Verification
- [ ] Mode and file list stated before checks.
- [ ] Every surface the scope touches was checked; untouched surfaces skipped.
- [ ] Every finding has file:line, risk, and a fix.
- [ ] No files modified.
