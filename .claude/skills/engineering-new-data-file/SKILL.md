---
name: engineering-new-data-file
description: Create a typed static data file in `data/` with an exported interface and const array or object.

metadata:
  domain: engineering
  trigger: both
  after: []

argument-hint: "<dataName>"
---

# Skill: New Data File

## When to use
- When adding new static content that components will consume.
- When a component has static data defined inline that should be extracted.

## Inputs
- `$ARGUMENTS` (required): camelCase data file name (e.g., `skillPaths`, `testimonials`).
- If omitted: ask what data to create and its structure.

## Prerequisites
- Confirm `$ARGUMENTS` is camelCase — correct it before proceeding.
- Grep `data/` to confirm no similar file already exists.

## Workflow
1. **Read existing data files** in `data/` to understand the established patterns.
2. **Create `data/$ARGUMENTS.ts`:**
   - Define a TypeScript interface for the data shape.
   - Export a typed `const` array or object.
   - Use `as const` where appropriate for literal types.
   - Keep data separate from any display or formatting logic.
3. **Export the interface** from the file, or add it to `types/` if it will be reused across multiple components.

## Constraints
- No display logic — data files contain raw data only; formatting, sorting, or filtering belongs in the component or a utility.
- No React imports — data files are pure TypeScript.
- No `any` types — always define a typed interface for the data shape.
- No inline data in components — if a component has static data defined inside it, move it here.

## Output
- `data/$ARGUMENTS.ts` — typed data file with exported interface and const.

## Verification
- [ ] `pnpm type-check` — zero new errors.
- [ ] The interface is exported and usable by components without casting.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
