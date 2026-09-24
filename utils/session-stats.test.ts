import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { getSessionCountByHour, getSessionCountByTrack } from "./session-stats";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a-session",
    title: "A session",
    speaker: "A speaker",
    track: "React",
    level: "beginner",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("getSessionCountByTrack", () => {
  it("counts sessions per track, in the order tracks first appear", () => {
    const counts = getSessionCountByTrack([
      session({ track: "React" }),
      session({ track: "Performance" }),
      session({ track: "React" }),
    ]);

    expect(counts).toEqual([
      { track: "React", count: 2 },
      { track: "Performance", count: 1 },
    ]);
  });

  it("returns nothing for no sessions", () => {
    expect(getSessionCountByTrack([])).toEqual([]);
  });
});

describe("getSessionCountByHour", () => {
  it("buckets sessions by hour and sorts them chronologically", () => {
    const counts = getSessionCountByHour([
      session({ startTime: "14:00" }),
      session({ startTime: "09:45" }),
      session({ startTime: "09:00" }),
    ]);

    expect(counts).toEqual([
      { hour: "09:00", count: 2 },
      { hour: "14:00", count: 1 },
    ]);
  });
});
