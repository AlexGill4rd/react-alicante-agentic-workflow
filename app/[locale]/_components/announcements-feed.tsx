import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import type { Announcement } from "@/services/announcements";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export async function AnnouncementsFeed({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const t = await getTranslations("Home.announcements");

  if (announcements.length === 0) {
    return null;
  }

  return (
    <Flex as="section" direction="column" gap="4" width="full">
      <Flex direction="column" gap="1">
        <Text
          fontSize="xs"
          fontFamily="mono"
          letterSpacing="0.16em"
          textTransform="uppercase"
          color="var(--text-muted)"
        >
          {t("eyebrow")}
        </Text>
        <Heading
          as="h2"
          fontSize="2xl"
          fontWeight="semibold"
          letterSpacing="tight"
        >
          {t("title")}
        </Heading>
      </Flex>
      <Flex direction="column" gap="3">
        {announcements.slice(0, 3).map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle fontSize="md">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text
                fontSize="sm"
                color="var(--text-muted)"
                lineHeight="relaxed"
              >
                {item.body}
              </Text>
            </CardContent>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
}
