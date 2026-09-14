---
name: audit-i18n
description: Audit a page or component tree for hardcoded strings and missing translation keys.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "[path]"
---

# Skill: i18n Audit

## When to use
- After adding new visible UI text to a component or page.
- After creating a new component with user-facing strings.
- When manually checking translation coverage on a path.

## Inputs
- `$ARGUMENTS` (optional): path to directory or file to audit.
- If omitted: auto-detect from `git status` — `.tsx`/`.ts` files under `src/`. Fallback: `src/app` and `src/components`.

## Prerequisites
- Verify `next-intl` is listed in `package.json`.
- Confirm `locales/en.json` exists and is readable.
- If `$ARGUMENTS` is provided, confirm the path exists before scanning.

## Workflow
1. **Determine scope:** If `$ARGUMENTS` provided, use that path. Otherwise run `git status --short | awk '{print $2}'`, filter to `.tsx`/`.ts` files under `src/`. Fallback to `src/app` and `src/components`.
2. **Scan for hardcoded strings:** Identify raw strings in JSX — text content, `title`, `label`, `placeholder`, `alt` props. Exclude numbers, route paths, CSS class names, `data-*` attributes, and logger messages.
3. **Map namespace:** Identify the nearest translation namespace from the folder name (e.g., `about/_components/` → `AboutPage`).
4. **Cross-reference keys:** For each string found, grep `locales/en.json` to check if the key exists. Do NOT assume it exists.
5. **Check `'use client'` directive:** If the component uses `useTranslations` alongside client hooks (`useState`, `useEffect`, event handlers), verify `'use client'` is present. Server Components using only `useTranslations` do not need it.
6. **Orphan check:** Scan for keys in `locales/en.json` that no component references — flag as candidates for removal.

## Constraints
- Do NOT assume a translation key exists — grep `locales/en.json` to verify.
- Do NOT flag strings inside `console.log`, route paths, CSS class names, `type="submit"`, `data-*` attributes, or logger messages.
- Do NOT modify code or `locales/en.json` — identify issues only. Wait for explicit "fix these" follow-up.
- Do NOT flag Server Components using only `useTranslations` as missing `'use client'`.

## Output
- List of hardcoded user-facing strings with suggested namespace and key.
- List of missing keys in `locales/en.json`, categorised by namespace.
- Pass/Fail for the `'use client'` rule on each component in scope.
- List of orphaned keys in `locales/en.json`.

## Verification
- [ ] All hardcoded user-facing strings are listed with suggested namespace and key.
- [ ] All missing keys in `locales/en.json` are identified and categorised by namespace.
- [ ] Every component in scope has an explicit Pass or Fail for the `'use client'` rule.
- [ ] Orphaned keys in `locales/en.json` are listed separately.
