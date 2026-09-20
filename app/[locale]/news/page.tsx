import { NewsList } from "@/app/[locale]/news/_components/news-list";
import { PageHeading } from "@/components/atoms/page-heading";
import { Flex, Text } from "@chakra-ui/react";
import { Suspense } from "react";

export default function NewsPage() {
  return (
    <Flex direction="column" gap="8" flex="1" width="full">
      <PageHeading title="News">
        What&apos;s on the Hacker News front page right now.
      </PageHeading>

      <Suspense fallback={<Text color="var(--text-muted)">Loading…</Text>}>
        <NewsList />
      </Suspense>
    </Flex>
  );
}
