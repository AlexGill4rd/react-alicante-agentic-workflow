import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Badge, Flex, Grid, Heading, Text } from "@chakra-ui/react";

export function FeaturedSessions({ sessions }: { sessions: Session[] }) {
  return (
    <Flex direction="column" gap="6">
      <Flex align="center" justify="space-between">
        <Heading as="h2" fontSize="2xl" fontWeight="bold">
          Featured sessions
        </Heading>
        <Link href="/sessions">
          <Text fontSize="sm" color="var(--text-muted)">
            View full schedule →
          </Text>
        </Link>
      </Flex>

      <Grid gap="4" templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}>
        {sessions.map((session) => (
          <Link key={session.id} href={`/sessions/${session.id}`}>
            <Card
              height="full"
              transition="border-color 0.2s"
              _hover={{ borderColor: "var(--card-border-hover-hex)" }}
            >
              <CardHeader>
                <Badge width="fit-content">{session.track}</Badge>
                <CardTitle fontSize="md">{session.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text fontSize="sm" color="var(--text-muted)">
                  {session.startTime} · {session.speaker}
                </Text>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Grid>
    </Flex>
  );
}
