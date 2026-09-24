import type { Session } from "@/types/session";

export function formatSessionPlanText(sessions: Session[]): string {
  return sessions
    .map(
      (session) =>
        `${session.startTime} — ${session.title}\n${session.speaker} · ${session.room}`,
    )
    .join("\n\n");
}
