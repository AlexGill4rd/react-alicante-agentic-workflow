import type { Session } from "@/data/sessions";
import { timeToMinutes } from "@/lib/shared/schedule-time";

/** Fixed room column order for the timeline view. */
export const TIMELINE_ROOMS = [
  "Main Hall",
  "Workshop Room A",
  "Room B",
] as const;

export type TimelineRoom = (typeof TIMELINE_ROOMS)[number];

export interface TimelineBounds {
  /** Minutes since midnight the timeline grid starts at (rounded to the hour). */
  startMinutes: number;
  /** Minutes since midnight the timeline grid ends at (rounded to the hour). */
  endMinutes: number;
}

/**
 * Computes the earliest/latest minute-of-day the timeline grid needs to
 * cover, rounded out to whole hours so hour gridlines land cleanly.
 */
export function getTimelineBounds(sessions: Session[]): TimelineBounds {
  if (sessions.length === 0) {
    return { startMinutes: 0, endMinutes: 0 };
  }

  const starts = sessions.map((session) => timeToMinutes(session.startTime));
  const ends = sessions.map(
    (session) => timeToMinutes(session.startTime) + session.durationMinutes
  );

  return {
    startMinutes: Math.floor(Math.min(...starts) / 60) * 60,
    endMinutes: Math.ceil(Math.max(...ends) / 60) * 60,
  };
}

/**
 * Groups sessions by room, keyed to the fixed `TIMELINE_ROOMS` order.
 * A session whose `room` doesn't match one of the known columns is dropped
 * rather than crashing the layout.
 */
export function getSessionsByRoom(
  sessions: Session[]
): Record<TimelineRoom, Session[]> {
  const byRoom = Object.fromEntries(
    TIMELINE_ROOMS.map((room) => [room, [] as Session[]])
  ) as Record<TimelineRoom, Session[]>;

  for (const session of sessions) {
    if ((TIMELINE_ROOMS as readonly string[]).includes(session.room)) {
      byRoom[session.room as TimelineRoom].push(session);
    }
  }

  return byRoom;
}
