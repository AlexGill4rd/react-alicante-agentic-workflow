---
name: product-github-issue-manager
description: Create, update, and close GitHub issues and epics. Called by feature-planner, feature-builder, bug-triager, and release-qa-bugs.

metadata:
  domain: product
  trigger: both
  after: []

argument-hint: "create-feature | create-epic | create-bug | close <issue-number> <pr-number>"
---

# Skill: GitHub Issue Manager

## When to use
- Creating a feature issue (called by `feature-planner`)
- Creating a bug issue (called by `release-qa-bugs`, `bug-triager`)
- Creating an epic (called by `feature-planner` for large features)
- Closing an issue after a PR merges

## Inputs
- `$ARGUMENTS` (required): operation — `create-feature`, `create-epic`, `create-bug`, or `close <issue-number> <pr-number>`
- Context is passed by the calling agent — title, body content, labels, milestone

## Prerequisites

- `gh` CLI authenticated: `gh auth status`. If not → stop, print `gh auth login`.
- Repo inferred from `git remote get-url origin` — never hardcoded.
- Required labels exist: `feature`, `epic`, `bug`, `chore`. Create any missing ones before proceeding.

---

## Operations

### create-feature

```bash
gh issue create \
  --title "<title>" \
  --label "feature" \
  --assignee "@me" \
  --body "$(cat <<'EOF'
## What
[What this feature does from a user perspective]

## Why
[User value or business reason]

## Acceptance Criteria
- [ ] [Measurable criterion]
- [ ] [Measurable criterion]

## Execution Plan
[Phases from feature-planner — omit if not available]

## Notes
[Constraints, open questions, related issues]
EOF
)"
```

Search for duplicates first:
```bash
gh issue list --search "<title>" --state open
```
If duplicate found → return existing issue URL, do NOT create another.

---

### create-bug

```bash
gh issue create \
  --title "<title>" \
  --label "bug" \
  --label "<release-vX-X-X if in release context>" \
  --milestone "<milestone number if provided>" \
  --body "$(cat <<'EOF'
## Bug Report

**Severity:** <critical|major|minor>
**Environment:** <local | QA preview | production>

## Steps to Reproduce
<steps>

## Expected
<expected>

## Actual
<actual>

## Root Cause
<filled in by bug-triager if investigated>
EOF
)"
```

---

### create-epic

```bash
gh issue create \
  --title "Epic: <theme>" \
  --label "epic" \
  --body "$(cat <<'EOF'
## Goal
[Outcome this epic achieves]

## Child Issues
- [ ] #<number> — <title>

## Out of Scope
[What this epic deliberately does NOT include]
EOF
)"
```

After child issues are created, update the epic body to list them.

---

### close

Verify PR is merged before closing:
```bash
gh pr view <pr-number> --json state,mergedAt
```

If merged:
```bash
gh issue close <issue-number> \
  --comment "Closed by PR #<pr-number> merged on <date>."
```

If not merged → warn, do NOT close.

---

## Constraints

- Do NOT create duplicate issues — always search first.
- Do NOT hardcode the repo — always infer from `git remote`.
- Do NOT close an issue if the PR is not yet merged.
- Do NOT create issues without Acceptance Criteria for features — ask if missing.
- Do NOT assign a milestone unless explicitly provided by the caller.

## Output

- Issue URL printed after creation
- Confirmation message after closing
