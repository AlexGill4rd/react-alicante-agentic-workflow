---
name: engineering-new-test
description: Create a lean co-located test file for an existing component or module, focused on meaningful behavior without unnecessary snapshots or duplicate assertions.

metadata:
  domain: engineering
  trigger: both
  after: [engineering-new-component, engineering-new-hook]

argument-hint: "[filepath]"
---

# Skill: New Test

## When to use
- After creating a new component or hook with no co-located test file.
- When manually adding tests to untested code.
- **A `page.tsx` that branches** — redirects, multiple rendered states depending on data/auth/status, or any conditional beyond a single straight-through render. Untested orchestration logic at the page level fails silently: a #420 review found a page rendering the wrong UI state (success shown for a failed payment) with zero test coverage catching it, because only its sub-components had tests, never the page's own branching. A thin `page.tsx` that just does `<Foo {...props} />` with no branching doesn't need its own test — the behavior lives in `Foo`.

## Inputs
- `$ARGUMENTS` (optional): path to the source file to test.
- If omitted: auto-detect from `git status` — `.tsx`/`.ts` files under `src/` with no co-located `.test.tsx` or `.test.ts`. Fallback: scan `src/components/` and `src/app/[locale]/**/_components/`, prioritised primitives → ui → molecules → organisms. **Also check any touched `page.tsx` for branching logic** (see above) — it's easy to miss since it's outside `_components/`.

## Prerequisites
- Confirm the source file exists at the given path.
- Verify no `.test.tsx` or `.test.ts` already exists alongside the source.
- Confirm `@testing-library/react` and `jest` are in `package.json`.
- Import test utilities from `@/tests/utils/render` (wraps `ChakraProvider`); a direct `@testing-library/react` import crashes on any Chakra v3 component.

## Workflow
1. **Determine scope:** If `$ARGUMENTS` provided, use that file. Otherwise run `git status --short | awk '{print $2}'`, filter to `.tsx`/`.ts` files under `src/` with no co-located test file.
2. **Read the source file** to understand its props, logic, and rendered output.
3. **Create the test file** at the same directory as the source:
   - Mock `next-intl`: `jest.mock("next-intl", () => ({ useTranslations: jest.fn() }))`
   - Mock IntersectionObserver if needed: import from `@/tests/mocks/intersectionObserver`
   - Set up `beforeEach`: `(useTranslations as jest.Mock).mockReturnValue((key: string) => key)`
4. **Write semantic rendering tests:** assert key user-visible elements, accessible names, labels, and critical conditional UI.
5. **Write behavioral tests:** simulate user interactions where the component owns behavior.
   - Default to `userEvent`, the Testing Library recommendation: it fires the
     full sequence a real user triggers (pointer, focus, keyboard), so it
     catches bugs a bare `click` walks past — a disabled button, an overlay
     swallowing the click, focus never landing. It's async, so `await` every call.
   - Use `fireEvent` only for events `userEvent` doesn't model, such as
     `scroll`, `resize`, or a synthetic `change` on a hidden input.
6. **Write edge case tests:** empty data, missing optional props, error states, loading states.
7. **Use snapshots sparingly:** add a snapshot only when it protects stable, intentionally reviewed output better than semantic assertions.
8. **Run tests** to confirm they pass.

## Constraints
- No snapshot-only tests — `toMatchSnapshot()` alone is insufficient.
- No default snapshots — prefer semantic assertions unless the snapshot has clear review value.
- No duplicate tests — each test must protect a distinct behavior or state.
- No testing framework/native behavior — avoid tests that only prove an input accepts typing, React renders children, or Chakra applies its own default behavior.
- No implementation detail testing — test rendered output and interactions, not internal state.
- No unnecessary mocks — only mock what is genuinely external (`next-intl`, `next/navigation`, `IntersectionObserver`).
- No skipped tests — do not use `xit`, `xdescribe`, or `test.skip` without an explicit reason.
- No hardcoded translated strings in assertions — use the key as the value since the mock returns the key.

## Output
- `<filename>.test.tsx` (or `.test.ts`) co-located alongside the source file.
- Snapshot file generated only if a snapshot is intentionally added.

## Verification
- [ ] `pnpm test -- --testPathPattern=<test-file>` — all tests pass, no failures or skips.
- [ ] Each test covers a distinct behavior or state.
- [ ] Any snapshot has a clear reason and is not duplicating semantic assertions.
