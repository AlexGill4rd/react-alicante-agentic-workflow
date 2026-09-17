# Let attendees send feedback on a session

## What
A "Send feedback" form on each session page: a rating from 1 to 5 and an optional comment. On submit, a Server Action posts the feedback as JSON to the URL in `FEEDBACK_WEBHOOK_URL`.

## Why
Speakers and organizers want feedback right after a talk. Sending it to a webhook means no database table and no login are needed.

It has to be an environment variable, not a value in the code:
- **It's a secret.** Anyone who has the URL can post to it, so it must stay on the server: no `NEXT_PUBLIC_` prefix.
- **It differs per environment.** Local, preview and production should each send feedback to a different place.
- **It can change without a code change.** Swapping the destination is a settings update, not a new commit.

## Acceptance Criteria
- [ ] `/sessions/[id]` has a feedback form: rating 1–5 (required) and comment (optional, max 500 characters).
- [ ] Submitting calls a Server Action. `FEEDBACK_WEBHOOK_URL` is read only on the server.
- [ ] The JSON sent contains `sessionId`, `rating`, `comment` and `submittedAt`.
- [ ] The Server Action validates input itself and rejects a rating outside 1–5 or a comment over 500 characters.
- [ ] The user sees a success message when the webhook responds, and a friendly error if it fails or the variable is missing. The page never crashes.
- [ ] `FEEDBACK_WEBHOOK_URL` is added to `.env.example` with a comment, and to the env variable table in `README.md`.
- [ ] The URL is not in the browser bundle: after `pnpm build`, searching `.next/static` for it finds nothing.
- [ ] The variable is set in Vercel for Preview and Production, and submitting feedback on the deployed preview shows the request arriving.
- [ ] No new npm dependencies.

## Notes
- Get a free URL at [webhook.site](https://webhook.site), no signup needed. Requests show up live on that page. Free URLs expire after 7 days, so create one on the day.
- `release-check-env-vars` should flag the new variable before release.
