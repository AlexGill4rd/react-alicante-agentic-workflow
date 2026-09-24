import type { Session } from "@/types/session";

/** Placeholder speaker on the closing panel — not a real person. */
export const CLOSING_PANEL_SPEAKER = "Full speaker lineup";

export interface SpeakerWithSessions {
  name: string;
  sessions: Session[];
}

/**
 * Groups sessions by speaker, drops the closing-panel placeholder, and sorts
 * speakers by name. Each speaker's sessions are sorted by start time.
 */
export function groupSessionsBySpeaker(
  sessions: Session[],
): SpeakerWithSessions[] {
  const bySpeaker = new Map<string, Session[]>();

  for (const session of sessions) {
    if (session.speaker === CLOSING_PANEL_SPEAKER) continue;

    const list = bySpeaker.get(session.speaker) ?? [];
    list.push(session);
    bySpeaker.set(session.speaker, list);
  }

  return Array.from(bySpeaker, ([name, speakerSessions]) => ({
    name,
    sessions: [...speakerSessions].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    ),
  })).sort((a, b) => a.name.localeCompare(b.name));
}
