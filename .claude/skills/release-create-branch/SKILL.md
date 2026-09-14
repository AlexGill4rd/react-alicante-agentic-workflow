---
name: release-create-branch
description: Create a release branch from dev for a given semver version, confirming CI is green and the working tree is clean before proceeding.

metadata:
  domain: devops
  trigger: manual
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: Create Release Branch

## When to use
- At the start of a release, after all feature branches for this release are merged to `dev`.

## Inputs
- `$ARGUMENTS` (required): semver version string, e.g. `1.4.0`. If omitted, ask the user.

## Prerequisites
- **Clean working tree:** Run `git status --short`. If dirty → stop, list files, ask user to commit or stash.
- **CI green on dev:** Run `gh run list --branch dev --limit 3 --json conclusion,status`. If latest run is not `completed/success` → stop and warn.
- **gh authenticated:** Run `gh auth status`. If not → stop, print `gh auth login`.

## Workflow
1. **Checkout and pull dev:**
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. **Derive branch name:** Replace dots with dashes → `release-<x-x-x>`, e.g. `release-1-4-0`.
3. **Create release branch:**
   ```bash
   git checkout -b release-<x-x-x>
   ```
4. **Confirm to user:** Print the branch name and current HEAD SHA.

## Constraints
- Do NOT create the branch from anything other than `dev`.
- Do NOT proceed if CI is not green on `dev`.
- Do NOT push the branch — that is handled by `release-open-pr`.

## Output
- Release branch name (e.g. `release-1-4-0`) ready for version bump and changelog.

## Verification
- [ ] `git branch --show-current` returns `release-<x-x-x>`
- [ ] Branch HEAD matches latest `dev` HEAD
