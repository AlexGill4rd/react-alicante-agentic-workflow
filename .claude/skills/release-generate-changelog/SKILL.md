---
name: release-generate-changelog
description: Generate a CHANGELOG.md entry from conventional commits since the last git tag and prepend it to the changelog on the release branch.

metadata:
  domain: devops
  trigger: manual
  after: [release-bump-version]
  priority: high
  blocking: true

argument-hint: "<version> e.g. 1.4.0"
---

# Skill: Generate Changelog

## When to use
- After the version has been bumped on the release branch, to document what changed in this release.
- Manually, any time you need a changelog entry for a version (see [Manual Use](#manual-use) below).

## Inputs
- `$ARGUMENTS` (required): semver version string. If omitted, read from `package.json`.

## Prerequisites
- **On release branch:** Run `git branch --show-current`. Must start with `release-`. If not → stop and warn.

---

## Workflow

### 1. Get last tag

```bash
git describe --tags --abbrev=0 2>/dev/null || echo "no-tags"
```

If no tags exist, use the first commit: `git rev-list --max-parents=0 HEAD`.

---

### 2. Get commits since last tag

```bash
git log <last-tag>..HEAD --oneline --no-merges
```

---

### 3. Group by conventional commit type

- `feat` → **Features**
- `fix` → **Bug Fixes**
- `perf` → **Performance**
- `refactor` → **Refactoring**
- `test` → **Tests**
- `chore` / `ci` / `docs` → **Maintenance**
- Unlabelled → **Other**

---

### 4. Get CI run status for the release branch

```bash
gh run list --branch $(git branch --show-current) --limit 1 \
  --json url,status,conclusion,name \
  --jq '.[0] | "\(.conclusion) \(.url)"'
```

Build the test suite table from the CI jobs. The CI pipeline runs these jobs (from `ci-academy.yml`):

| Suite | CI job |
|---|---|
| Prettier | `lint` |
| ESLint | `lint` |
| Type-check (academy) | `build` |
| Type-check (mdx-service) | `test` |
| Unit tests (academy) | `test` |
| Unit tests (mdx-service) | `test` |
| Build | `build` |
| E2E (Playwright) | `e2e` |
| Dependency audit (OSV) | `audit` |

Mark each ✅ passed or ❌ failed based on the CI run conclusion. If CI hasn't run yet, mark each as ⏳ pending.

---

### 5. Show draft to user before writing

Present the full draft including the changelog entry AND the test suite table. Ask:
> "Ready to write this to CHANGELOG.md and commit? (yes/no)"

**Wait for confirmation.**

---

### 6. Prepend to `CHANGELOG.md`

```markdown
## [<version>] — YYYY-MM-DD

### Features
- ...

### Bug Fixes
- ...

### Maintenance
- ...

## Test Suite

| Suite | Status |
|---|---|
| Prettier | ✅ passed |
| ESLint | ✅ passed |
| Type-check (academy) | ✅ passed |
| Type-check (mdx-service) | ✅ passed |
| Unit tests (academy) | ✅ passed |
| Unit tests (mdx-service) | ✅ passed |
| Build | ✅ passed |
| E2E (Playwright) | ✅ passed |
| Dependency audit (OSV) | ✅ passed |

CI: <ci_run_url>
```

---

### 7. Commit

```bash
git add CHANGELOG.md
git commit -m "chore(release): update changelog for v<version> #<issue>"
```

---

## Constraints
- Do NOT overwrite existing changelog entries — always prepend.
- Do NOT skip user confirmation before writing.
- Do NOT push — that is handled by `release-open-pr`.

## Output
- `CHANGELOG.md` updated and committed on the release branch.

## Verification
- [ ] `CHANGELOG.md` starts with the new version entry
- [ ] Test suite table is present with CI statuses filled in
- [ ] `git log --oneline -1` shows the changelog commit

---

## Manual Use

If you need to generate or update a changelog entry outside the release flow (e.g. to backfill a past release or draft notes mid-feature):

```bash
# 1. Find the tag range you want
git tag --sort=-creatordate | head -10

# 2. Get all commits between two tags
git log v3.1.0..v4.0.0 --oneline --no-merges

# 3. Filter by type
git log v3.1.0..v4.0.0 --oneline --no-merges | grep "^[a-f0-9]* feat"
git log v3.1.0..v4.0.0 --oneline --no-merges | grep "^[a-f0-9]* fix"

# 4. For a full pretty log with body (useful for writing descriptions)
git log v3.1.0..v4.0.0--no-merges --format="%h %s%n%b"
```

To retroactively update a GitHub release with better notes:

```bash
gh release edit v<version> --notes "$(cat <<'EOF'
## [<version>] — YYYY-MM-DD

### Features
- ...

## Test Suite
| Suite | Status |
|---|---|
| ... | ✅ passed |

CI: <url>
EOF
)"
```
