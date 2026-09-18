---
name: engineering-create-backend
description: Create backend logic (Server Action, API Route, middleware, or utility) with proper validation, error handling, and security patterns baked in.

metadata:
  domain: engineering
  trigger: manual
  priority: high

argument-hint: "<backend-type> <name>"
---

# Skill: Create Backend

## When to use

- Building a new feature — create backend BEFORE UI component
- Need a Server Action (form submission, mutation from Client Component)
- Need an API Route (webhook, external integration, custom HTTP response)
- Need middleware (auth checks, redirects, request preprocessing)
- Need a server utility (business logic, database queries, shared helpers)

## Inputs

- `$ARGUMENTS` (optional): `<type> <name>`
  - `server-action myAction` → create Server Action
  - `api-route webhook` → create API Route
  - `middleware auth` → create middleware
  - `utility calculatePrice` → create server utility
- If omitted: ask user what backend is needed

## Prerequisites

- **Feature plan exists** — understand what the backend should do
- **Constraints documented** — know the external dependencies (Supabase, Resend, webhooks, etc.)
- **Path decided** — where should this file live?

## Workflow

### 1. Determine Backend Type

Ask: **"Can an external system call this without JavaScript?"**

| Answer | Type | Pattern |
|---|---|---|
| YES — GitHub, Stripe, Resend webhook | **API Route** | `/app/api/<route>/route.ts` |
| YES — Email link that redirects | **Route Handler** | `/app/<route>/route.ts` or `/app/api/<route>/route.ts` depending on whether it is a user-facing auth redirect or an API endpoint |
| YES — Cron job or internal service | **API Route** | `/app/api/<route>/route.ts` |
| NO — Browser form/button only | **Server Action** | `src/app/actions/<name>.ts` |
| Cross-cutting concern (auth, headers) | **Middleware** | `/middleware.ts` |
| Pure business logic/queries | **Utility** | `/lib/server/<name>.ts` |

**If user provides type, skip this and proceed to that type's workflow.**

---

### Supabase Auth Redirects

When implementing Supabase passwordless Magic Link with PKCE:

- Use the official Magic Link PKCE pattern from Supabase docs.
- The Server Action should call `signInWithOtp`.
- The Magic Link email template must send `token_hash` back to the app.
- The app route should verify with `supabase.auth.verifyOtp({ token_hash, type: "email" })`.
- Do not use the OAuth-style `exchangeCodeForSession(code)` callback for Magic Link PKCE.
- Prefer a user-facing auth route such as `/app/auth/confirm/route.ts`, not `/app/api/...`, because the browser is being redirected after clicking an email link.
- Keep the route minimal: validate `token_hash` and `type`, verify the token, set no-store headers, then redirect to the product's default signed-in page unless the feature explicitly requires return-to-origin behavior.

Example Supabase Magic Link template:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Sign in</a>
```

---

### Supabase Client Selection

In `apps/academy/`, choose the Supabase client by context and privilege:

| Context | Client |
| --- | --- |
| Browser UI / Client Components | `createSupabaseBrowserClient` from `@/lib/client/supabaseBrowserClient` |
| Server code for the logged-in user | `createSupabaseAuthServerClient` from `@/lib/server/supabaseAuth` |
| Server public reads without user cookies | `createSupabaseClient` from `@/lib/server/supabaseClient` |
| Server admin/RLS-bypass work | `createSupabaseServerClient` from `@/lib/server/supabaseServer` |
| Middleware auth/session refresh | `createMiddlewareSupabaseClient` / `getSessionRefresh` from `@/lib/middleware/sessionRefresh` |

`createSupabaseServerClient` uses the service-role key and bypasses RLS. Use it
only when the feature explicitly requires admin privileges.

---

### 2. Create Server Action

**If type = `server-action`:** use `/engineering-new-server-action <actionName>` — it holds the one Server Action template (Zod, rate limiting, `actionSuccess`/`actionError`, `ErrorCodes`, tests), based on `src/app/actions/waitlist.ts`. Don't duplicate it here.

---

### 3. Create API Route

**If type = `api-route`:**

Create `/app/api/<route>/route.ts` with:

- ✅ HTTP method handler (`GET`, `POST`, etc.)
- ✅ Signature/token verification FIRST (before any processing)
- ✅ Secrets in `Authorization` header, never query params
- ✅ Typed errors and error responses
- ✅ Rate limiting by IP
- ✅ Logging and Sentry capture
- ✅ Response helpers (`apiSuccess`, `apiErrorResponse`)
- ✅ Comment explaining why this needs to be HTTP (webhook, email link, cron, etc.)

**Template:**
```ts
// Webhook from GitHub / external service
// Must be HTTP because GitHub sends POST events to this URL

