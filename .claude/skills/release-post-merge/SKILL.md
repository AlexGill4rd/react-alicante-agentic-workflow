---
name: release-post-merge
description: Run post-merge steps after the release PR is merged to main — tag the release, create a GitHub release, and merge main back to dev.

metadata:
  domain: devops
  trigger: manual
  after: [release-pre-merge]
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: Post-Merge Steps

## When to use
- After the release PR has been merged to `main` by the user.
- Triggered by the user saying "merged" or "PR merged".

## Inputs
- `$ARGUMENTS` (required): semver version string, e.g. `1.4.0`.

## Prerequisites
- **PR is merged:** Confirm `gh pr list --base main --state merged` shows the release PR. If not → stop, the PR hasn't been merged yet.

---

## Workflow

### 1. Pull Latest Main

```bash
git checkout main
git pull origin main
```

---

### ⏸️ BREAKPOINT 1 — Confirm Tag

Show the proposed tag and ask:
> "I will create tag `v<version>` on main at commit `<sha>`. Confirm?"

**Wait for explicit confirmation before tagging.**

---

### 2. Tag the Release

```bash
git tag -a v<version> -m "Release v<version>"
git push origin v<version>
```

---

### 3. Create GitHub Release

Extract the changelog section for this version from `CHANGELOG.md` — everything between `## [<version>]` and the next `## [` heading. This section already includes the test suite table written by `release-generate-changelog`.

```bash
gh release create v<version> \
  --title "v<version>" \
  --notes "<extracted changelog section>" \
  --latest
```

Print the GitHub release URL.

---

### ⏸️ BREAKPOINT 2 — Confirm Merge Back to Dev

Ask:
> "Release tagged and published. Shall I merge main back to dev now?"

**Wait for confirmation.**

---

### 4. Merge Main Back to Dev

```bash
git checkout dev
git pull origin dev
git merge main
git push origin dev
```

If merge conflicts → stop, list conflicting files, ask user to resolve manually.

---

### ⏸️ BREAKPOINT 3 — Verify Production Deploy

Ask:
> "Vercel will have triggered a production deploy automatically on merge. Please check the Vercel dashboard and the live site to confirm the deploy succeeded and the app looks correct. Reply 'production ok' when verified."

**Wait for confirmation before closing the milestone.**

---

### 5. Close QA Milestone

```bash
gh api repos/{owner}/{repo}/milestones \
  --jq '.[] | select(.title == "v<version> QA") | .number'
```

Then close it:

```bash
gh api repos/{owner}/{repo}/milestones/<number> \
  --method PATCH --field state=closed
```

---

### 6. Done

Print a release summary:
> "Release v<version> complete.
> - Tag: v<version>
> - GitHub Release: <url>
> - main merged back to dev
> - QA milestone closed
> - Production deploy verified"

---

## Constraints

- Do NOT tag without user confirmation.
- Do NOT force-push tags — if tag already exists, warn and ask whether to delete and recreate.
- Do NOT skip merging main back to dev — divergence causes pain on the next release.

## Output

- Git tag pushed to remote
- GitHub release created and published
- `main` merged back to `dev`
- Production deploy verified
- QA milestone closed

## Verification

- [ ] `git tag` shows `v<version>`
- [ ] GitHub release visible at `gh release view v<version>`
- [ ] `git log dev --oneline -1` matches `git log main --oneline -1`
- [ ] Production site verified by user
- [ ] QA milestone state is `closed`

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
