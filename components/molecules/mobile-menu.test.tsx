import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";

import { MobileMenu } from "./mobile-menu";

describe("MobileMenu", () => {
  it("renders the content it is given", () => {
    render(
      <MobileMenu>
        <span>Schedule</span>
        <span>News</span>
      </MobileMenu>,
    );

    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
  });
});
