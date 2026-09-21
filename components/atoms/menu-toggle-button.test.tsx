import { Menu, X } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/tests/utils/render";

import { IconToggleButton } from "./icon-toggle-button";

function renderToggle(isOn: boolean, onToggle = vi.fn()) {
  render(
    <IconToggleButton
      isOn={isOn}
      onToggle={onToggle}
      onIcon={X}
      offIcon={Menu}
      onLabel="Close menu"
      offLabel="Open menu"
    />,
  );
  return onToggle;
}

describe("IconToggleButton", () => {
  it("shows the off label and is collapsed when it is off", () => {
    renderToggle(false);

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("shows the on label and is expanded when it is on", () => {
    renderToggle(true);

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("calls onToggle when clicked", async () => {
    const onToggle = renderToggle(false);

    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
