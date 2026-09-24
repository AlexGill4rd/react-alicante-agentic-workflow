import { Badge } from "@/components/atoms/badge";
import { InteractiveSurface } from "@/components/atoms/interactive-surface";
import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export async function FeaturedSessions({ sessions }: { sessions: Session[] }) {
  const t = await getTranslations("Home.featured");

  return (
    <Flex as="section" direction="column" gap="8" width="full">
      <Flex
        align={{ base: "flex-start", sm: "center" }}
        justify="space-between"
        direction={{ base: "column", sm: "row" }}
        gap="4"
      >
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
        <Link href="/sessions">
          <Text
            fontSize="sm"
            color="var(--text-secondary)"
            transition="color var(--transition-fast)"
            _hover={{ color: "var(--accent-hex)" }}
          >
            {t("viewAll")}
          </Text>
        </Link>
      </Flex>

      <Grid
        gap="4"
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(6, 1fr)",
        }}
        autoRows={{ lg: "minmax(140px, auto)" }}
      >
        {sessions.map((session, index) => {
          const isHero = index === 0;
          return (
            <Box
              key={session.id}
              gridColumn={{ lg: isHero ? "span 4" : "span 2" }}
              gridRow={{ lg: isHero ? "span 2" : "span 1" }}
              height="full"
            >
              <Box height="full">
                <Link href={`/sessions/${session.id}`}>
                  <InteractiveSurface height="full">
                    <Flex
                      direction="column"
                      gap="3"
                      height="full"
                      justify="space-between"
                    >
                      <Flex direction="column" gap="3">
                        <Box alignSelf="flex-start">
                          <Badge>{session.track}</Badge>
                        </Box>
                        <Heading
                          as="h3"
                          fontSize={isHero ? "2xl" : "lg"}
                          fontWeight="semibold"
                          letterSpacing="tight"
                          lineHeight="snug"
                        >
                          {session.title}
                        </Heading>
                      </Flex>
                      <Text fontSize="sm" color="var(--text-muted)">
                        {session.startTime} · {session.speaker}
                      </Text>
                    </Flex>
                  </InteractiveSurface>
                </Link>
              </Box>
            </Box>
          );
        })}
      </Grid>
    </Flex>
  );
}
