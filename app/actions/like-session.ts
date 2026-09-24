"use server";

export type LikeSessionResult = { ok: true } | { ok: false };

export async function likeSession(
  sessionId: string,
): Promise<LikeSessionResult> {
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("[likeSession] FEEDBACK_WEBHOOK_URL is not set");
    return { ok: false };
  }

  if (!sessionId.trim()) {
    return { ok: false };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        likedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("[likeSession] webhook responded with", response.status);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("[likeSession] request failed:", error);
    return { ok: false };
  }
}
