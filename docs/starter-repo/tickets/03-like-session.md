# Add a Like button to sessions

## What

A "👍 Like" button on each session page. Clicking it sends the session id to the webhook URL stored in `FEEDBACK_WEBHOOK_URL` and shows "Thanks!".

## Why

Organizers get a quick signal of which talks landed, with no database and no login.

It has to be an environment variable:

- **It's a secret.** Anyone with the URL can post to it, so it stays on the server: no `NEXT_PUBLIC_` prefix.
- **It differs per environment.** Local, preview and production can each send likes somewhere else.
- **It changes without a code change.** Swapping the URL is a settings update, not a commit.

## Acceptance Criteria

- [ ] Each session page has a "👍 Like" button.
- [ ] Clicking it calls a Server Action that posts `{ "sessionId": "...", "likedAt": "..." }` to `FEEDBACK_WEBHOOK_URL`.
- [ ] The button shows "Thanks!" on success and "Something went wrong" otherwise.
- [ ] `FEEDBACK_WEBHOOK_URL` is in `.env.example`.
- [ ] The variable is set in Vercel, and liking a session on the deployed preview shows the request arriving.

## Notes

- Get a free URL at [webhook.site](https://webhook.site), no signup needed. Requests show up live on that page. Free URLs expire after 7 days, so create one on the day.
