import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { CLOSING_PANEL_SPEAKER, groupSessionsBySpeaker } from "./speakers";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a-session",
    title: "A session",
    speaker: "Ada Lovelace",
    track: "React",
    level: "beginner",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("groupSessionsBySpeaker", () => {
  it("groups sessions by speaker, sorted by name", () => {
    const grouped = groupSessionsBySpeaker([
      session({ id: "b", speaker: "Zoe Zeta", startTime: "10:00" }),
      session({ id: "a", speaker: "Ada Lovelace", startTime: "09:00" }),
      session({ id: "c", speaker: "Ada Lovelace", startTime: "14:00" }),
    ]);

    expect(grouped).toEqual([
      {
        name: "Ada Lovelace",
        sessions: [
          session({ id: "a", speaker: "Ada Lovelace", startTime: "09:00" }),
          session({ id: "c", speaker: "Ada Lovelace", startTime: "14:00" }),
        ],
      },
      {
        name: "Zoe Zeta",
        sessions: [
          session({ id: "b", speaker: "Zoe Zeta", startTime: "10:00" }),
        ],
      },
    ]);
  });

  it("excludes the closing panel placeholder speaker", () => {
    const grouped = groupSessionsBySpeaker([
      session({ speaker: CLOSING_PANEL_SPEAKER, id: "panel" }),
      session({ speaker: "Ada Lovelace", id: "talk" }),
    ]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.name).toBe("Ada Lovelace");
  });
});