import { NextRequest } from 'next/server';
import { apiErrorResponse, apiSuccess } from '@/utils/helpers';
import { WebhookUnauthorizedError } from '@/lib/shared/errors/WebhookUnauthorizedError';
import { logger } from '@/utils/logger';
import { getClientIp, rateLimit } from '@/lib/utils/rateLimit';
import { RATE_LIMITS } from '@/config/rateLimits';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limit = rateLimit(`webhook:${ip}`, RATE_LIMITS.publicFormMutation);
  
  if (!limit.allowed) {
    return apiErrorResponse(new RateLimitError());
  }
  
  try {
    // VERIFY SIGNATURE FIRST
    const signature = req.headers.get('x-webhook-signature');
    if (!signature || !verifySignature(signature, body)) {
      return apiErrorResponse(new WebhookUnauthorizedError());
    }
    
    // Now safe to process
    const body = await req.json();
    
    // Business logic
    // ...
    
    return apiSuccess('Processed successfully');
  } catch (error) {
    logger.error({ err: error }, 'Webhook error');
    return apiErrorResponse(error);
  }
}
```

---

### 4. Create Middleware

**If type = `middleware`:**

Create `/middleware.ts` with:

- ✅ Proper path matching (which routes does this affect?)
- ✅ Early returns for non-matching paths
- ✅ Typed responses
- ✅ Logging
- ✅ Comments explaining the middleware's purpose

**Template:**
```ts
// Auth check — redirect unauthenticated users
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/settings'];
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (!isProtected) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get('auth')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|static|_next).*)'],
};
```

---

### 5. Create Server Utility

**If type = `utility`:**

Create `/lib/server/<utilityName>.ts` with:

- ✅ Single Responsibility (one file = one concern)
- ✅ Pure functions where possible
- ✅ Typed inputs and outputs (no `any`)
- ✅ Comments explaining what it does
- ✅ Exported types alongside functions
- ✅ No circular dependencies

**Template:**
```ts
// Database query utility
import { createSupabaseAuthServerClient } from './supabaseAuth';
import { AppError } from '@/lib/shared/errors/AppError';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const supabase = await createSupabaseAuthServerClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('id', userId)
    .single();
  
  if (error) {
    throw new AppError({
      code: 'USER_NOT_FOUND',
      message: 'User does not exist',
      status: 404,
    });
  }
  
  return data;
}
```

---

## Constraints

- **Validation at boundary** — Zod schema for Server Actions, manual validation for API routes
- **Never trust client input** — validate everything server-side
- **Secrets in headers, never query params** — `Authorization` header only
- **Signature/token verification first** — for API routes, verify before any processing
- **Typed errors** — use `AppError` subclasses, never raw `throw new Error()`
- **Rate limiting for public mutations** — `checkPublicActionRateLimit` for public endpoints
- **Single Responsibility** — one file = one concern
- **No circular dependencies** — utilities can import from lib, not vice versa
- **Logging and monitoring** — use `@/utils/logger` and `captureSentryError`

## Output

- `src/app/actions/<name>.ts` (Server Action) with test file
- OR `/app/api/<route>/route.ts` (API Route) with test file
- OR `/middleware.ts` (Middleware)
- OR `/lib/server/<name>.ts` (Server utility)

All with proper error handling, validation, and security patterns baked in.

## Verification

- [ ] File created at correct path
- [ ] Proper validation (Zod for actions, manual for routes)
- [ ] Typed errors (no raw Error throws)
- [ ] Rate limiting applied (if public mutation)
- [ ] Logging and Sentry capture in place
- [ ] Signature/token verification first (if API route)
- [ ] No secrets in query params
- [ ] Single Responsibility maintained
- [ ] All exports are typed (no `any`)
- [ ] Co-located test file created

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
