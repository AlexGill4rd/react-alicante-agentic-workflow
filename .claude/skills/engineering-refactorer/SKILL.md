---
name: engineering-refactorer
description: Refactor a component or module to improve readability, maintainability, and convention adherence without changing external behavior.

metadata:
  domain: engineering
  trigger: manual
  after: [audit-layout, engineering-refactor-backend, engineering-review-component]

argument-hint: "<filepath>"
---

# Skill: Refactorer

## When to use
- When a component or module needs structural improvement without changing its external behavior.

## Inputs
- `$ARGUMENTS` (required): path to the file or directory to refactor.
- If omitted: auto-detect from `git status` — `.tsx`/`.ts` files under the source folders.

## Prerequisites
- Confirm `$ARGUMENTS` path exists before operating.
- Confirm a co-located `.test.tsx` exists — refactoring without tests is risky. Warn if missing.
- Run `pnpm type-check` before starting — record pre-existing errors to avoid counting them as regressions.
- **Run `audit-layout` on the same scope first, and apply its findings before proceeding to Pass 1.** Extracting a block's existing structure into a named component without first removing dead wrappers, inert props, and single-item spacing containers just gives the redundancy a permanent name instead of removing it. Clean up, then extract — not the other way around.

## Workflow

### Pass 1: Analyze & Plan
1. **Determine scope:** If `$ARGUMENTS` provided, use that file or directory. Otherwise run `git status --short | awk '{print $2}'`, filter to `.tsx`/`.ts` files under the source folders.
2. **Check Server/Client boundaries (components only):** 
   - Does the component use `getTranslations`, `getLocale`, server-side Supabase, or other server-only imports?
   - Is it marked `'use client'`? → **ERROR** — remove the directive and make it async
   - Is it a sync `FC` with `await`? → **ERROR** — convert to async Server Component
   - Is it passing server-only data as props? → May need restructuring
   - **If violations found, show plan before proceeding.** This is a refactoring opportunity, not just cleanup.
3. **Analyze:** Read the target file(s) and their tests. Identify which strategies apply.
4. **Plan:** List the specific changes (including boundary fixes if found) and the reason for each. Show the plan to the user before executing.

### Pass 2: Execute Refactoring
5. **Execute — Component Decomposition** (if component does too much):
   - Identify distinct responsibilities.
   - Extract sub-components into the same directory (`FeatureName/SubPart.tsx`).
   - Keep the main component as the orchestrator with a default export.
   - Move shared types to `types.ts` within the directory.
6. **Execute — Logic Extraction** (if component contains business logic):
   - Reusable logic → `hooks/`
   - Domain logic → `services/` or `utils/`
   - Pure utilities → `utils/`
   - Server-side logic → `services/` or `app/actions/`
7. **Execute — Styling Consolidation** (if styling is inconsistent):
   - Pick one approach per component: Chakra props → CSS custom properties → Tailwind → SCSS Module.
   - Use `skinConfigs` from `@/constants/theme` for theme tokens.
   - Convert inline styles to the chosen approach.
   - Replace raw icon rendering (`<Icon as={IconComponent} boxSize={...}>`, `boxSize={4}`, `size={20}`, hardcoded svg/react-icons `width`/`height`) with the app's shared icon wrapper — there is one default inline-icon size (20px) for the whole app, not a per-component choice, and the wrapper also defaults `flexShrink={0}` and `aria-hidden={true}` (drop explicit `flexShrink={0}`/`aria-hidden` props once migrated — they're redundant). Route raw `<svg>` and react-icons components through it too, never pass `width`/`height`/`size` to them directly. A component rendering at a different size than its neighbors is drift to fix, not a "tier" to preserve — don't invent a category to justify a number that just happened to be copy-pasted from somewhere. Only keep a size deviation if it traces to a confirmed Figma spec, and only keep `aria-hidden={false}` if the icon conveys something the adjacent text doesn't.
8. **Execute — Typography Composition** (components only):
   - Classify text by role before changing it: section title, section subtitle, card title, body copy, label/eyebrow, supporting metadata, or display typography.
   - Reuse `SectionTitle`, `SectionSubTitle`, `CardTitle`, `BodyText`, `LabelText`, and `CardMetaText` for their matching roles.
   - Replace copied `<Text>` prop combinations with the appropriate atom while preserving rendered output.
   - Keep genuine display typography (hero headlines, metrics, decorative code) specialized when forcing it into a generic atom would weaken semantics or require excessive overrides.
   - Do not turn `BodyText` into an all-purpose component with many unrelated variants. Prefer narrow semantic primitives.
9. **Execute — Layout Composition** (components only):
   - Classify each wrapper element by structural role before changing it: card shell, pill/badge, icon+text row, stat block, divider, or genuine one-off layout.
   - Before extracting anything new, grep `components/primitives/`, `components/ui/`, and `components/molecules/` for an existing layout shell with the same recipe (e.g. border + radius + padding pill, icon + gap + text row). Reuse it instead of re-declaring the prop block.
   - If the same structural prop block (border/radius/padding/gap combination) appears more than once — including across unrelated files, not just within the file being refactored — extract it into a small layout component that accepts content as `children`/props and owns only positioning, spacing, and borders.
   - **Also flag complexity even with zero duplication.** A block that's unique to this file can still need extraction if it nests 3+ levels of `Box`/`Flex` for one concern, or a single element carries 5+ style props (a heading with an embedded accent span, a multi-layer absolute-positioned overlay). The duplication check above isn't the only trigger — don't wave through a deeply-nested unique block just because nothing else in the codebase looks like it yet.
   - Keep layout components decoupled from content: a layout shell must not import page-specific data, hardcode copy, or pick its own typography role — the caller supplies content (text atoms, icons) as children/props. Conversely, a content/text atom (e.g. `CardMetaText`, `LabelText`) must not own border, padding, or absolute positioning — that belongs to the layout shell wrapping it.
   - Don't force a shared layout component onto two wrappers that only superficially look similar — if alignment, spacing, or semantics genuinely differ (e.g. a centered bullet dot vs a top-aligned status icon), leave them separate rather than building an over-flexible component to cover both.
