"use client";

import { likeSession } from "@/app/actions/like-session";
import { Button } from "@/components/atoms/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

type LikeState = "idle" | "thanks" | "error";

interface SessionLikeButtonProps {
  sessionId: string;
}

export function SessionLikeButton({ sessionId }: SessionLikeButtonProps) {
  const t = useTranslations("Session.like");
  const [state, setState] = useState<LikeState>("idle");

  async function handleClick() {
    if (state !== "idle") {
      return;
    }

    const result = await likeSession(sessionId);
    setState(result.ok ? "thanks" : "error");
  }

  const label =
    state === "thanks"
      ? t("thanks")
      : state === "error"
        ? t("error")
        : t("button");

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleClick}
      disabled={state !== "idle"}
      aria-live="polite"
    >
      {label}
    </Button>
  );
}
