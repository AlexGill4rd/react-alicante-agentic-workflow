---
name: audit-test-coverage
description: Scan the codebase for untested or under-tested files and report coverage gaps by priority.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "[path]"
---

# Skill: Audit Test Coverage

## When to use
- When checking which components or modules are missing tests.
- When evaluating the quality of existing tests before a release.

## Inputs
- `$ARGUMENTS` (optional): path to directory to audit.
- If omitted: scan all of the following directories:
  - `src/components/primitives/`
  - `src/components/ui/`
  - `src/components/brand/`
  - `src/components/forms/`
  - `src/components/molecules/`
  - `src/components/organisms/`
  - `src/components/templates/`
  - `src/hooks/`
  - `src/utils/`
  - `src/app/[locale]/**/_components/`
  - `src/domains/`

## Prerequisites
- If `$ARGUMENTS` is provided, confirm the path exists before scanning.

## Workflow
1. **Determine scope:** If `$ARGUMENTS` provided, use that path. Otherwise use the default directory list above.
2. **Find untested files:** For each `.tsx`/`.ts` file in scope, check if a co-located `.test.tsx` or `.test.ts` exists. List all files with no test — prioritise primitives → ui → molecules → organisms → hooks → utils.
3. **Evaluate existing tests:** For each test file found, check:
   - Has a snapshot test (`asFragment() → toMatchSnapshot()`)
   - Has rendering tests (key elements asserted via `screen`)
   - Has behavioral tests (user interactions via `fireEvent` or `userEvent`)
   - Has edge case tests (empty data, missing props, error states)
   - Mocks are correct: `next-intl` via `jest.mock`, `IntersectionObserver` via `@/tests/mocks/intersectionObserver`
   - Uses `@testing-library/react` — no direct DOM manipulation
4. **Run coverage:** Run `pnpm test:coverage` to get statement/branch/function/line percentages.

## Constraints
- Do NOT generate or modify test files — report gaps only. Use `/engineering-new-test` to generate tests after the audit.
- Do NOT flag test files themselves as untested.
- Do NOT count snapshot-only tests as sufficiently tested.

## Output
- **Untested files** — file path, type (component/hook/util), priority (High/Med/Low).
- **Under-tested files** — file path, what is missing (snapshot/behavioral/edge cases).
- **Coverage summary** — Statements / Branches / Functions / Lines percentages.

## Verification
- [ ] All directories in scope have been scanned — none skipped.
- [ ] Every untested file is listed with a priority.
- [ ] Every under-tested file lists exactly what test type is missing.
- [ ] Coverage percentages are reported from `pnpm test:coverage`.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
