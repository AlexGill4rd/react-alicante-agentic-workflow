import { describe, expect, it } from "vitest";

import { CONFERENCE_DAYS } from "@/constants/conference-2026";
import {
  filterAgendaByQuery,
  getConferenceNow,
  isNowLineVisible,
} from "@/utils/conference-clock";

describe("getConferenceNow", () => {
  it("maps conference Friday to activeDay fri", () => {
    const fridayMorning = new Date("2026-09-25T08:00:00+02:00");
    const now = getConferenceNow(fridayMorning);
    expect(now.dateIso).toBe(CONFERENCE_DAYS.fri);
    expect(now.activeDay).toBe("fri");
  });
});

describe("isNowLineVisible", () => {
  it("is hidden outside conference days", () => {
    const before = getConferenceNow(new Date("2026-09-24T12:00:00+02:00"));
    expect(isNowLineVisible(before)).toBe(false);
  });

  it("is visible during conference hours", () => {
    const during = getConferenceNow(new Date("2026-09-25T11:30:00+02:00"));
    expect(isNowLineVisible(during)).toBe(true);
  });
});

describe("filterAgendaByQuery", () => {
  it("filters slot titles case-insensitively", () => {
    const slots = [{ titleKey: "coffeeBreak" }, { titleKey: "fri0900" }];
    const filtered = filterAgendaByQuery(
      (key) => (key === "coffeeBreak" ? "Coffee break" : "React talk"),
      "coffee",
      slots,
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].titleKey).toBe("coffeeBreak");
  });
});
