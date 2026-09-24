import type { Session, SessionLevel, Track } from "@/types/session";

export interface SessionFilters {
  query: string;
  track: Track | "all";
  level: SessionLevel | "all";
}

export function filterSessions(
  sessions: Session[],
  filters: SessionFilters,
): Session[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return sessions.filter((session) => {
    if (filters.track !== "all" && session.track !== filters.track) {
      return false;
    }
    if (filters.level !== "all" && session.level !== filters.level) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      session.title,
      session.speaker,
      session.description,
      session.room,
      session.track,
      session.level,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
