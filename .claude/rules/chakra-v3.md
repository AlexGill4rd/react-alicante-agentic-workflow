# Chakra UI v3

Lessons from the v2 → v3 migration (#292). Each one caused a real visual or behavior bug that type-check, lint and Jest all missed.

## Theme and cascade

- The system is created with `createSystem(defaultConfig, config, { disableLayers: true })` in `src/styles/settings/theme.ts`. Don't remove `disableLayers`: layered Chakra CSS loses to every unlayered rule, so Tailwind preflight (`border-width: 0`) erases input borders and the global `:focus-visible` ring outlines menus.
- Put recipe overrides in the **variant** Chakra applies by default (e.g. `variants.variant.plain`, `variants.size.md`), not in `base`. Variant styles override base, so a base-only override silently does nothing.
- Custom variant names (e.g. `variant="dropdown"`) don't type-check without `npx @chakra-ui/cli typegen`. Prefer overriding the default variant.
- `globalCss` must not set a background on `html` or `body`: it overrides `body.css`'s page gradient.

## Components

- Chakra alone is not a reason for `'use client'`: v3 ships its components as client components, so Server Components can render them (verified with `pnpm build` on an SSG page, 2026-09-16).
- Icons as `Button` children are fine. The old v2 Turbopack dev hang (icon props in a `useForm()` module) did not reproduce on v3 (one run, Next 16.2.3). `ButtonWithSiblingIcon` is no longer required for that reason.
- A Chakra `Link` (or other component) whose look comes from a scss/Tailwind class needs `unstyled`. Otherwise v3 base styles (radius, display, color) override the class. Pass `color="var(--text-primary)"` if the v2 look relied on Chakra's link color.
- Native inputs keep `onChange`: `Input`, `Textarea`, `NativeSelect.Field`. Only Ark-based components use `onValueChange` / `onCheckedChange` (e.g. `Checkbox.Root`).
- `Dialog.CloseTrigger` / `Drawer.CloseTrigger` render nothing by themselves. Use `asChild` with `<CloseButton />`.
- `Menu.Item` needs a `value`. For links use `asChild` with the link element as the child.
- `required` goes on `Field.Root`, not on `NativeSelect.Field`.
- Icons: use `react-icons` via `PhilomathIcon`. For v2 icon parity, `react-icons/md` has identical paths (`MdExpandMore`, `MdArrowForward`, `MdMenu`).
- Toasts: `toaster.create({ title, description, type, closable })` from `@/components/chakra/toaster`. There is no `useToast`.
- Color mode: `useColorMode` from `@/components/chakra/color-mode` (wraps `next-themes`). `variables.css` light mode depends on the `data-theme` attribute it sets.

## Testing

- Import from `@/tests/utils/render`, never `@testing-library/react` directly. v3 components throw without `ChakraProvider`.
- Don't assert Chakra styles with `toHaveStyle`. v3 emits tokenized CSS variables (`var(--evangelia-colors-transparent)`) that jsdom can't resolve. Verify visuals with Playwright instead.
- Ark state updates are async. After `fireEvent` on a checkbox, dialog or menu, use `await waitFor(...)`.

## Codemod traps (`@chakra-ui/codemod`)

If you run the codemod again (or on a new project), check its output for these:
- `mx="0 auto"`: v2 dropped this invalid value (the element stayed centered); v3 emits valid `margin-inline: 0 auto` (left-aligned). Use `mx="auto"`.
- Conditional `isExternal={cond}` becomes an unconditional `target="_blank"`.
- `onChange` wrongly renamed to `onValueChange` on native inputs.
- `as` props renamed on your own components' prop interfaces, not just Chakra ones.
- JSX text entities (`&nbsp;`) and spacing lost; `// TODO` comments inserted as JSX text.
- `noOfLines` renamed to `lineClamp` on `SkeletonText`, where v3 still uses `noOfLines`.