10. **Execute — Responsive Value Dedup** (if a Chakra responsive object repeats itself):
   - Scan responsive-object props (`{ base: ..., sm: ..., md: ..., lg: ..., xl: ... }`) for breakpoints carrying the identical value/expression.
   - If every breakpoint resolves to the same value, collapse to a single non-responsive prop value.
   - If only some breakpoints repeat, drop the redundant ones and keep only the breakpoints where the value actually changes (Chakra inherits the nearest smaller breakpoint already defined).
   - Don't leave duplicated literals or duplicated ternary/expression logic across breakpoint keys — that's a smell that the responsive object was copy-pasted rather than intentional.

### Pass 3: Recursive Decomposition (NEW)
11. **After extraction, analyze newly created sub-components:**
   - For each extracted sub-component, ask: "Does this component still violate SRP?"
   - If a sub-component has multiple responsibilities (e.g., conditional sections + list rendering), **mark it for recursive refactoring**
   - Collect all candidates for recursive decomposition

12. **If recursive candidates exist:**
    - Show the user a **recursive refactoring plan** listing which sub-components should be further decomposed and why
    - Ask user approval: "Refactor N sub-components recursively? (y/n)"
    - If approved, apply the same workflow (steps 3-12) to each sub-component
    - **Repeat until all components are leaf nodes** (single responsibility, < 50 lines, no nested conditionals)

13. **Component hierarchy reporting:**
    - After all passes, generate a **component tree** showing the final hierarchy
    - Report **depth** (longest chain from root to leaf)
    - Flag any components still > 50 lines or with multiple responsibilities as "refactor candidates for future pass"

### Pass 4: Finalize
14. **Delegate convention check** to `/engineering-review-component` on each modified file.
15. **Update tests** to match the new structure. If none existed, run `/engineering-new-test`.
16. **Report:**
    - Summarize what changed and why (all passes)
    - Show final component hierarchy tree
    - Note decomposition depth and leaf node count

## Leaf Node Criteria

A component is considered a **leaf node** (ready to stop decomposition) when it meets ALL of these:
- **Single Responsibility** — one reason to change, no mixed concerns (e.g., not "render nav links AND handle authentication")
- **Concise** — ideally < 50 lines (comfortable to understand at a glance)
- **Flat logic** — no nested conditionals (max 1 level of if/else)
- **No further extraction** — all distinct concerns have been extracted into separate files

Components that are **NOT leaf nodes** (should be further decomposed):
- > 50 lines with multiple `if` statements at top level
- Mixing data transformation + presentation (extract transformation to utils)
- Multiple conditional sections (extract each to a sub-component)
- Rendering multiple independent lists/grids (extract to separate components)

## Constraints
- No behavior changes — external API, props, and rendered output must remain identical.
- No redundant repetition — collapse duplicated values/expressions (responsive breakpoint objects, repeated literals, copy-pasted prop blocks) to the minimal code that produces the same output.
- No duplicated typography recipes — repeated text roles must use the matching shared typography atom.
- No duplicated layout shells — a repeated bordered/padded wrapper, pill, or icon+text row recipe must be extracted into (or reuse) a shared layout component instead of being re-declared inline.
- No hardcoded icon sizes, no raw `<Icon as={...}>` — every icon (Chakra, raw svg, or react-icons) renders via the shared icon wrapper, never `width`/`height`/`size` props directly on the icon component. Don't preserve an inherited size difference as if it were an intentional tier — collapse it to the default unless a Figma spec says otherwise. Drop redundant explicit `flexShrink={0}`/`aria-hidden` once migrated — the wrapper defaults both.
- No wider client boundaries — preserve existing `'use client'` boundaries or make them narrower, never wider. Removing a `'use client'` entirely counts as narrowing too — keep it only if the component uses hooks, event handlers, or browser APIs (Chakra UI v3 alone doesn't need it).
- **Server-only imports require Server Components** — if a component uses `getTranslations` or server-side DB calls, it must NOT have `'use client'`. Fix as part of refactoring.
- No stray `console.log` left behind — log deliberately, on failure paths.
- No hallucination — do NOT assume a file, key, or function exists — verify with grep or a file read first.
- No skipping the plan step — **always show the plan before executing each pass**

## Output
- Refactored files with improved structure.
- Summary of changes made and the reason for each.

## Verification
- [ ] `pnpm type-check` — zero new errors beyond pre-existing baseline.
- [ ] `pnpm test -- --testPathPattern=<file>` — all tests pass.
- [ ] `/engineering-review-component` reports no convention violations.
- [ ] No inline styles, no relative cross-directory imports, no unused imports remain.
- [ ] Body, heading, label, and metadata typography uses semantic text primitives; remaining raw `Text` is justified display typography.
- [ ] No structural prop block (border + radius + padding, icon + gap + text, etc.) is duplicated verbatim across this file and existing components; repeats are extracted into a shared layout component decoupled from content.
- [ ] No raw `<Icon as={...}>` or icon-size numbers remain — every icon renders via the shared icon wrapper, with no unconfirmed size deviation kept around as a "tier," and no redundant explicit `flexShrink={0}`/`aria-hidden` left in place.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
