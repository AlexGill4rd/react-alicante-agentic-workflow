# Add a Speakers page

## What

A new `/speakers` page listing every speaker with the session(s) they give. Each session links to its session page.

## Expected result

![The Speakers page](https://raw.githubusercontent.com/engineering-workshops/react-alicante-agentic-workflow/dev/docs/starter-repo/tickets/images/speakers-page.png)

It should look similar. The details are yours.

## Why

Attendees often look for a person, not a time slot. Today the only way to find a speaker is to scan the whole schedule.

## Acceptance Criteria

- [ ] `/speakers` renders with the same nav, layout and footer as the other pages.
- [ ] A "Speakers" nav link (EN: "Speakers", ES: "Ponentes") appears in the desktop nav and the mobile menu, and is highlighted when active.
- [ ] One card per speaker, sorted by name, showing their name and each of their sessions (title and start time).
- [ ] Each session in a card links to `/sessions/[id]` (use the locale-aware `Link` from `@/i18n/navigation`, which adds the prefix).
- [ ] The closing panel's "Full speaker lineup" is not listed as a speaker.
- [ ] Data comes from `fetchSessions()` in `services/sessions.ts`. Grouping sessions by speaker is a pure function in `utils/`.
- [ ] The speaker card is its own component, built on the existing `Card` primitive.
- [ ] Works at mobile width and in light and dark mode.
- [ ] No database change and no new environment variable.

## Notes

- Follow the existing page pattern, e.g. `app/stats/page.tsx` + `app/stats/layout.tsx`.
- Nav links live in `components/organisms/site-nav.tsx`; labels in `utils/translations.ts`.
