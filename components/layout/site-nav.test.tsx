import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/tests/utils/render";

import { SiteNav } from "./site-nav";

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => "/"),
}));

vi.mock("next/navigation", () => ({ usePathname }));

describe("SiteNav", () => {
  it("links to the schedule and marks it active on a session page", () => {
    usePathname.mockReturnValue("/sessions/opening-keynote");

    render(<SiteNav />);

    const schedule = screen.getByRole("link", { name: "Schedule" });
    expect(schedule).toHaveAttribute("href", "/sessions");
    expect(schedule).toHaveAttribute("aria-current", "page");
  });

  it("does not mark the schedule active on other pages", () => {
    usePathname.mockReturnValue("/news");

    render(<SiteNav />);

    expect(screen.getByRole("link", { name: "Schedule" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("translates the links when the language changes", async () => {
    usePathname.mockReturnValue("/");

    render(<SiteNav />);
    await userEvent.click(screen.getByRole("button", { name: "es" }));

    expect(screen.getByRole("link", { name: "Horario" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Schedule" }),
    ).not.toBeInTheDocument();
  });

  it("hides the nav links behind the menu button on small screens", async () => {
    usePathname.mockReturnValue("/");

    render(<SiteNav />);
    const menuButton = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(menuButton);

    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toBeInTheDocument();
    // Desktop row and open menu both render the links.
    expect(screen.getAllByRole("link", { name: "Schedule" })).toHaveLength(2);
  });
});
