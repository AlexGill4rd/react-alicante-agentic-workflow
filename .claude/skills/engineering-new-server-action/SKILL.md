---
name: engineering-new-server-action
description: Scaffold a new Next.js Server Action in src/app/actions/ with Zod validation, typed response helpers, Sentry error capture, and a co-located test.

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
- Grep `src/app/actions/` to confirm an action with this name does not already exist.
- Confirm which Supabase table or external service (Resend, Stripe, etc.) the action touches — needed for the Zod schema.

## Workflow

### 1. Create `src/app/actions/$ARGUMENTS.ts`

Follow the pattern of `src/app/actions/waitlist.ts` — it is the source of truth; re-read it if this template looks out of date.

Choose the Supabase client by privilege before writing the action:

| Need | Client |
| --- | --- |
| Logged-in user mutation that should respect RLS | `createSupabaseAuthServerClient` from `@/lib/server/supabaseAuth` |
| Public/anonymous mutation allowed by RLS | `createSupabaseClient` from `@/lib/server/supabaseClient` |
| Admin mutation that must bypass RLS | `createSupabaseServerClient` from `@/lib/server/supabaseServer` |

Use the service-role client only when the feature explicitly needs admin
privileges; it bypasses RLS.

```ts
"use server";

import { createSupabaseClient } from "@/lib/server/supabaseClient"; // choose auth/anon/admin intentionally
import { checkPublicActionRateLimit } from "@/lib/server/publicActionRateLimit"; // public mutations only
import { RATE_LIMITS } from "@/config/rateLimits";
import { ErrorCodes } from "@/constants/errors";
import { actionError, actionSuccess, type ActionResult } from "@/utils/helpers";
import { captureSentryError } from "@/utils/monitoring";
import { logger } from "@/utils/logger";
import { z } from "zod";

const schema = z.object({
  // fields here
});

type Input = z.infer<typeof schema>;

export async function $ARGUMENTS(data: Input): Promise<ActionResult> {
  try {
    const validated = schema.parse(data);

    const limit = await checkPublicActionRateLimit({
      key: "$ARGUMENTS",
      policy: RATE_LIMITS.publicFormMutation,
    });
    if (!limit.allowed) {
      return actionError("Too many requests. Please try again later.", ErrorCodes.RATE_LIMITED);
    }

    // Business logic — keep it thin; complex logic goes in src/lib/server/
    const supabase = createSupabaseClient();
    const { error } = await supabase.from("table").insert({ /* validated fields */ });

    if (error) {
      if (error.code === "23505") {
        return actionError("<user-friendly duplicate message>", ErrorCodes.EMAIL_ALREADY_EXISTS);
      }
      logger.error({ err: error }, "[$ARGUMENTS] Insert failed:");
      return actionError("Something went wrong. Please try again.", ErrorCodes.INTERNAL_SERVER_ERROR);
    }

    return actionSuccess("<success message>");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return actionError(error.errors[0].message, ErrorCodes.VALIDATION_ERROR);
    }
    logger.error({ err: error }, "[$ARGUMENTS] Unexpected error:");
    captureSentryError(error);
    return actionError("An unexpected error occurred. Please try again.", ErrorCodes.INTERNAL_SERVER_ERROR);
  }
}
```

Rules:
- `"use server"` at the top; named export only.
- Zod schema at module level — validate before any logic runs. Catch `z.ZodError` separately with `ErrorCodes.VALIDATION_ERROR`.
- Return `actionSuccess` / `actionError` (`ActionResult`) — never raw objects. (`createSuccessResponse` / `createErrorResponse` / `apiErrorResponse` are for API routes, not actions.)
- Public (unauthenticated) mutations: `checkPublicActionRateLimit` with a policy from `RATE_LIMITS`.
- Error codes from `ErrorCodes` in `@/constants/errors` — no string literals.
- `logger.error({ err }, "message")` (pino style); `captureSentryError` for unexpected errors only, not validation errors.
- Duplicate key (`error.code === "23505"`) → user-friendly `actionError`.
- Rejected input is logged, not silently dropped (see `.claude/rules/backend-security.md`).

### 2. Create `src/app/actions/$ARGUMENTS.test.ts`

Follow `src/app/actions/waitlist.test.ts`:

```ts
/**
 * @jest-environment node
 */
import { $ARGUMENTS } from "./$ARGUMENTS";
import { createSupabaseMock } from "@/tests/mocks/supabase";

const { mockFrom, mockInsert } = createSupabaseMock();
const mockCheckPublicActionRateLimit = jest.fn();

jest.mock("@/lib/server/supabaseClient", () => ({
  createSupabaseClient: () => ({ from: mockFrom }),
}));
jest.mock("@/lib/server/publicActionRateLimit", () => ({
  checkPublicActionRateLimit: (...args: unknown[]) => mockCheckPublicActionRateLimit(...args),
}));
jest.mock("@/utils/monitoring", () => ({ captureSentryError: jest.fn() }));

describe("$ARGUMENTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckPublicActionRateLimit.mockResolvedValue({ allowed: true });
  });

  it("returns success for valid input", async () => { /* mockInsert resolves { error: null } */ });
  it("returns a validation error for invalid input", async () => { /* expect ErrorCodes.VALIDATION_ERROR */ });
  it("returns rate limited when the limit is hit", async () => { /* allowed: false */ });
  it("handles a duplicate entry", async () => { /* error.code "23505" */ });
  it("handles unexpected errors", async () => { /* mockInsert rejects */ });
});
```

## Constraints
- No `"use client"` — server-only file.
- No raw `return { error: "..." }` — always `actionSuccess` / `actionError`.
- No business logic that belongs in `src/lib/server/` — actions are thin orchestration layers.
- No SELECT-only queries — reads belong in Server Components or `lib/server/`; actions are mutations.
- No default service-role usage — use `createSupabaseServerClient` only for explicit admin/RLS-bypass work.
- No hardcoded user-facing strings in components — messages returned from actions are shown as-is, keep them short and user-friendly.

## Output
- `src/app/actions/$ARGUMENTS.ts` — typed server action with Zod validation and response helpers.
- `src/app/actions/$ARGUMENTS.test.ts` — test covering happy path, validation error, and unexpected error.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm test -- --testPathPattern=$ARGUMENTS` — all tests pass.
- [ ] `pnpm lint` — no unused imports or variables.
