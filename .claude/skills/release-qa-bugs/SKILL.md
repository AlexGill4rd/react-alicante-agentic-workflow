---
name: release-qa-bugs
description: Track QA bugs found on the release branch Vercel preview — create GitHub issues, create one or more fix branches from the release branch, and open PRs back to the release branch.

metadata:
  domain: devops
  trigger: manual
  after: [release-open-pr]
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: QA Bug Tracking & Fix Branches

## When to use
- During QA testing of a release, when bugs have been found on the Vercel preview of the **release branch PR** (not a feature branch preview).
- Can be run multiple times — once per QA round.

## Inputs
- `$ARGUMENTS` (required): semver version string, e.g. `1.4.0`.
- Bug descriptions: provided by the user during the session.

## Prerequisites
- **QA milestone exists:** Run `gh api repos/{owner}/{repo}/milestones` and find `v<version> QA`. If missing → stop and warn.
- **Release branch exists:** `git branch -a | grep release-<x-x-x>`. If missing → stop and warn.

---

## Workflow

### ⏸️ BREAKPOINT 1 — Bug Collection

First, check GitHub for issues already filed under this release:

```bash
gh issue list --milestone "v<version> QA" --label "bug" --state open --json number,title,labels
```

If issues exist, print them and ask:
> "I found [N] existing bug issue(s) under the v<version> QA milestone. Do you have additional bugs to add, or shall we work with these?"

If no issues exist, ask:
> "Please describe the bugs you found during QA. For each one: title, severity (critical/major/minor), steps to reproduce, expected behaviour, actual behaviour. Say 'done' when finished."

Wait for the user's response before proceeding. Do NOT create issues yet.

Present a full summary (existing + new) grouped by severity and ask:
> "I have [N] bugs listed. Before I create issues for the new ones — do any look like security vulnerabilities (auth bypass, data exposure, injection)? If yes, flag them now so we can treat them as priority."

**Wait for explicit confirmation before continuing.**

---

### 1. Create GitHub Issues

For each bug, create an issue under the QA milestone:

```bash
gh issue create \
  --title "<bug title>" \
  --label "bug" \
  --label "release-v<version>" \
  --milestone "<milestone-number>" \
  --body "$(cat <<'EOF'
## Bug Report

**Found during:** QA testing of release v<version>
**Severity:** <critical|major|minor>
**Environment:** Vercel preview — release branch PR

### Steps to Reproduce
<steps>

### Expected
<expected>

### Actual
<actual>
EOF
)"
```

Print each issue URL as it is created.

---

### ⏸️ BREAKPOINT 2 — Bug Triage (Optional)

After issues are created, ask:
> "Do you want me to investigate any of these bugs before fixing? If yes, give me the issue number and any stack trace."

If yes for any bug — delegate to the `bug-triager` agent:
> "Investigate bug #<issue-number>: <title>. Found on release branch Vercel preview for v<version>. <stack trace or description>"

Update the GitHub issue with the root cause and proposed fix before proceeding.

If no or skipped — continue immediately.

---

### ⏸️ BREAKPOINT 3 — Fix Branch Strategy

Ask the user:
> "How do you want to organise the fixes?
> 1. **Single branch** — all bugs in one PR, you fix everything yourself
> 2. **Single branch** — all bugs in one PR, I fix everything
> 3. **Split branches** — one branch for you, one for me (no collision risk); tell me which issues you'll take
> 4. **Per-bug branches** — separate branch per issue (most isolated); tell me which issues you'll take"

**Important:** Claude and the user must NOT work on the same branch at the same time — this causes conflicts. If splitting the work, always use separate branches.

**Wait for explicit answer before creating any branch.**

---

### 2. Create Fix Branch(es) from Release Branch

**Claude creates all branches** — including the user's branch(es). The user never needs to run git commands to set up branches.

What gets created depends on the choice at BREAKPOINT 3:

| Choice | Branches created | Owner |
|---|---|---|
| 1 — single, user fixes | `fix-qa-release-<x-x-x>` | User |
| 2 — single, Claude fixes | `fix-qa-release-<x-x-x>` | Claude |
| 3 — split | `fix-qa-user-release-<x-x-x>` + `fix-qa-claude-release-<x-x-x>` | One each |
| 4 — per bug | `fix-qa-<issue-label>-release-<x-x-x>` per issue | Per assignment |

For each branch:

```bash
git checkout release-<x-x-x>
git pull origin release-<x-x-x>
git checkout -b fix-qa-<label>-release-<x-x-x>
git push -u origin fix-qa-<label>-release-<x-x-x>
```

Print each branch name, its owner, and which issues it covers.

---

### ⏸️ BREAKPOINT 4 — Fix Implementation

**Stop here.** Tell the user which branches are theirs and which are Claude's, then:

**If Claude has a branch to fix** → invoke **`release-fix-bugs`** immediately for that branch:
> "Fix QA bugs for v<version> on branch fix-qa-<label>-release-<x-x-x>"

**If the user has a branch to fix** → wait for them to say "fixes done" before opening their PR.

Both can happen in parallel — Claude works its branch, user works theirs. They never share a branch.

Do NOT open PRs until each branch owner confirms their fixes are complete.

---

### 3. Open Fix PR(s) → Release Branch

**Claude opens PRs only for branches it owns.** For user-owned branches, remind the user to open the PR themselves.

For each Claude-owned branch:

```bash
gh pr create \
  --base release-<x-x-x> \
  --head fix-qa-<label>-release-<x-x-x> \
  --title "fix(qa): <label> fixes for release v<version>" \
  --label "bug" \
  --label "release-v<version>" \
  --body "$(cat <<'EOF'
## QA Bug Fixes — v<version>

Fixes found during QA testing on the release branch Vercel preview.

### Issues Fixed
<list each: Fixes #issue-number — title>

### Security
<note any security-related fixes explicitly>

### Re-test
Re-test on the release branch Vercel preview after merge.

🤖 Generated with Claude Code
EOF
)"
```

For each user-owned branch, say:
> "Please open a PR for `fix-qa-<label>-release-<x-x-x>` targeting `release-<x-x-x>` when you're ready."

---

### ⏸️ BREAKPOINT 5 — PR Review

For Claude-owned PRs, print each URL.

Wait for the user to confirm all PRs (theirs and Claude's) are open, then say:
> "All PRs are open. Review and merge each into `release-<x-x-x>`. Come back after all are merged to run another QA round or proceed to pre-merge checks."

**Wait. Do not auto-merge.**

---

## Constraints

- Do NOT create any fix branch from `dev` or `main` — always from the release branch.
- Do NOT open PRs until the user signals fixes are complete.
- Do NOT merge PRs — the user merges after code review.
- Do NOT skip any breakpoint.
- Security bugs must be noted explicitly in the PR body.

## Output

- GitHub issues created under QA milestone
- One or more fix branches pushed to remote, each from the release branch
- One PR per fix branch targeting the release branch

## Verification

- [ ] Each bug has a GitHub issue under the QA milestone
- [ ] Every fix branch was checked out from the release branch (not dev or main)
- [ ] Every PR targets the release branch
- [ ] All issue numbers referenced with `Fixes #N` in PR body
- [ ] Security bugs explicitly flagged in PR body
