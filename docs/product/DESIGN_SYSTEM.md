# Material You (MD3) in this app

Tokens live in `app/globals.css` (`--md-*` and legacy aliases). **Roboto** is loaded in `app/[locale]/layout.tsx`. Default color mode is **light** (MD3 surface `#FFFBFE`).

- **Buttons**: pill-shaped (`--radius-pill`), state layers via opacity on primary
- **Cards**: `--md-surface-container`, 24px radius, subtle elevation
- **Inputs**: filled field — rounded top, 2px bottom border (`session-schedule-explorer`)
- **Landing**: `components/organisms/landing-page.tsx` on home

Toggle dark mode in the footer for the MD3 dark tonal palette.
