---
name: engineering-review-component
description: Review changed components, hooks, and utilities against project conventions and report Pass/Fail per checklist item.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "[filepath]"
---

# Skill: Review Component

## When to use
- Before completing any task that created or significantly modified a component, hook, or utility.
- When manually checking if a file follows codebase standards.
- Called by `/engineering-code-review` (feature-builder Phase 6) and `/engineering-refactorer`.

## Inputs
- `$ARGUMENTS` (optional): path to the file to review.
- If omitted: auto-detect from `git status` — `.ts`/`.tsx` files under `src/`. Fallback: ask which file to review.

## Prerequisites
- Confirm the file exists at the given path.
- Read `.claude/rules/` files for any project-specific overrides before flagging violations — some patterns are intentional.

## Workflow
1. **Determine scope:** If `$ARGUMENTS` provided, use that file. Otherwise run `git status --short | awk '{print $2}'`, filter to `.ts`/`.tsx` files under `src/` (skip `*.test.*`, reviewed as part of item 14).
2. **Check each item and record Pass, Fail, or N/A.** Items 1, 5–10 and 12 apply to components (`.tsx`) only — mark them N/A for hooks and utilities.
   1. **Component role** — Correct folder (primitives/ui/brand/forms/molecules/organisms/templates) or route's `_components/`?
   2. **Naming** — PascalCase components with matching directory and default export; camelCase hooks (`use` prefix) and utilities?
   3. **TypeScript** — Props interface defined? No `any` types? Components typed with `FC<Props>`?
   4. **Imports** — Using `@/` aliases? No deep relative paths across directory boundaries?
   5. **Styling** — Single approach per component (Chakra OR Tailwind OR SCSS)? No inline styles?
   6. **Typography composition** — Does each repeated text role use its semantic atom (`SectionTitle`, `SectionSubTitle`, `CardTitle`, `BodyText`, `LabelText`, or `CardMetaText`)? Flag copied raw `Text` recipes. Allow specialized `Text` for genuine hero, metric, or display typography when it is isolated in a focused component.
   7. **Layout composition** — Does any wrapper (pill/badge, icon+text row, stat block, card shell) duplicate a structural prop block (border + radius + padding, icon + gap + text) that already exists elsewhere in the codebase, instead of reusing or extracting a shared layout component? Is content (text, icons, copy) passed into layout components as `children`/props rather than hardcoded inside them? Allow a one-off wrapper when its alignment/spacing/semantics genuinely differ from existing patterns.
   8. **Icon usage** — Every icon rendered via `<PhilomathIcon icon={IconComponent} />`, never a raw `<Icon as={...}>`? Does any `boxSize` override `PhilomathIcon`'s default (`var(--icon-size)`) without a confirmed Figma spec justifying the deviation? Is `aria-hidden={false}` only set when the icon conveys something the adjacent text doesn't (e.g. an unlabeled row of payment/brand icons), not applied by habit?
   9. **Tokens** — No hardcoded colors (`#`, `rgb`, `hsl`)? Uses semantic tokens (`--text-*`, `--accent-*`, `--heading-hex`, `--subtitle-hex`)?
   10. **i18n** — All user-facing strings using `useTranslations` — text content and `title`, `label`, `placeholder`, `alt` props? No hardcoded display text?
   11. **SRP** — Does the file do one thing? Should sub-components or helpers be extracted?
   12. **Client directive** — `'use client'` present only if needed? Could the boundary be narrower? Note: Chakra UI components need it even with no hooks/handlers — its styling engine can't run in a pure Server Component (build-time crash, not caught by type-check/Jest). Don't flag/remove it just because the file has no hooks.
   13. **Code quality** — No `console.log`? No unused variables? Internal order correct (hooks → handlers → render)?
   14. **Tests** — Co-located `.test.tsx`/`.test.ts` exists? Components have a snapshot + at least one behavioral test? Edge cases covered (empty state, error state, missing props)?
   15. **Guard clauses** — Deeply nested conditionals that early returns would flatten?
   16. **Inline data** — Static data defined inside the file that belongs in `src/data/`?

## Constraints
- Do NOT suggest changes that alter external behavior — this is a convention review, not a refactor.
- Do NOT assume a test file, import, CSS variable, or translation key exists — check the filesystem, `variables.css`, or `locales/en.json`.
- Do NOT flag CSS class names, route paths, `type="submit"`, `data-*` attributes, or logger messages as hardcoded strings.
- Do NOT flag patterns explicitly documented in project rules as intentional conventions.
- Do NOT modify files — report findings only. Wait for explicit "fix these" follow-up.

## Output
- Per file: checklist with explicit Pass, Fail, or N/A for every item.
- Each Fail includes the line reference and a specific, actionable suggestion.
- Overall verdict: **Approve** / **Request Changes** / **Needs Discussion**.

## Verification
- [ ] Every checklist item has an explicit Pass, Fail, or N/A — no item skipped.
- [ ] Every Fail includes a line reference and an actionable suggestion.
- [ ] Overall verdict is stated.
