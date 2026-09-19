import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { fetchFrontPageNews } from "@/services/news";
import { formatDate } from "@/utils/format-date";
import { Flex, Link, Text } from "@chakra-ui/react";

export async function NewsList() {
  let stories;
  try {
    stories = await fetchFrontPageNews();
  } catch {
    return (
      <Text color="var(--error-hex)">
        Couldn&apos;t load news right now. Check that NEWS_API_URL is set.
      </Text>
    );
  }

  return (
    <Flex as="ul" direction="column" gap="4" listStyleType="none">
      {stories.map((story) => (
        <li key={story.id}>
          <Card>
            <CardHeader>
              <CardTitle fontSize="md">
                <Link
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  color="var(--text-primary)"
                  _hover={{ color: "var(--accent-hex)" }}
                >
                  {story.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text fontSize="sm" color="var(--text-muted)">
                {story.points} points · {story.commentCount} comments ·{" "}
                {story.author} · {formatDate(story.createdAt)}
              </Text>
            </CardContent>
          </Card>
        </li>
      ))}
    </Flex>
  );
}
