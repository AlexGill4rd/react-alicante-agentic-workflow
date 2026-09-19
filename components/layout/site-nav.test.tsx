import { describe, expect, it, vi } from "vitest";

import { render, screen, userEvent } from "@/tests/utils/render";

import { SiteNav } from "./site-nav";

const { usePathname, replace } = vi.hoisted(() => ({
  usePathname: vi.fn(() => "/"),
  replace: vi.fn(),
}));

// next-intl's navigation helpers wrap these, so the real module has to keep
// its other exports (redirect, permanentRedirect) or importing them throws.
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname,
  useRouter: () => ({
    replace,
    push: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("SiteNav", () => {
  it("links to the schedule and marks it active on a session page", () => {
    usePathname.mockReturnValue("/sessions/opening-keynote");

    render(<SiteNav />);

    const schedule = screen.getByRole("link", { name: "Schedule" });
    expect(schedule).toHaveAttribute("href", "/en/sessions");
    expect(schedule).toHaveAttribute("aria-current", "page");
  });

  it("does not mark the schedule active on other pages", () => {
    usePathname.mockReturnValue("/news");

    render(<SiteNav />);

    expect(screen.getByRole("link", { name: "Schedule" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("switches locale by navigating to the same route", async () => {
    usePathname.mockReturnValue("/sessions");

    render(<SiteNav />);
    await userEvent.click(screen.getByRole("button", { name: "es" }));

    // next-intl resolves the locale into the href before it navigates.
    expect(replace).toHaveBeenCalledWith("/es/sessions");
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
