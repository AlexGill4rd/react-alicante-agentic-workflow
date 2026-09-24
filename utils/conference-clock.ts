import {
  AGENDA_GRID_END_MINUTES,
  AGENDA_GRID_START_MINUTES,
  CONFERENCE_DAYS,
  CONFERENCE_TIMEZONE,
  type ConferenceDayKey,
} from "@/constants/conference-2026";
import { minutesToTime, timeToMinutes } from "@/utils/schedule-time";

export interface ConferenceNow {
  /** YYYY-MM-DD in conference timezone */
  dateIso: string;
  minutes: number;
  timeLabel: string;
  activeDay: ConferenceDayKey | null;
}

function partsInTimeZone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));

  return {
    dateIso: `${year}-${month}-${day}`,
    minutes: hour * 60 + minute,
    timeLabel: minutesToTime(hour * 60 + minute),
  };
}

export function getConferenceNow(date = new Date()): ConferenceNow {
  const { dateIso, minutes, timeLabel } = partsInTimeZone(
    date,
    CONFERENCE_TIMEZONE,
  );

  let activeDay: ConferenceDayKey | null = null;
  if (dateIso === CONFERENCE_DAYS.fri) activeDay = "fri";
  if (dateIso === CONFERENCE_DAYS.sat) activeDay = "sat";

  return { dateIso, minutes, timeLabel, activeDay };
}

export function isNowLineVisible(now: ConferenceNow): boolean {
  if (!now.activeDay) return false;
  return (
    now.minutes >= AGENDA_GRID_START_MINUTES &&
    now.minutes <= AGENDA_GRID_END_MINUTES
  );
}

export function nowLineTopPx(
  now: ConferenceNow,
  startMinutes: number,
  pxPerMinute: number,
): number {
  return (now.minutes - startMinutes) * pxPerMinute;
}

export function filterAgendaByQuery<T extends { titleKey: string }>(
  titleForKey: (titleKey: string) => string,
  query: string,
  slots: T[],
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return slots;
  return slots.filter((slot) =>
    titleForKey(slot.titleKey).toLowerCase().includes(normalized),
  );
}

export function endTimeLabel(
  startTime: string,
  durationMinutes: number,
): string {
  return minutesToTime(timeToMinutes(startTime) + durationMinutes);
}
