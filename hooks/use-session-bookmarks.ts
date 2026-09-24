"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "ra-companion-bookmarks";

function readBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function useSessionBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks);

  const persist = useCallback((next: string[]) => {
    setBookmarks(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleBookmark = useCallback(
    (sessionId: string) => {
      persist(
        bookmarks.includes(sessionId)
          ? bookmarks.filter((id) => id !== sessionId)
          : [...bookmarks, sessionId],
      );
    },
    [bookmarks, persist],
  );

  const isBookmarked = useCallback(
    (sessionId: string) => bookmarks.includes(sessionId),
    [bookmarks],
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
