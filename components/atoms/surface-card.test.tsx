import { describe, expect, it } from "vitest";

import { render, screen } from "@/tests/utils/render";

import { SurfaceCard } from "./surface-card";

describe("SurfaceCard", () => {
  it("renders the content it is given", () => {
    render(
      <SurfaceCard>
        <span>Opening Keynote</span>
      </SurfaceCard>,
    );

    expect(screen.getByText("Opening Keynote")).toBeInTheDocument();
  });
});
