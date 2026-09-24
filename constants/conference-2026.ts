/** React Alicante 2026 — schedule grid and “now” line use Europe/Madrid (CET/CEST). */
export const CONFERENCE_TIMEZONE = "Europe/Madrid";

export const CONFERENCE_DAYS = {
  fri: "2026-09-25",
  sat: "2026-09-26",
} as const;

export type ConferenceDayKey = keyof typeof CONFERENCE_DAYS;

/** Visible grid range (minutes align with hour labels). */
export const AGENDA_GRID_START_MINUTES = 8 * 60;
export const AGENDA_GRID_END_MINUTES = 19 * 60;

export const AGENDA_PX_PER_MINUTE = 2.1;
