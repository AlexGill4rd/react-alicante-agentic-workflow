import { NewsList } from "@/app/news/_components/news-list";
import { Suspense } from "react";

export default function NewsPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">News</h1>
        <p className="text-[color:var(--text-muted)]">
          What&apos;s on the Hacker News front page right now.
        </p>
      </div>

      <Suspense
        fallback={<p className="text-[color:var(--text-muted)]">Loading…</p>}
      >
        <NewsList />
      </Suspense>
    </div>
  );
}
