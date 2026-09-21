---
name: engineering-new-hook
description: Scaffold a new custom React hook following project conventions.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "<hookName>"
---

# Skill: New Hook

## When to use
- When creating reusable stateful or side-effect logic to be shared across components.

## Inputs
- `$ARGUMENTS` (required): hook name, must start with `use` (e.g., `useModal`, `useScrollPosition`).
- If omitted: ask what the hook should do, then suggest a name based on the description.

## Prerequisites
- Confirm `$ARGUMENTS` starts with `use` — if not, prefix it and confirm with the user.
- Grep `hooks/` to confirm a hook with this name does not already exist.
- Read `.claude/rules/layers.md` first — a hook holds logic and state and calls services; only services make API calls
- Confirm the logic is reusable state/effect logic — if it is a one-time utility function, it belongs in `utils/`, not `hooks/`.

## Workflow
1. **Create `hooks/$ARGUMENTS.ts`** (use `.tsx` only if the hook returns JSX):
   - Named export only — no default export.
   - Define typed parameters and return type explicitly — no `any`.
   - Follow the pattern of existing hooks in `hooks/`.
   - Internal order: state declarations → effects → handlers → return.
2. **Create `hooks/$ARGUMENTS.test.ts`** alongside:
   - Use `renderHook` from `@testing-library/react`.
   - Test return values, state changes, and cleanup.
   - Mock any external dependencies.

## Constraints
- No default export — hooks use named exports, unlike components.
- No `'use client'` on the hook file — the directive belongs in the component that imports the hook.
- No business logic that belongs in `lib/` — hooks manage state and side effects; domain logic belongs in `utils/` or `utils/`.
- No direct `fetch`, Supabase or SDK calls in a hook — call a service instead.
- No view reactions in a hook (navigation, dialogs, banners) — return state and actions, and let the component decide.
- No `any` types — define typed parameters and return types explicitly.

## Output
- `hooks/$ARGUMENTS.ts` — typed hook with named export.
- `hooks/$ARGUMENTS.test.ts` — test file with `renderHook` tests.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm test -- --testPathPattern=$ARGUMENTS` — all tests pass.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
