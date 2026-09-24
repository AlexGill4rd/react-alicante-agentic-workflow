import { render, screen } from "@/tests/utils/render";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { likeSession } from "@/app/actions/like-session";

import { SessionLikeButton } from "./session-like-button";

vi.mock("@/app/actions/like-session", () => ({
  likeSession: vi.fn(),
}));

describe("SessionLikeButton", () => {
  it("shows thanks after a successful like", async () => {
    vi.mocked(likeSession).mockResolvedValue({ ok: true });

    render(<SessionLikeButton sessionId="opening-keynote" />);

    await userEvent.click(screen.getByRole("button", { name: "👍 Like" }));

    expect(screen.getByRole("button", { name: "Thanks!" })).toBeDisabled();
  });

  it("shows an error message when the action fails", async () => {
    vi.mocked(likeSession).mockResolvedValue({ ok: false });

    render(<SessionLikeButton sessionId="opening-keynote" />);

    await userEvent.click(screen.getByRole("button", { name: "👍 Like" }));

    expect(
      screen.getByRole("button", { name: "Something went wrong" }),
    ).toBeDisabled();
  });
});
