import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";
import type { Session } from "@/types/session";

import { SessionTimeline } from "./session-timeline";

function session(overrides: Partial<Session> = {}): Session {
  return {
    id: "a-session",
    title: "A session",
    speaker: "A speaker",
    track: "React",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 45,
    description: "",
    ...overrides,
  };
}

describe("SessionTimeline", () => {
  it("shows a column per room", () => {
    render(<SessionTimeline sessions={[session()]} />);

    expect(screen.getByText("Main Hall")).toBeInTheDocument();
    expect(screen.getByText("Workshop Room A")).toBeInTheDocument();
    expect(screen.getByText("Room B")).toBeInTheDocument();
  });

  it("links each session to its detail page", () => {
    render(
      <SessionTimeline
        sessions={[
          session({ id: "opening-keynote", title: "Opening Keynote" }),
        ]}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Opening Keynote/ }),
      // Locale-aware Link: the prefix is part of the href.
    ).toHaveAttribute("href", "/en/sessions/opening-keynote");
  });

  it("marks hours from the earliest start to the latest end", () => {
    render(
      <SessionTimeline
        sessions={[
          session({ startTime: "09:30", durationMinutes: 30 }),
          session({ id: "later", startTime: "11:15", durationMinutes: 45 }),
        ]}
      />,
    );

    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
  });

  it("ignores sessions in a room that has no column", () => {
    render(
      <SessionTimeline
        sessions={[session({ title: "Hallway chat", room: "Hallway" })]}
      />,
    );

    expect(screen.queryByText("Hallway chat")).not.toBeInTheDocument();
  });
});
