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
- If a role folder: verify `src/components/<role>/` exists.
- If route: verify `src/app/[locale]/<route>/` exists.
- Grep `src/components/` and `src/app/` to confirm no component with this name already exists.
- If the component is a form (collects and submits user input): grep `src/components/forms/` for existing field components (e.g. `EmailField`, `NameField`) before designing new markup.
- **Figma reference — resolve before writing any markup, not after.** Ask for the Figma link/frame if one wasn't already given. If no Figma reference exists or it isn't accessible, stop and get the user's explicit sign-off on which visual details you'll be assuming (exact color split, spacing, alignment per breakpoint, line breaks) before scaffolding — do not silently default to a guessed pattern and start writing. This blocks Step 2, it isn't a note to revisit after the component is "done" — see Design Fidelity below for what "100%" covers.

## Workflow
1. **Determine location:**
   - Shared (`$2` is a tier): `src/components/<tier>/$1/`
   - Page-specific (`$2` is a route): `src/app/[locale]/<route>/_components/$1/`
   - If unsure: ask whether the component will be used on more than one page.
2. **Create `$1.tsx`:**
   - Add `'use client'` if the component needs hooks, events, or browser APIs — **or renders Chakra UI**, which needs client execution regardless (its styling engine can't run in a pure Server Component; the failure is a build-time crash, not something type-check or Jest catches).
   - Import `React, { FC }` from `react`.
   - Define a `$1Props` interface with all typed props — no `any`. For forms, props include `onSubmit`, `isLoading`, `genericError` — supplied by the caller, never owned by this component (see `/engineering-integrate-component`).
   - Use Chakra UI components for layout (`Flex`, `Box`, `Text`).
   - Use `useTranslations` from `next-intl` for all user-facing strings.
   - **Tokens — verify before using:** every color, border, or radius value must be a CSS variable defined in `src/styles/settings/variables.css` in *both* the `:root` block and the `[data-theme="light"]` block. Run `grep -n "\-\-token-name:" src/styles/settings/variables.css` before using a token — never assume one exists because it sounds right or appears in unrelated design notes. If no token fits, add one to both blocks instead of hardcoding a value.
   - **Icon source — react-icons by default, custom SVG only for an unreproducible brand constraint:** default to an existing `react-icons` icon (`Fi`/`Md`/`Hi`/`Fa`/`Si` families) even if its exact style (outline vs. solid) isn't a perfect visual match — technical consistency (one dependency, no hand-maintained path data, automatic `currentColor`) wins over a marginal style preference. Only hand-roll a custom SVG component when a icon needs a fixed multi-color rendering that no `currentColor`-based icon can express — e.g. `GoogleIcon` exists because Google's sign-in button spec mandates its exact 4-color "G," not because of a style choice. Before adding a new custom SVG, grep `src/components/brand/icons/` and react-icons' typings for an existing equivalent first.
   - **Icon sizing:** never render an icon directly (no raw `<Icon as={...}>`, no `width`/`height`/`size` props on the icon component). Always use `<PhilomathIcon icon={IconComponent} />` from `@/components/primitives/PhilomathIcon` — it works uniformly for Chakra icons, react-icons, and raw `<svg>` components, and already defaults `boxSize` to `var(--icon-size)` (20px, the one inline-icon size for the whole app), `flexShrink={0}`, and `aria-hidden={true}` (icons paired with adjacent text are decorative by default — pass `aria-hidden={false}` explicitly only when the icon conveys something the text doesn't). Don't introduce a second size tier for a new component just because it feels slightly more prominent — a confirmed Figma spec is required before any icon deviates from the default, otherwise it's drift, not design. The one accepted exception is an icon-in-button (`leftIcon`/`rightIcon` on a `Button` whose `size` prop varies) — there, Chakra's own `1em` button-relative sizing is the correct pattern, not drift; leave it un-migrated.
   - **Typography composition:** assign every text element a semantic role, then use the matching atom:
     - Body / description copy → `<BodyText>`
     - Section headings → `<SectionTitle>`
     - Section subtitles → `<SectionSubTitle>`
     - Card headings → `<CardTitle>`
     - Repeated uppercase labels / eyebrows → `<LabelText>`
     - Compact card timing, pricing, or metadata → `<CardMetaText>`
   - Import typography primitives directly from `@/components/primitives/<Component>`.
   - Do not recreate an existing role with raw `<Text fontSize=...>` props. Hero headlines, metrics, and other genuine display typography may use `Text` when no existing primitive represents the role; use the project typography scale and keep that treatment inside a named, focused component.
   - Do not force labels, headings, or metadata into `BodyText` merely to avoid raw `Text`. Reuse by semantic role, not by HTML tag alone.
   - **Layout composition:** before writing new wrapper markup — a bordered/padded pill, an icon+text row, a stat block — grep `src/components/primitives/`, `src/components/ui/`, and `src/components/molecules/` for an existing layout shell with the same structural recipe (border + radius + padding, icon + gap + text, etc.) and reuse it by passing content as `children`/props. If none exists and the recipe is plausibly used by more than one component, extract a small layout component instead of inlining the prop block.
   - **Extract on complexity too, not just duplication.** A block that's never repeated anywhere else can still deserve its own named component if it's deeply nested or prop-heavy for one concern — e.g. 3+ levels of nested `Box`/`Flex`, or a single element carrying 5+ style props to do a distinct job (a heading with an embedded accent `<Box as="span">`, a complex absolute-positioned overlay). Don't wait for a second occurrence to justify naming something that's already hard to read at a glance.
   - Decouple layout from content: a layout component (pill, card shell, icon row) owns positioning, spacing, and borders only — it receives content via `children`/props and never imports page-specific data or hardcodes copy. A content/text atom (e.g. `CardMetaText`) owns typography only — it must not own border, padding, or absolute positioning; that belongs to the layout shell wrapping it.
   - **If this component is a form:**
     - Use `react-hook-form`'s `useForm` for field registration and client-side validation — never per-field `useState`.
     - Validate field shape with a `zod` schema passed through a `validate` function on `register` (see `src/components/organisms/SignInForm.tsx` for the pattern) — this is shape/UX validation only. Authoritative validation happens server-side in the Server Action via `/engineering-integrate-component`.
     - For each field, check `src/components/forms/` for an existing reusable field component before writing inline `FormControl`/`Input`/`FormErrorMessage` markup:
       - **Matching atom exists:** import it directly by file (`@/components/forms/EmailField`) — never the barrel `@/components/forms`.
       - **None exists and the field is generic enough to reuse** (email, name, message, etc.): extract a new field into `src/components/forms/<Field>Field.tsx` following the existing field shape, then import it here.
       - **Genuinely one-off field:** inline it, but still source every value from a verified token.
     - This component never calls a Server Action and never owns submission loading/error state — `onSubmit` is a prop from the caller.
   - Default export the component.
   - Internal order: hooks → handlers → render.
3. **Create `$1.test.tsx`** alongside the component:
   - Mock `next-intl` with `jest.mock`.
   - Include a snapshot test.
   - Include at least one behavioral assertion (for forms: that client-side validation messages render for invalid input).
4. **Create `$1.module.scss`** only if complex or nested styles are needed.
5. **Create `types.ts`** only if the component has local types shared across sub-components.
6. **Keep data external** — never inline static data; place it in `src/data/`.

## Design fidelity

- **Stick 100% to the Figma design — every color, emphasis split, line break, alignment, and spacing value comes from the actual design reference, never from a guessed pattern or convention.** Which words are accent-colored, whether an icon's color extends to its label, whether a line of copy is one element or two — all of this is specific to the design at hand, not something to infer from a rule of thumb that worked on a previous component.
- If Figma access isn't available and the spec doesn't pin down a visual detail, don't fill the gap with an assumption — say explicitly which details are unconfirmed and need the design reference or the user's sign-off before treating the component as done.
- **Responsiveness is part of the design, not an afterthought — check every breakpoint the design specifies, not just `base` and the largest size.** If the component's layout changes `direction`/`align`/`justify` at a breakpoint, check the in-between sizes too — correct styling at the extremes doesn't guarantee correct styling at the sizes in between. If the design only shows mobile and desktop frames, ask what the in-between behavior should be rather than guessing it inherits from one end.

## Constraints
- No inline styles — use Chakra props, Tailwind, or SCSS modules.
- No hardcoded colors, radii, or border values — every value must trace to a token verified in both theme blocks of `variables.css`.
- No hardcoded icon sizes, no raw `<Icon as={...}>` — every icon renders via `<PhilomathIcon icon={IconComponent} />`. No new size tier without a confirmed Figma spec, no `aria-hidden={false}` override unless the icon conveys something the adjacent text doesn't.
- No skipping the test file — every component ships with a test.
- No unnecessary `'use client'` — only add if hooks, events, or browser APIs are genuinely needed, or the component renders Chakra UI (which needs it regardless — see Server vs Client Components rule).
- No `any` types — define typed props interfaces.
- No data in components — static data belongs in `src/data/`.
- No Server Action calls, `fetch`, Supabase client calls, or locally-owned submission state (e.g. an `isSubmitting` not derived from props) — that belongs to `/engineering-integrate-component`. This component must be fully renderable with mocked props alone.
- No inline form field markup duplicating an atom that already exists — reuse it.
- No barrel imports (e.g. the `@/components/forms` barrel) — import the specific file.
- No duplicated typography composition — use the existing semantic text atom before introducing local `fontSize`, `lineHeight`, `fontWeight`, casing, and letter-spacing combinations.
- No duplicated layout shells — reuse an existing pill/card/icon-row layout component before re-declaring the same border/radius/padding/gap prop block.

## Output
- `$1.tsx` — component file with typed props and default export.
- `$1.test.tsx` — test file with snapshot and behavioral tests.
- `$1.module.scss` — styles file (only if needed).
- `types.ts` — shared local types (only if needed).
- Any newly extracted reusable field(s) in `src/components/forms/`.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] `pnpm test -- --testPathPattern=$1` — snapshot and behavioral tests pass.
- [ ] Every visual detail (color split, spacing, alignment, line breaks, per-breakpoint layout) traces to the Figma reference — or, if no reference was available, the user explicitly signed off on the specific assumptions made. No detail was silently guessed.
- [ ] Every token used exists in both `:root` and `[data-theme="light"]` in `variables.css`.
- [ ] Every icon renders via `<PhilomathIcon icon={IconComponent} />` — no raw `Icon as={...}`, no `width`/`height`/`size` prop on the icon component itself, and no new size tier without a confirmed Figma spec.
- [ ] Every text element uses the matching semantic typography atom, except justified display typography.
- [ ] No structural prop block (pill, icon+text row, stat block) duplicates an existing layout component; layout shells are decoupled from content.
- [ ] Component renders without errors in the browser.
