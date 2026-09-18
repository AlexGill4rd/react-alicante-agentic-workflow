---
name: release-fix-bugs
description: Attempt to fix QA bug issues on the current fix branch — diagnose each issue, implement a fix, run tests, and show a diff for human review before committing.

metadata:
  domain: devops
  trigger: manual
  after: [release-qa-bugs]
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: Fix QA Bugs

## When to use
- After a fix branch `fix-qa-<label>-release-<x-x-x>` has been created and QA issues are open under the milestone.
- When you want Claude to attempt the fixes rather than implementing them yourself.

## Inputs
- `$ARGUMENTS` (required): semver version string, e.g. `1.4.0`.

## Prerequisites
- **On fix branch:** Run `git branch --show-current`. Must start with `fix-qa-` and contain `-release-` (e.g. `fix-qa-auth-release-1-4-0`). If not → stop and warn.
- **Clean working tree:** Run `git status --short`. If dirty → stop and warn.
- **Open issues in milestone:** Run `gh issue list --milestone "v<version> QA" --state open --json number,title,body`. If none → stop, nothing to fix.

---

## Workflow

For each open issue in the QA milestone, repeat the following cycle:

---

### ⏸️ BREAKPOINT 1 — Per-Bug: Confirm Attempt

Show the issue title and description, then ask:
> "Shall I attempt to fix #<number>: <title>? Or do you want to skip and fix this one yourself?"

**Wait for explicit confirmation before touching any code.**

---

### 1. Diagnose

If the issue already has a root cause from `bug-triager` (check issue body) — use it.

Otherwise delegate to `bug-triager`:
> "Investigate bug #<number>: <title>. <paste issue description>"

Read the diagnosis before writing any code.

---

### 2. Implement Fix

- Make the minimal change needed to fix the bug — no refactoring, no cleanup beyond the fix.
- Do NOT modify files unrelated to the bug.
- Do NOT add console.log, comments, or TODOs.

---

### 3. Run Tests

```bash
pnpm test 2>&1
```

If the project has no `test` script, say so on its own line ("no test suite in this project, skipped") and move on — never silently omit this step.

If tests fail → stop, show the failure, ask the user how to proceed. Do NOT commit broken code.

---

### ⏸️ BREAKPOINT 2 — Per-Bug: Review Diff

Show the full diff:
```bash
git diff
```

Ask:
> "Here is the fix for #<number>: <title>. Does this look correct? Reply 'yes' to commit, 'no' to discard and skip, or give me feedback to revise."

**Wait for explicit confirmation. Do NOT commit without approval.**

---

### 4. Commit

Only after user approves:
```bash
git add <changed files>
git commit -m "fix(<scope>): <description> — closes #<number>"
```

---

### After All Issues

Once all issues have been attempted, inform the user:
> "Done. Fixed: [list]. Skipped: [list]. Come back to `release-qa-bugs` to open the PR when you're ready."

---

## Constraints

- Do NOT commit without explicit user approval of the diff.
- Do NOT fix multiple bugs in a single commit — one commit per issue.
- Do NOT refactor or clean up surrounding code.
- Do NOT skip the per-bug confirmation — the user may want to handle some fixes manually.
- If tests fail, stop and surface the failure — never force-push or skip tests.

## Output

- One commit per approved fix on the current fix branch.
- Skipped issues remain open for manual fixing.

## Verification

- [ ] `git log --oneline` shows one commit per fixed issue
- [ ] Each commit message references the issue number with `closes #N`
- [ ] `pnpm test` passes after all commits
