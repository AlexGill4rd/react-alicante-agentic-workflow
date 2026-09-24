import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { likeSession } from "./like-session";

describe("likeSession", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns false when the webhook URL is missing", async () => {
    expect(await likeSession("opening-keynote")).toEqual({ ok: false });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("posts sessionId and likedAt to the webhook", async () => {
    vi.stubEnv("FEEDBACK_WEBHOOK_URL", "https://example.com/hook");
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const result = await likeSession("opening-keynote");

    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/hook",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringMatching(
          /"sessionId":"opening-keynote".*"likedAt":".+"/,
        ),
      }),
    );
  });

  it("returns false when the webhook responds with an error status", async () => {
    vi.stubEnv("FEEDBACK_WEBHOOK_URL", "https://example.com/hook");
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);

    expect(await likeSession("opening-keynote")).toEqual({ ok: false });
  });
});
