# Backend Security

## Supabase RLS

- **Every table that anon or authenticated roles can reach must have RLS enabled.**
  - Run `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;` in the migration that creates the table — never as an afterthought.
  - After enabling RLS, explicitly define policies for every role that needs access. No policy = no access (RLS default-deny).
  - The `service_role` key bypasses RLS entirely — it is for server-side write operations only. Never expose it to the client or edge runtime.
  - The `anon` key is safe for middleware and client reads, but only after confirming the target table has an appropriate RLS policy.
  - When adding a new table, ask: "can anon or authenticated reach this?" If yes, add RLS + policy in the same migration.

```sql
-- Always pair these together in one migration
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published rows"
  ON my_table FOR SELECT
  USING (published = true);

CREATE POLICY "Service role has full access"
  ON my_table FOR ALL TO service_role
  USING (true) WITH CHECK (true);
```

## Secrets in API calls

- **Never put secrets, tokens, or API keys in URL query params.**
  - Query strings appear in Vercel logs, browser history, Referer headers, CDN/proxy access logs, and error-monitoring breadcrumbs. Tokens leak passively.
  - Always pass secrets in request headers.

```ts
// ❌ Never — token visible in logs
fetch("/api/sync-blog?token=abc123")

// ✅ Always — token in Authorization header
fetch("/api/sync-blog", {
  headers: { Authorization: `Bearer ${token}` },
})

// Reading it server-side
const auth = req.headers.get("authorization");
const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
```

## Webhook signature verification

- Always verify webhook signatures before processing the request body.
- Reject with 401 immediately if the signature header is absent — do not proceed to dispatch or parsing.
- Use `crypto.timingSafeEqual` for HMAC comparison — never `===` on strings (timing oracle).

```ts
if (!signature) {
  return apiErrorResponse(new WebhookUnauthorizedError());
}
// then dispatch to consumer which does HMAC verification
```

## Environment variables

- `NEXT_PUBLIC_*` variables are embedded in the client bundle — never put secrets there.
- Server-only secrets (`SERVICE_ROLE_KEY`, `WEBHOOK_SECRET`, `API_TOKEN`) must not have the `NEXT_PUBLIC_` prefix.
- Middleware runs on the Edge runtime — use `NEXT_PUBLIC_SUPABASE_ANON_KEY`, never the service role key.

## Never silently reject unexpected input

Any branch that rejects input *because it doesn't match what you expected* must
log and report it — not return quietly. A silent rejection hides the worst class
of bug: your assumption about an external system being wrong, which no mocked
test can catch (they assert the same wrong assumption).

Real case: an auth callback silently rejected one valid token type, so every
brand-new customer's first sign-in failed for months. All tests passed
throughout. One warning log would have caught it on day one.

```ts
// ❌ Silent
if (!isSupportedOtpType(type)) return redirect(ERROR_PATH);

// ✅ Loud
if (!isSupportedOtpType(type)) {
  console.warn("[auth/confirm] rejected unsupported type:", type);
  return redirect(ERROR_PATH);
}
```

Applies anywhere you enumerate "values we know about" for a system you don't
control — event types, provider names, status strings, enum allow-lists. Prefer
accepting the vendor's full documented set over the subset you happen to have
seen.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
