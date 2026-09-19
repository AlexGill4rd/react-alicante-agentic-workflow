---
name: engineering-new-page
description: Scaffold a new Next.js page with directory structure, layout, translations, and an initial section component.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "<page-name>"
---

# Skill: New Page

## When to use
- When creating a new route in the application.

## Inputs
- `$ARGUMENTS` (required): page name / route segment in kebab-case (e.g., `about`, `products/course`).
- If omitted: ask what page to create and its purpose.

## Prerequisites
- Confirm `app/` exists.
- Confirm `app/$ARGUMENTS/` does not already exist.
- Grep `messages/en.json` to confirm no conflicting namespace exists for this page.
- **Figma reference — resolve before Step 1, not after the page is built.** Ask for the Figma link/frame if one wasn't already given. If no reference exists or it isn't accessible, stop and get the user's explicit sign-off on which visual details you'll be assuming (chrome vs. minimal layout, color splits, spacing, per-breakpoint behavior, copy) before scaffolding — do not default to a guessed pattern and start writing. See Design Fidelity below for the full scope of what "100%" covers.

## Workflow
1. **Create the directory structure:**
   ```
   app/$ARGUMENTS/
   ├── page.tsx
   ├── layout.tsx
   └── _components/
   ```
2. **Create `layout.tsx`:**
   - Export `metadata` (title, description) using `Metadata` type from `next`.
   - **Never import or wrap with the site-chrome template here — that decision belongs in `page.tsx` only (Step 3).** `layout.tsx` can still render lightweight layout-level wrappers around `{children}` when the page needs them — e.g. a section's `layout.tsx` renders a theme switcher or a breadcrumb around children. It's specifically the heavy site-chrome decision (header/footer/floating CTA via the site-chrome template) that's reserved for `page.tsx`, not layout-level content in general.
3. **Create `page.tsx`:**
   - **Decide here whether this page needs full site chrome (header, footer, floating CTA) via the site-chrome template, or should be a standalone, minimal-chrome screen.** Default to wrapping children in the site-chrome template for ordinary content pages. Skip it for auth screens, error/unauthorized pages, or anything explicitly designed as a focused flow with its own back-navigation and no marketing chrome — matching the existing precedent (`ArticlesUnauthorizedPage`, `/login`). If unsure which category a new page falls into, check the Figma reference for visible header/footer chrome, or ask.
   - This decision lives in exactly one place. Don't let a later edit add the site-chrome template back into `layout.tsx` or duplicate the wrapping in both files — that's how `/login` briefly regained the sitewide floating CTA after the layout had deliberately excluded it.
   - Import page-level components from `./_components/`.
   - `page.tsx` is a Server Component — use `getTranslations` from `next-intl/server` (async), never the `useTranslations` client hook here.
   - Default export the page component.
   - **Reuse the page shell the other pages use** rather than hand-rolling width and padding. Read a sibling `layout.tsx` under `app/[locale]/` and follow it: the same max-width, the same horizontal padding, the same spacing under the nav. Copying `paddingX`/`maxWidth` values into a new page is how one route ends up 8px narrower than the rest, and nobody notices until it is on screen.
4. **Add translation namespace** to `messages/en.json` matching the page name (e.g., `"AboutPage": {}`).
5. **Create initial section component** in `_components/` using `SectionsWrapper` from `@/templates/SectionsWrapper` and a `skinConfigs` from `@/constants/theme`.

## Translations on multi-section pages

- **Don't fetch every descendant's strings in `page.tsx` and drill them down as props.** If `page.tsx` resolves translations for components it doesn't itself render text in, that's the prop-drilling `architecture.md` bans ("no prop drilling beyond 2 levels — if props travel through 3+ components unchanged, move the lookup to where it's used").
- Each section component that renders translated text should fetch its own slice: call `getTranslations` directly inside that component if it's a Server Component (the default — don't add `'use client'` just to call a translation hook).
- `page.tsx` should only pass down what it structurally owns (e.g. `locale` for building hrefs) — not strings for children to render.
- Don't reach for `useParams()` to re-derive `locale` inside a child Server/Client Component when the page already has it from its own route `params` — pass it down as a plain prop instead. Calling `useParams()` purely to get `locale` is a common reason components get marked `'use client'` unnecessarily.

## Design fidelity

- **Stick 100% to the Figma design — every color, emphasis split, line break, alignment, and spacing value comes from the actual design reference, never from a guessed pattern or convention.** Which words are accent-colored, whether an icon's color extends to its label, whether a line of copy is one element or two, how a layout aligns at each breakpoint — all of this is specific to the design at hand. A rule of thumb that happened to be right for one page can easily be wrong for the next.
- **Copy text quoted in the issue/AC must be used verbatim** — never paraphrase or drop part of a quoted string.
- If Figma access isn't available and the issue text doesn't pin down a visual detail (exact color split, line breaks, spacing, alignment at each breakpoint), don't fill the gap with an assumption. Say explicitly which details are unconfirmed and need the Figma reference or the user's sign-off before treating the page as done — implementing a guess and waiting to be corrected costs more round-trips than asking once up front.
- **Responsiveness is part of the design, not an afterthought — check every breakpoint the design specifies, not just `base` and the largest size.** A layout that switches `direction`/`align`/`justify` at a breakpoint needs each state checked against the design at that size, since correct styling at the extremes doesn't guarantee correct styling at the sizes in between. If the Figma file only shows mobile and desktop frames, ask what the in-between behavior should be rather than guessing it inherits from one end.

## Constraints
- No hardcoded strings — all visible text comes from `messages/<locale>.json` (`getTranslations` in Server Components, `useTranslations` only in Client Components that already need `'use client'`).
- No hardcoded colors — use CSS variables or Chakra theme tokens.
- No skipping `layout.tsx` — every page needs a layout file, even if it only exports `metadata` and renders nothing else.
- No importing the site-chrome template in `layout.tsx` — that decision belongs in `page.tsx` only (see Step 3).
- No inline static data — static content belongs in `data/`.

## Output
- `app/$ARGUMENTS/page.tsx`
- `app/$ARGUMENTS/layout.tsx`
- `app/$ARGUMENTS/_components/` directory with initial section component.
- Translation namespace added to `messages/en.json`.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm build` — catches Server/Client boundary errors (e.g. `createContext is not a function`) that type-check and the test suite never execute against.
- [ ] **Actually load the route in a real `next dev` session and check the browser console for errors** — `pnpm build` and the tests do not exercise Turbopack's dev compiler. Confirmed bug class: a library whose `react-server` export condition hangs or OOMs Turbopack dev, but not the production build, on any route rendering a component that imports it — invisible to every other check in this list. Start the dev server, request the route (`curl` or a real browser), and watch the dev server log for hangs/crashes, not just type-check/build/test passing. Take the URL from the dev server's own output rather than assuming a port, and stop the server afterwards if you were the one who started it.
- [ ] Translation namespace exists in `messages/en.json`.
- [ ] Every visual detail (chrome vs. minimal layout, color split, spacing, alignment, line breaks, per-breakpoint layout) traces to the Figma reference — or, if no reference was available, the user explicitly signed off on the specific assumptions made. No detail was silently guessed.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
