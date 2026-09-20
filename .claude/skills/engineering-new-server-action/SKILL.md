---
name: engineering-new-server-action
description: Scaffold a new Next.js Server Action in app/actions/ with Zod validation, typed response helpers and a co-located test.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "<actionName>"
---

# Skill: New Server Action

## When to use
- When adding a server-side mutation (form submission, database write, email send, etc.) called from a Client Component or a `<form action={...}>`.

## Inputs
- `$ARGUMENTS` (required): action name in camelCase (e.g., `submitContactForm`, `enrollInCourse`).
- If omitted: ask what the action does, then suggest a name.

## Prerequisites
- Confirm `$ARGUMENTS` is camelCase and describes the mutation (not a query — reads belong in Server Components or `lib/server/`).
- Grep `app/actions/` to confirm an action with this name does not already exist.
- Confirm which Supabase table or external service (Resend, Stripe, etc.) the action touches — needed for the Zod schema.

## Workflow

### 1. Create `app/actions/$ARGUMENTS.ts`

Follow the pattern of the existing actions in `app/actions/`, if there are any — they are the source of truth; re-read one if this template looks out of date.

This app has one Supabase client, `createSupabaseClient` from
`@/services/supabase`, built with the publishable key — so every action runs
under RLS. If a feature ever needs to bypass RLS, that is a second client with
a service-role key, added deliberately and never imported into client code.

```ts
"use server";

import { createSupabaseClient } from "@/services/supabase";
import { actionError, actionSuccess, type ActionResult } from "@/utils/action-result";
import { z } from "zod";

const schema = z.object({
  // fields here
});

type Input = z.infer<typeof schema>;

export async function $ARGUMENTS(data: Input): Promise<ActionResult> {
  try {
    const validated = schema.parse(data);

    // A public mutation with nothing in front of it can be called in a loop.
    // If the project has a rate limiter, call it here. If it doesn't, say so
    // at the breakpoint instead of shipping an unprotected endpoint quietly.

    // Business logic — keep it thin; complex logic goes in services/
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("table").insert({ /* validated fields */ });

    if (error) {
      if (error.code === "23505") {
        return actionError("<user-friendly duplicate message>");
      }
      console.error("[$ARGUMENTS] insert failed:", error);
      return actionError("Something went wrong. Please try again.");
    }

    return actionSuccess("<success message>");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return actionError(error.errors[0].message);
    }
    console.error("[$ARGUMENTS] unexpected error:", error);
    return actionError("An unexpected error occurred. Please try again.");
  }
}
```

Rules:
- `"use server"` at the top; named export only.
- Zod schema at module level — validate before any logic runs, and catch `z.ZodError` separately from unexpected errors.
- Return `actionSuccess` / `actionError` (`ActionResult`) — never raw objects. API routes have their own response helpers; don't mix them.
- Public (unauthenticated) mutations: rate limit them, or say at the breakpoint that the project has no limiter.
- log unexpected errors, not validation errors — a rejected input is an expected outcome.
- Duplicate key (`error.code === "23505"`) → user-friendly `actionError`.
- Rejected input is logged, not silently dropped (see `.claude/rules/backend-security.md`).

### 2. Create `app/actions/$ARGUMENTS.test.ts`

Shape of the test:

```ts
/**
 * @vitest-environment node
 */
import { $ARGUMENTS } from "./$ARGUMENTS";
import { createSupabaseMock } from "@/tests/mocks/supabase";

const { mockFrom, mockInsert } = createSupabaseMock();

vi.mock("@/services/supabase", () => ({
  createSupabaseClient: () => ({ from: mockFrom }),
}));

describe("$ARGUMENTS", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckPublicActionRateLimit.mockResolvedValue({ allowed: true });
  });

  it("returns success for valid input", async () => { /* mockInsert resolves { error: null } */ });
  it("returns a validation error for invalid input", async () => { /* schema rejects */ });
  it("handles a duplicate entry", async () => { /* error.code "23505" */ });
  it("handles unexpected errors", async () => { /* mockInsert rejects */ });
});
```

## Constraints
- No `"use client"` — server-only file.
- No raw `return { error: "..." }` — always `actionSuccess` / `actionError`.
- No business logic that belongs in `services/` — actions are thin orchestration layers.
- No SELECT-only queries — reads belong in Server Components or `services/`; actions are mutations.
- No service-role key in an action — this app's client uses the publishable key and stays under RLS.
- No hardcoded user-facing strings in components — messages returned from actions are shown as-is, keep them short and user-friendly.

## Output
- `app/actions/$ARGUMENTS.ts` — typed server action with Zod validation and response helpers.
- `app/actions/$ARGUMENTS.test.ts` — test covering happy path, validation error, and unexpected error.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm test -- --testPathPattern=$ARGUMENTS` — all tests pass.
- [ ] `pnpm lint` — no unused imports or variables.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
