import { describe, expect, it } from "vitest";

import type { Session } from "@/types/session";

import { filterSessions } from "./filter-sessions";

const base: Session = {
  id: "a",
  title: "React Server Components",
  speaker: "Ada Lovelace",
  track: "React",
  level: "intermediate",
  room: "Main Hall",
  startTime: "10:00",
  durationMinutes: 45,
  description: "Streaming UI patterns for the App Router.",
};

describe("filterSessions", () => {
  it("filters by track and level", () => {
    const result = filterSessions(
      [base, { ...base, id: "b", track: "Performance", level: "advanced" }],
      { query: "", track: "React", level: "all" },
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
  });

  it("matches search across title and description", () => {
    const result = filterSessions([base], {
      query: "streaming",
      track: "all",
      level: "all",
    });
    expect(result).toHaveLength(1);
  });
});
