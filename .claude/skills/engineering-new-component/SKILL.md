---
name: engineering-new-component
description: Scaffold a new presentational, UI-only React component following the project's role-based component structure and conventions — no business logic, state lifecycle, or backend calls.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "<ComponentName> <tier|route>"
---

# Skill: New Component

## When to use
- When creating a new shared or page-specific React component that is purely presentational — rendering, layout, and (for forms) client-side field validation only.
- Not for wiring submission handlers, data fetching, or state lifecycle to a backend — once this skill produces the UI, use `/engineering-integrate-component` to wire it up.

## Inputs
- `$1` (required): PascalCase component name.
- `$2` (required): component role folder (`primitives` | `ui` | `brand` | `forms` | `molecules` | `organisms` | `templates`) for shared components, or full route path (e.g. `about`, `products/course/dsa`) for page-specific components.
- If omitted: ask for the component name, then ask if it is shared or page-specific, then ask for tier or route.

## Prerequisites
- Confirm `$1` is PascalCase — correct it before proceeding.
- If a role folder: verify `components/<role>/` exists.
- If route: verify `app/<route>/` exists.
- Grep `components/` and `app/` to confirm no component with this name already exists.
- If the component is a form (collects and submits user input): grep `components/forms/` for existing field components (e.g. `EmailField`, `NameField`) before designing new markup.
- **Figma reference — resolve before writing any markup, not after.** Ask for the Figma link/frame if one wasn't already given. If no Figma reference exists or it isn't accessible, stop and get the user's explicit sign-off on which visual details you'll be assuming (exact color split, spacing, alignment per breakpoint, line breaks) before scaffolding — do not silently default to a guessed pattern and start writing. This blocks Step 2, it isn't a note to revisit after the component is "done" — see Design Fidelity below for what "100%" covers.

## Workflow
1. **Determine location:**
   - Shared (`$2` is a tier): `components/<tier>/$1/`
   - Page-specific (`$2` is a route): `app/<route>/_components/$1/`
   - If unsure: ask whether the component will be used on more than one page.
2. **Create `$1.tsx`:**
   - Add `'use client'` if the component needs hooks, events, or browser APIs. Rendering Chakra UI alone does not need it (v3 components are already client components).
   - Import `React, { FC }` from `react`.
   - Define a `$1Props` interface with all typed props — no `any`. For forms, props include `onSubmit`, `isLoading`, `genericError` — supplied by the caller, never owned by this component (see `/engineering-integrate-component`).
   - Use Chakra UI components for layout (`Flex`, `Box`, `Text`).
   - User-facing strings come from `next-intl` — `useTranslations` in a Client Component, or passed down as props from a Server Component that resolved them.
   - **Tokens — verify before using:** every color, border, or radius value must be a CSS variable defined in `app/globals.css`, in both the dark block and the `[data-theme="light"]` override. Run `grep -n "\-\-token-name:" app/globals.css` before using one — never assume a token exists because the name sounds right. If none fits, add it to both blocks rather than hardcoding a value.
   - **Icon source:** use an existing `lucide-react` icon, even when its style is not a perfect match — one dependency and `currentColor` support beat a marginal visual preference. Hand-roll an SVG only when an icon needs fixed multi-colour rendering that `currentColor` cannot express, such as a third party's brand mark.
   - **Icon sizing:** keep one inline-icon size across the app. Pass the same `size` value the neighbouring components use rather than picking a new one per component; a size that differs from its neighbours is drift, not design, unless a design spec says otherwise.
   - **Typography:** this app has no typography component set — text is styled with Tailwind classes. Match the classes the equivalent role already uses elsewhere (a card title, a body paragraph) instead of inventing a size. When the same treatment appears a third time, extract a small named component for it.
   - **Layout composition:** before writing new wrapper markup — a bordered/padded pill, an icon+text row, a stat block — grep `components/atoms/`, `components/molecules/` and `components/organisms/` for an existing layout shell with the same structural recipe (border + radius + padding, icon + gap + text, etc.) and reuse it by passing content as `children`/props. If none exists and the recipe is plausibly used by more than one component, extract a small layout component instead of inlining the prop block.
   - **Extract on complexity too, not just duplication.** A block that's never repeated anywhere else can still deserve its own named component if it's deeply nested or prop-heavy for one concern — e.g. 3+ levels of nested `Box`/`Flex`, or a single element carrying 5+ style props to do a distinct job (a heading with an embedded accent `<Box as="span">`, a complex absolute-positioned overlay). Don't wait for a second occurrence to justify naming something that's already hard to read at a glance.
   - Decouple layout from content: a layout component (pill, card shell, icon row) owns positioning, spacing, and borders only — it receives content via `children`/props and never imports page-specific data or hardcodes copy. A content/text atom (e.g. `CardMetaText`) owns typography only — it must not own border, padding, or absolute positioning; that belongs to the layout shell wrapping it.
   - **Single responsibility — one reason to change.** If you describe the component's job with "and" ("renders the links and owns the open state and lays out the mobile menu"), split it. Ask "what would change independently?" and give each answer its own unit: a reusable control (a toggle or icon button) is its own atom or molecule that takes state, icons and labels as props; UI state lives in a small hook; formatting and other pure logic go in `utils/`; the parent only composes.
   - **Reusable atoms own their look; call sites pass the minimum.** A component that repeats (an icon button, a toggle, a badge) owns its size, colour, spacing and accessibility attributes. The call site passes only what is needed to create it — the icon, the label, `onClick` or `isOn` — never `size`, `color` or spacing props. If a caller needs another look, add a named variant to the atom instead of exposing style props.
   - **Molecules own their composition; call sites pass content, not structure.** A molecule (nav links, a language toggle, a mobile menu) combines atoms into one unit and owns the layout between them: spacing, direction, alignment and the responsive visibility of its own parts. The call site passes only data, callbacks and `children` for a slot (the links, the active path, `onNavigate`) — never style props, and never props that reach into the atoms inside (`buttonSize`, `iconColor`). The atoms inside a molecule are not configurable from outside; if a caller needs another look, add a named variant to the molecule. Do not spread Chakra style props onto a molecule's root (`extends BoxProps`, `...rest`). A molecule never fetches data, holds business logic or imports page-specific copy — text arrives as props.
   - **If this component is a form:**
     - Use `react-hook-form`'s `useForm` for field registration and client-side validation — never per-field `useState`.
     - Validate field shape with a `zod` schema passed through a `validate` function on `register` (see `components/organisms/SignInForm.tsx` for the pattern) — this is shape/UX validation only. Authoritative validation happens server-side in the Server Action via `/engineering-integrate-component`.
     - For each field, check `components/forms/` for an existing reusable field component before writing inline `Field.Root`/`Input`/`Field.ErrorText` markup:
       - **Matching atom exists:** import it directly by file (`@/components/forms/EmailField`) — never the barrel `@/components/forms`.
       - **None exists and the field is generic enough to reuse** (email, name, message, etc.): extract a new field into `components/forms/<Field>Field.tsx` following the existing field shape, then import it here.
       - **Genuinely one-off field:** inline it, but still source every value from a verified token.
     - This component never calls a Server Action and never owns submission loading/error state — `onSubmit` is a prop from the caller.
   - Default export the component.
   - Internal order: hooks → handlers → render.
