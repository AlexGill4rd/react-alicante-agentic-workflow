---
name: release-bump-version
description: Bump the version in apps/academy/package.json to a given semver version and commit the change on the current release branch.

metadata:
  domain: devops
  trigger: manual
  after: [release-create-branch]
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: Bump Version

## When to use
- After the release branch has been created, to record the new version before generating the changelog.

## Inputs
- `$ARGUMENTS` (required): semver version string, e.g. `1.4.0`. If omitted, read from context or ask.

## Prerequisites
- **On release branch:** Run `git branch --show-current`. Must start with `release-`. If not → stop and warn.
- **Clean working tree:** Run `git status --short`. If dirty → stop and warn.

## Workflow
1. **Read current version:**
   ```bash
   cat apps/academy/package.json | grep '"version"'
   ```
2. **Show the diff to user:** Print `current → new` and ask for confirmation before writing.
3. **Update version field** in `apps/academy/package.json` only — no other files.
4. **Commit:**
   ```bash
   git add apps/academy/package.json
   git commit -m "chore(release): bump version to <new-version>"
   ```

## Constraints
- Do NOT modify any file other than `apps/academy/package.json`.
- Do NOT skip user confirmation before writing the version change.
- Do NOT push — that is handled by `release-open-pr`.

## Output
- Version bumped and committed on the release branch.

## Verification
- [ ] `cat apps/academy/package.json | grep '"version"'` returns the new version
- [ ] `git log --oneline -1` shows the bump commit
