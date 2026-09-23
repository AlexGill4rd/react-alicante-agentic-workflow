import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/tests/utils/render";

import { MenuToggleButton } from "./menu-toggle-button";

function renderToggle(isOpen: boolean, onToggle = vi.fn()) {
  render(
    <MenuToggleButton
      isOpen={isOpen}
      onToggle={onToggle}
      openLabel="Open menu"
      closeLabel="Close menu"
    />,
  );
  return onToggle;
}

describe("MenuToggleButton", () => {
  it("offers to open the menu and is collapsed when closed", () => {
    renderToggle(false);

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("offers to close the menu and is expanded when open", () => {
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
