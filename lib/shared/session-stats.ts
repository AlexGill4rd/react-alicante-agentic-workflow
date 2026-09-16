import type { Session } from "@/data/sessions";
import { timeToMinutes } from "@/lib/shared/schedule-time";

export interface TrackSessionCount {
  track: string;
  count: number;
}

export interface HourlySessionCount {
  hour: string;
  count: number;
}

/**
 * Counts sessions per track, preserving the order tracks first appear in
 * `sessions` so the chart order stays stable across renders.
 */
export function getSessionCountByTrack(
  sessions: Session[]
): TrackSessionCount[] {
  const counts = new Map<string, number>();

  for (const session of sessions) {
    counts.set(session.track, (counts.get(session.track) ?? 0) + 1);
  }

  return Array.from(counts, ([track, count]) => ({ track, count }));
}

/**
 * Buckets sessions by hour-of-day (derived from `startTime` via
 * `timeToMinutes`) and counts sessions per bucket, sorted chronologically.
 */
export function getSessionCountByHour(
  sessions: Session[]
): HourlySessionCount[] {
  const counts = new Map<number, number>();

  for (const session of sessions) {
    const hour = Math.floor(timeToMinutes(session.startTime) / 60);
    counts.set(hour, (counts.get(hour) ?? 0) + 1);
  }

  return Array.from(counts, ([hour, count]) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    count,
  })).sort((a, b) => a.hour.localeCompare(b.hour));
}
