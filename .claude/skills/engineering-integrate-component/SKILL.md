---
name: engineering-integrate-component
description: Wire a presentational component to existing backend logic (Server Action, API route, or utility) via a handler hook and container component.

metadata:
  domain: engineering
  trigger: both
  after: [engineering-create-backend, engineering-refactor-backend, engineering-refactorer, engineering-new-component]

argument-hint: "<ComponentName>"
---

# Skill: Integrate Component

## When to use
- After a presentational component AND backend logic both exist — wire them together
- Presentational component created via `/engineering-new-component` — UI only, no business logic
- Backend created via `/engineering-create-backend` — Server Action, API route, middleware, or utility
- This skill creates the wiring layer (handler hook + container) — never modifies the presentational component's JSX

## Inputs
- `$1` (required): PascalCase name of the existing presentational component to wire up (e.g. `SignInForm`, `ContactForm`).
- If omitted: ask which component needs backend/state wiring.

## Prerequisites
- Confirm `$1` component exists and is presentational — read it; if it already calls `fetch` or owns submission state directly, stop and flag it to be split first.
- Confirm backend logic exists — Server Action at `app/actions/<actionName>.ts`, API route at `app/api/<route>/route.ts`, or utility at `services/<name>.ts`
- Grep `hooks/` for an existing handler hook (e.g. `use<Feature>Handler`) — reuse it if found instead of creating a new one
- Understand what backend the component needs to call — the action name, the API endpoint, or the utility function

## Workflow

### 1. Identify the backend
- Confirm the backend (Server Action, API route, utility, etc.) already exists
- Get its path: `app/actions/<name>`, `app/api/<route>`, `services/<name>`, etc.

### 2. Create Handler Hook (if needed)

Check if a handler hook already exists (e.g., `useContactFormHandler.ts`).

If not, create one at `hooks/use<Feature>Handler.ts` following the pattern in `useContactFormHandler.ts`:
- Named export, typed params and return — no `any`
- Owns state: `isLoading`, `error`, `success` (or equivalent)
- Exposes a single `handleSubmit` / `handleAction` callback that:
  - Calls the Server Action (or makes API call)
  - Maps error codes to translated messages
  - Logs unexpected failures — a swallowed error is a silent bug
  - Invokes `onSuccess` / `onError` callbacks passed via options
- One hook, one concern — if component needs unrelated state (sidebar toggle), that's a separate hook

### 3. Create Container Component

Create or update a route-specific container (e.g., `<Feature>Area.tsx` in `_components/`, following `ContactFormArea.tsx`):
- `'use client'` directive (owns state)
- Calls the handler hook
- Renders the presentational component, passing:
  - `onSubmit` / `onAction` from hook
  - `isLoading` from hook
  - `error` / `success` messages from hook
- Owns any UI-only state (e.g., transient success banner) — NOT in the presentational component
- NO business logic or fetch calls — only state plumbing
- **Tokens** — any color the container renders directly (loading/error/success copy, a title) must be a CSS variable from `app/globals.css`, present in both the dark block and the `[data-theme="light"]` override. Never a hardcoded hex/rgba or a stock Chakra scale (`red.500`, `green.300`) — map to the nearest semantic token.
- **Typography** — any text the container renders directly (a heading, a success/error message) uses the classes that role already uses elsewhere, not a new inline size.
- **Icons** — any icon the container renders directly (a spinner, a success checkmark, an inline error icon) renders at the app's standard size, not a per-component one.

### 5. Tests
- Hook: `hooks/use<Feature>Handler.test.ts` using `renderHook` — covers success, validation error, and unexpected error paths.
- Action: `app/actions/<actionName>.test.ts` — covers happy path, validation error (400), and unexpected error (500), mocking Supabase/external clients.
- Container: extend or add `<Feature>Area.test.tsx` asserting the hook's `handleSubmit` is called on form submit and that loading/error props reach the presentational component (mock the hook).

## Constraints
- **Backend must exist first** — don't create backend code in this skill; use `/engineering-create-backend` first
- Never edit the presentational component's JSX/markup — only its prop usage at the call site changes
- Never duplicate an existing hook — search `hooks/` first; reuse if it covers the domain
- Never call Supabase, Resend, or external SDKs directly from container or hook — they should only be called from the backend (action, route, or utility)
- Never put the service-role Supabase key or other secrets in a Client Component or hook
- Never add business logic to the container — it's only state plumbing
- Container is `'use client'`, presentational component may be sync or async (if async, container handles that)

## Output
- `app/actions/<actionName>.ts` (+ test) — if a new Server Action was needed.
- `hooks/use<Feature>Handler.ts` (+ test) — if a new hook was needed.
- Updated or new container component wiring `$1` to real state — no changes to `$1` itself.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm test -- --testPathPattern="<actionName>|use<Feature>Handler|<Feature>Area"` — all pass.
- [ ] `$1`'s own file is unchanged (or only its prop *types* changed, not its rendering logic).
- [ ] Server Action validates with Zod and never trusts client input.
- [ ] Any color, icon, or text the container renders directly uses a verified token and the app's existing sizes — no hardcoded values, no stock Chakra color scales.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
