"use client";

import { Button } from "@/components/atoms/button";
import { useSessionBookmarks } from "@/hooks/use-session-bookmarks";
import { useTranslations } from "next-intl";

interface SessionBookmarkButtonProps {
  sessionId: string;
}

export function SessionBookmarkButton({
  sessionId,
}: SessionBookmarkButtonProps) {
  const t = useTranslations("Session.bookmark");
  const { isBookmarked, toggleBookmark } = useSessionBookmarks();
  const saved = isBookmarked(sessionId);

  return (
    <Button
      type="button"
      variant={saved ? "default" : "secondary"}
      onClick={() => toggleBookmark(sessionId)}
      aria-pressed={saved}
    >
      {saved ? t("saved") : t("save")}
    </Button>
  );
}
