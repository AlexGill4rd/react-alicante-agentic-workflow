---
name: engineering-code-review
description: Review the current branch diff — user-facing state coverage, architecture, performance, and convention compliance. Posts findings to the PR and waits for fixes before re-reviewing.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "[PR number or file path — omit to review current branch diff]"
---

# Skill: Code Review

## When to use
- Before merging a feature branch PR — review all changed files.
- After scaffolding new components, hooks, or server actions.

## Scope vs `/code-review` (ultra)

This skill is complementary to the built-in `/code-review ultra` multi-agent
review, not a replacement. Ultra's predefined angles already cover:
correctness (line-by-line, cross-file, language pitfalls), duplication,
simplification/efficiency, altitude, wrapper/proxy correctness, and
CLAUDE.md conventions. Don't re-derive those here.

This skill's job is what ultra's angles don't specifically target: React/
Next-specific architecture and performance patterns, accessibility,
side-effect/partial-failure integrity, and user-facing state coverage
(below) — the kind of check that requires knowing this component's or
action's *role* in the app and its full domain, not just reading the diff.
If a finding would fit equally well as an ultra angle (a plain correctness
bug, a duplicate block), let ultra catch it — focus here on what's specific
to this codebase's architecture and domain instead.

## Inputs
- `$ARGUMENTS` (optional): PR number or specific file path. If omitted, reviews the current branch diff.

## Prerequisites
- Clean or staged working tree — uncommitted changes may not appear in the PR diff.
- PR must exist: `gh pr list --head $(git branch --show-current)`. If no PR → review files directly from the diff.

---

## Workflow

### 1. Identify Scope

If `$ARGUMENTS` is a PR number:
```bash
gh pr diff <number>
```

If `$ARGUMENTS` is a file path — read that file directly.

If omitted:
```bash
git diff origin/dev...HEAD --name-only
```
Read each changed file.

---

### 2. User-Facing State Coverage

Before reviewing individual files, enumerate the real state space this diff touches — not the file list, the *data*: every enum value, status field, or boolean the diff reads or writes (grep the type definition, don't infer from the diff's own test fixtures — a diff that only exercises 2 of an enum's 8 values will make the other 6 invisible if you look at the diff alone).

For each state:
- Is there a distinct, correct UI representation — or does it silently fall through to the same UI as an unrelated state?
- Is there a test asserting *that specific state*, not just that a sub-component renders with some props passed to it?
- Does a `page.tsx` (or any orchestration layer) that branches on this data have its own test covering the branch — sub-component tests don't cover a page's own branching logic. See `engineering-new-test`'s "page.tsx that branches" criterion (added after #420: a page rendered the wrong UI state for a failed payment, uncaught because only its sub-components had tests, never the page's own status-branching).

Flag states that exist in the data model but have zero UI or test coverage. This is the one category of finding that requires knowing the *domain* (what every value of `SubscriptionStatus` actually means to a user), not just reading the diff — ultra won't catch it, and neither will a per-file pass through Convention Compliance below.

Report findings or "None".

---

### 3. Convention Compliance

Run `/engineering-review-component` on each changed `.ts`/`.tsx` file under `src/` (components, hooks, utilities). Do NOT reimplement its checklist — summarise its Pass/Fail output in the report.

---

### 4. Architecture & Design

Evaluate — report findings or "None":

- Is business logic extracted to `hooks/` or `lib/`?
- Are data fetching and presentation properly separated?
- Could any logic be shared or already exists elsewhere?
- Are error boundaries and loading states handled?
- Is the component in the right role folder (primitives/ui/brand/forms/molecules/organisms)?

---

### 5. Side-Effect & Partial-Failure Integrity

For any multi-step server-side operation (a Server Action or route handler
making 2+ external calls — DB writes, third-party API calls like Stripe):

- If a later step fails, does an earlier step's side effect survive
  permanently (a created record, an external API object) with nothing
  tracking that it happened?
- Are side-effecting/irreversible steps (creating a real resource) ordered
  after the checks that could still reject the whole operation, where that
  ordering is possible at no extra cost?
- If an earlier ordering isn't possible or would cost real latency, is the
  orphaned-resource case at least logged/reported so it can be found later?

Report findings or "None". This is one of the two categories ultra's angles
don't check (the other is User-Facing State Coverage, above) — see
"Scope vs `/code-review`" above.

---

### 6. Performance

Evaluate — report findings or "None":

- Unnecessary re-renders from missing `React.memo`, `useMemo`, or `useCallback`?
- `'use client'` components that could be Server Components? Not if they render Chakra UI — Chakra's styling engine can't run in a pure Server Component (build-time crash, invisible to type-check/Jest), so a Chakra component needs `'use client'` even with no hooks/handlers of its own.
- Client boundary too high — can it be pushed to a leaf?
- Large imports missing tree-shaking or `next/dynamic`?
- Images not using `next/image`, or missing `width`/`height`/`sizes`/`priority`?
- Sequential data fetches that could be parallelised?
- Chakra `sx` prop creating dynamic styles on every render?

---

### 7. Post to PR

Accessibility isn't checked here — `accessibility-auditor` already runs in the same Phase 6, with a dedicated WCAG 2.1 AA checklist. Don't duplicate it.

Detect PR number if not provided:
```bash
gh pr list --head $(git branch --show-current) --json number -q '.[0].number'
```

Post findings:
```bash
gh pr review <number> --comment --body "<report>"
```

If no PR exists — print the report to the terminal instead.

---

### ⏸️ BREAKPOINT — Wait for fixes

After posting, say:
> "Review posted. Apply the fixes and come back — say 'ready for re-review' when done, or 'skip re-review' to close out."

**Wait. Do not proceed until the user responds.**

---

### 8. Re-review (if requested)

If **'ready for re-review'** → re-read the changed files, post a follow-up comment marking each original finding ✅ resolved or ❌ still open.

If **'skip re-review'** → done.

---

## Constraints

- Do NOT reimplement the convention checklist — delegate to `/engineering-review-component`.
- Do NOT modify files — report findings only.
- Do NOT override `/engineering-review-component` findings — include them as-is.
- Always post to the PR when one exists — never terminal-only.
- Always wait for 'ready for re-review' or 'skip re-review' before closing out.

## Output Format

```
## Code Review: [Component / Feature]

### User-Facing State Coverage
- [Findings or "None"]

### Convention Compliance
[/engineering-review-component output — Pass/Fail per item]

### Architecture
- [Findings or "None"]

### Side-Effect & Partial-Failure Integrity
- [Findings or "None"]

### Performance
- [Findings or "None"]

### Recommendations
1. [Priority-ordered]

### Verdict: APPROVE | REQUEST CHANGES | NEEDS DISCUSSION
```

## Verification

- [ ] Findings posted to PR as a comment
- [ ] Re-review comment posted with ✅ / ❌ per finding (if re-review requested)
