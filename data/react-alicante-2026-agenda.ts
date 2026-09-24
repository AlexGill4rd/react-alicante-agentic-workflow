import type { ConferenceDayKey } from "@/constants/conference-2026";

export type AgendaSlotKind =
  "welcome" | "session" | "break" | "lunch" | "lightning" | "social";

/** `both` = one block spanning Friday and Saturday columns (shared breaks). */
export type AgendaDayColumn = ConferenceDayKey | "both";

export interface AgendaSlot {
  id: string;
  day: AgendaDayColumn;
  startTime: string;
  durationMinutes: number;
  kind: AgendaSlotKind;
  /** i18n key under Schedule.agenda.slots */
  titleKey: string;
}

export const REACT_ALICANTE_2026_AGENDA: AgendaSlot[] = [
  {
    id: "welcome",
    day: "both",
    startTime: "08:55",
    durationMinutes: 5,
    kind: "welcome",
    titleKey: "welcome",
  },
  {
    id: "fri-0900",
    day: "fri",
    startTime: "09:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri0900",
  },
  {
    id: "sat-0900",
    day: "sat",
    startTime: "09:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat0900",
  },
  {
    id: "fri-0930",
    day: "fri",
    startTime: "09:30",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri0930",
  },
  {
    id: "sat-0930",
    day: "sat",
    startTime: "09:30",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat0930",
  },
  {
    id: "fri-1000",
    day: "fri",
    startTime: "10:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1000",
  },
  {
    id: "sat-1000",
    day: "sat",
    startTime: "10:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1000",
  },
  {
    id: "coffee-1030",
    day: "both",
    startTime: "10:30",
    durationMinutes: 30,
    kind: "break",
    titleKey: "coffeeBreak",
  },
  {
    id: "fri-1100",
    day: "fri",
    startTime: "11:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1100",
  },
  {
    id: "sat-1100",
    day: "sat",
    startTime: "11:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1100",
  },
  {
    id: "fri-1130",
    day: "fri",
    startTime: "11:30",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1130",
  },
  {
    id: "sat-1130",
    day: "sat",
    startTime: "11:30",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1130",
  },
  {
    id: "fri-1200",
    day: "fri",
    startTime: "12:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1200",
  },
  {
    id: "sat-1200",
    day: "sat",
    startTime: "12:00",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1200",
  },
  {
    id: "fri-1230",
    day: "fri",
    startTime: "12:30",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1230",
  },
  {
    id: "sat-1230",
    day: "sat",
    startTime: "12:30",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1230",
  },
  {
    id: "lunch",
    day: "both",
    startTime: "13:00",
    durationMinutes: 85,
    kind: "lunch",
    titleKey: "lunch",
  },
  {
    id: "lightning",
    day: "both",
    startTime: "14:25",
    durationMinutes: 105,
    kind: "lightning",
    titleKey: "lightning",
  },
  {
    id: "coffee-1610",
    day: "both",
    startTime: "16:10",
    durationMinutes: 30,
    kind: "break",
    titleKey: "coffeeBreak",
  },
  {
    id: "fri-1640",
    day: "fri",
    startTime: "16:40",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1640",
  },
  {
    id: "sat-1640",
    day: "sat",
    startTime: "16:40",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1640",
  },
  {
    id: "fri-1710",
    day: "fri",
    startTime: "17:10",
    durationMinutes: 30,
    kind: "session",
    titleKey: "fri1710",
  },
  {
    id: "sat-1710",
    day: "sat",
    startTime: "17:10",
    durationMinutes: 30,
    kind: "session",
    titleKey: "sat1710",
  },
  {
    id: "fri-1740",
    day: "fri",
    startTime: "17:40",
    durationMinutes: 35,
    kind: "session",
    titleKey: "fri1740",
  },
  {
    id: "sat-1740",
    day: "sat",
    startTime: "17:40",
    durationMinutes: 35,
    kind: "session",
    titleKey: "sat1740",
  },
  {
    id: "networking",
    day: "both",
    startTime: "18:15",
    durationMinutes: 45,
    kind: "social",
    titleKey: "networking",
  },
];
