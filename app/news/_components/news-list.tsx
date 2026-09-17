import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";
import { fetchFrontPageNews } from "@/services/news";
import { formatDate } from "@/utils/format-date";

export async function NewsList() {
  let stories;
  try {
    stories = await fetchFrontPageNews();
  } catch {
    return (
      <p className="text-[color:var(--error-hex)]">
        Couldn&apos;t load news right now. Check that NEWS_API_URL is set.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {stories.map((story) => (
        <li key={story.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[color:var(--accent-hex)]"
                >
                  {story.title}
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[color:var(--text-muted)]">
                {story.points} points · {story.commentCount} comments ·{" "}
                {story.author} · {formatDate(story.createdAt)}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