3. **Create `$1.test.tsx`** alongside the component:
   - No snapshot by default — assert what the component should render. `engineering-new-test` explains when a snapshot earns its place.
   - Include at least one behavioral assertion (for forms: that client-side validation messages render for invalid input).
4. **Create `$1.module.scss`** only if complex or nested styles are needed.
5. **Create `types.ts`** only if the component has local types shared across sub-components.
6. **Keep data external** — never inline static data; place it in `data/`.

## Design fidelity

- **Stick 100% to the Figma design — every color, emphasis split, line break, alignment, and spacing value comes from the actual design reference, never from a guessed pattern or convention.** Which words are accent-colored, whether an icon's color extends to its label, whether a line of copy is one element or two — all of this is specific to the design at hand, not something to infer from a rule of thumb that worked on a previous component.
- If Figma access isn't available and the spec doesn't pin down a visual detail, don't fill the gap with an assumption — say explicitly which details are unconfirmed and need the design reference or the user's sign-off before treating the component as done.
- **Responsiveness is part of the design, not an afterthought — check every breakpoint the design specifies, not just `base` and the largest size.** If the component's layout changes `direction`/`align`/`justify` at a breakpoint, check the in-between sizes too — correct styling at the extremes doesn't guarantee correct styling at the sizes in between. If the design only shows mobile and desktop frames, ask what the in-between behavior should be rather than guessing it inherits from one end.

## Constraints
- No inline styles — use Chakra props, Tailwind, or SCSS modules.
- No hardcoded colors, radii, or border values — every value must trace to a token verified in both theme blocks of `app/globals.css`.
- No hardcoded icon sizes, no raw `<Icon as={...}>` — every icon renders via the shared icon wrapper. No new size tier without a confirmed Figma spec, no `aria-hidden={false}` override unless the icon conveys something the adjacent text doesn't.
- No skipping the test file — every component ships with a test.
- No unnecessary `'use client'` — only add if hooks, events, or browser APIs are genuinely needed, or the component renders Chakra UI (which needs it regardless — see Server vs Client Components rule).
- No `any` types — define typed props interfaces.
- No data in components — static data belongs in `data/`.
- No Server Action calls, `fetch`, Supabase client calls, or locally-owned submission state (e.g. an `isSubmitting` not derived from props) — that belongs to `/engineering-integrate-component`. This component must be fully renderable with mocked props alone.
- No inline form field markup duplicating an atom that already exists — reuse it.
- No barrel imports (e.g. the `@/components/forms` barrel) — import the specific file.
- No duplicated typography composition — use the existing semantic text atom before introducing local `fontSize`, `lineHeight`, `fontWeight`, casing, and letter-spacing combinations.
- No duplicated layout shells — reuse an existing pill/card/icon-row layout component before re-declaring the same border/radius/padding/gap prop block.

## Output
- `$1.tsx` — component file with typed props and default export.
- `$1.test.tsx` — test file with behavioural assertions.
- `$1.module.scss` — styles file (only if needed).
- `types.ts` — shared local types (only if needed).
- Any newly extracted reusable field(s) in `components/forms/`.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm test $1` — the component's tests pass.
- [ ] Every visual detail (color split, spacing, alignment, line breaks, per-breakpoint layout) traces to the Figma reference — or, if no reference was available, the user explicitly signed off on the specific assumptions made. No detail was silently guessed.
- [ ] Every token used exists in both `:root` and `[data-theme="light"]` in `app/globals.css`.
- [ ] Every icon renders via the shared icon wrapper — no raw `Icon as={...}`, no `width`/`height`/`size` prop on the icon component itself, and no new size tier without a confirmed Figma spec.
- [ ] Every text element uses the matching semantic typography atom, except justified display typography.
- [ ] No structural prop block (pill, icon+text row, stat block) duplicates an existing layout component; layout shells are decoupled from content.
- [ ] Component renders without errors in the browser.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
