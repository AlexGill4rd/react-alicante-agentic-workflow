---
name: product-create-pr-description
description: Generate a structured pull request description from the current branch diff against main.

metadata:
  domain: product
  trigger: both
  after: []
---

# Skill: Create PR Description

## When to use
- Before opening a pull request.

## Inputs
- No arguments — scope is always the current branch vs `dev`.

## Prerequisites
- Run `git branch --show-current` — if it returns `main` or `dev`, stop and ask the user to switch to a feature branch.
- Run `git log dev...HEAD --oneline` — confirm at least one commit exists ahead of dev.
- Run `git status --short` — if there are uncommitted changes, ask the user whether to include them in the description.
- Run `gh pr list --head <branch> --json number,url` — if a PR already exists for this branch, this run **updates** it (step 7b) instead of creating a new one.

## Workflow
1. **Gather branch context:**
   ```bash
   git log dev...HEAD --oneline
   git diff dev...HEAD --stat
   ```
2. **Read the changed files** to understand what was built — not just file names, but the actual content changes.
3. **Determine every ticket number this PR closes.** The branch name follows `feat/<issue>-<description>` (or `fix/`, `chore/`, etc.) — extract `<issue>` from it as the primary ticket. Then scan the commit messages (`git log dev...HEAD --oneline`) for every trailing `#<issue>` reference — a branch commonly closes more than one ticket (e.g. an implementation ticket plus a design/spec ticket it absorbed). Collect the full set, deduplicated. If nothing can be parsed, ask the user.
4. **Look up each ticket's milestone and project** so the PR inherits them rather than guessing at "current":
   ```bash
   gh issue view <issue> --json milestone,projectItems \
     -q '{milestone: .milestone.title, projects: [.projectItems[].title]}'
   ```
   Run this once per ticket from step 3. When multiple tickets share the same milestone/project (the common case for related work), use that shared value. If they genuinely disagree, use the primary ticket's (the one the branch name is derived from) and note the mismatch to the user rather than silently picking one. If a ticket has no milestone or no project, skip the corresponding flag rather than inventing one.
5. **Synthesise a PR description** with this structure — every `Closes #<issue>` from step 3 must be the **first lines** of the body, one per line, before `## Summary`, so they're immediately visible and not buried where reviewers will miss them:
   ```markdown
   Closes #<issue>
   Closes #<issue>

   ## Summary
   [1–3 bullets — what changed and why, from a product/user perspective]

   ## Changes
   [Bullets grouped by area: components, translations, styles, tests, config]

   ## Test plan
   - [ ] [Key scenario to verify manually]
   - [ ] [Edge case to check]
   - [ ] All tests pass (`pnpm test`)
   - [ ] No TypeScript errors (`pnpm type-check`)
   - [ ] No lint errors (`pnpm lint`)

   ## Notes
   [Optional: trade-offs made, follow-up tickets, known limitations]
   ```
6. **If the diff touches UI** (components, pages, hooks driving UI state), the Test plan must do more than the two generic placeholder lines above — expand it into one checkbox per distinct user-facing scenario the diff actually builds, not just "click through the happy path." Derive these directly from the changed code, not from imagination:
   - The primary happy path (the main flow a user takes)
   - Every distinct loading/empty/error/disabled UI state introduced or touched (check components for conditional renders keyed off status/error variants)
   - Every guard/redirect the diff adds (auth gates, already-X checks, rate limits) — state exactly how to trigger it (e.g. "insert a row via the SQL editor", "unset an env var"), not just "test the guard"
   - Any state that depends on external data (a live API price, a webhook not yet built, a page from another ticket) — call these out explicitly as known-not-testable-yet rather than silently omitting them
   Also add a Screenshots section:
   ```markdown
   ## Screenshots
   | Before | After |
   |--------|-------|
   | | |
   ```
7. **Create or update the PR** depending on the prerequisite check:
   - **7a. No existing PR** — open one with `gh pr create`, the synthesised description, and the milestone/project from step 4 in one call. Use the first line of the Summary as the PR title (under 70 characters). Pass the body via HEREDOC to preserve formatting:
     ```bash
     gh pr create --title "<title>" --base dev \
       --milestone "<milestone title from step 4>" \
       --project "<project title from step 4>" \
       --body "$(cat <<'EOF'
     <description>
     EOF
     )"
     ```
     Repeat `--project` once per distinct project across all tickets from step 4. If `gh pr create` fails on the project flag with an auth-scope error, note that it needs `gh auth refresh -s project`, create the PR without `--project`, then retry via `gh pr edit <number> --add-project "<title>"` once scope is granted.
   - **7b. PR already exists** — refresh its body and re-sync milestone/project rather than leaving them stale from whenever it was first opened:
     ```bash
     gh pr edit <number> --body "$(cat <<'EOF'
     <description>
     EOF
     )"
     gh pr edit <number> --milestone "<milestone title from step 4>"
     gh pr edit <number> --add-project "<project title from step 4>"
     ```
     Only re-run the milestone/project edits if `gh pr view <number> --json milestone,projectItems` shows they're missing or don't already match step 4's values — don't no-op edit every time.
8. **Verify the Development link and milestone/project landed** (each `Closes #<issue>` line auto-links its issue — this just confirms it took):
   ```bash
   gh pr view <number> --json closingIssuesReferences,milestone,projectItems \
     -q '{closes: [.closingIssuesReferences[].number], milestone: .milestone.title, projects: [.projectItems[].title]}'
   ```
   Confirm `closes` contains every ticket number from step 3, not just the primary one.
9. **If step 7b ran** (an existing PR, not a new one), confirm the replacement actually took — don't assume the `--body` write succeeded just because the command didn't error:
   ```bash
   gh pr view <number> --json body -q .body | grep -c "## Feature-builder phase status"
   ```
   Must return `0`. This skill's own job is to be the thing that removes that header — run standalone, with no `feature-builder` session reminding it to happen, this is the only check confirming it did. A nonzero count means the body write didn't take as expected; stop and investigate rather than proceeding.
10. **Return the PR URL** so the user can open it immediately.

## Constraints
- Do NOT copy commit messages verbatim — synthesise them into user-facing language.
- Do NOT include debugging comments, TODOs, or `console.log` references in the description.
- Always target `dev` as the base branch — NEVER `main`.
- If the diff touches UI, the Test plan must have one checkbox per distinct user-facing scenario (happy path + each state/guard/edge case actually built) — never just the two generic placeholder lines.
- Always push the branch before running `gh pr create` if no remote tracking branch exists.
- Always put every `Closes #<issue>` as the first lines of the body, not appended at the end, and never drop a ticket found in step 3 even if it wasn't the one the branch was named after.
- Always set `--milestone`/`--project` to match the linked issue's own milestone/project — never a hardcoded or guessed "current" one.
- If a PR already exists for the branch, always update it (7b) — never create a duplicate.

## Output
- PR URL returned after creation or update.

## Verification
- [ ] Base branch is confirmed correct before generating.
- [ ] All changed files are reflected in the Changes section.
- [ ] Summary is written from a product/user perspective.
- [ ] Test plan includes both manual and automated checks.
- [ ] If the diff touches UI, Test plan has one checkbox per distinct user-facing scenario built, not just a generic placeholder.
- [ ] Every ticket found in step 3 has its own `Closes #<issue>` line, first in the body.
- [ ] PR's milestone and project match the linked issue(s)' milestone and project (or are omitted if none has either).
- [ ] An existing PR was updated in place rather than duplicated, if one was already open.
- [ ] PR was successfully created or updated and URL returned.
