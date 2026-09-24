import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { formatSessionPlanText } from "./format-session-plan";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a",
    title: "Talk A",
    speaker: "Speaker A",
    track: "React",
    level: "beginner",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 30,
    description: "",
    ...overrides,
  };
}

describe("formatSessionPlanText", () => {
  it("formats each session on two lines separated by blank lines", () => {
    const text = formatSessionPlanText([
      session({ id: "1", startTime: "09:00", title: "Opening" }),
      session({
        id: "2",
        startTime: "10:00",
        title: "Workshop",
        speaker: "B",
        room: "Room B",
      }),
    ]);

    expect(text).toBe(
      "09:00 — Opening\nSpeaker A · Main Hall\n\n10:00 — Workshop\nB · Room B",
    );
  });

  it("returns an empty string for no sessions", () => {
    expect(formatSessionPlanText([])).toBe("");
  });
});
