---
name: release-pre-merge
description: Run pre-merge checks before merging the release PR to main — verify QA issues are closed, check for merge conflicts, apply DB migrations to Production, then confirm the release is ready to merge.

metadata:
  domain: devops
  trigger: manual
  after: [release-qa-bugs]
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: Pre-Merge Checks

## When to use
- After QA has passed and all QA bug fix PRs are merged into the release branch.
- Before the user merges the release PR to `main`.

## Inputs
- `$ARGUMENTS` (required): semver version string, e.g. `1.4.0`.

---

## Workflow

### 1. Verify All QA Issues Closed

```bash
gh issue list --milestone "v<version> QA" --state open --json number,title
```

If any issues are open → stop, list them, warn:
> "The following QA issues are still open. Resolve them before merging."

If all closed → continue.

---

### 2. Check for Merge Conflicts with Main

```bash
git fetch origin main
if git merge --no-commit --no-ff origin/main 2>/dev/null; then
  git merge --abort
  echo "NO_CONFLICTS_DETECTED"
else
  git merge --abort || true
  echo "CONFLICTS_POSSIBLE"
fi
```

If `CONFLICTS_POSSIBLE` → warn:
> "Merge conflicts with main detected. Resolve locally before merging the PR."

Stop and wait for the user to resolve before continuing.

---

### ⏸️ BREAKPOINT 1 — Migrate DB to Production

This is the most critical step — DB must be migrated **before** the code deploy (merging to main triggers Vercel deploy).

Invoke the **`release-db-migrate`** skill:
> "Apply DB migrations to Production for v<version>"

Wait for the user to confirm migrations are applied and verified before continuing.

---

### ⏸️ BREAKPOINT 2 — Final Merge Confirmation

Print a summary:
- ✅ All QA issues closed
- ✅ No merge conflicts
- ✅ DB migrations applied to Production

Then ask:
> "All checks passed. The release PR is ready to merge. Go to GitHub, merge the PR, and come back to run post-merge steps."

**Do NOT merge the PR — the user merges manually.**

---

## Constraints

- Do NOT proceed past DB migration if the user has not confirmed it is complete.
- Do NOT merge the PR — leave that to the user.
- Do NOT skip conflict check — silent conflicts cause broken main.

## Output

- Confirmation that all checks passed and the release is safe to merge.

## Verification

- [ ] Zero open issues in QA milestone
- [ ] No merge conflicts with main
- [ ] DB migrations applied and verified in Production
- [ ] User has been directed to merge the PR
