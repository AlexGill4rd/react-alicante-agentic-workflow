import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Flex, Text } from "@chakra-ui/react";

export function SpeakerCard({
  name,
  sessions,
}: {
  name: string;
  sessions: Session[];
}) {
  return (
    <Card height="full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex
          as="ul"
          direction="column"
          gap="2"
          listStyleType="none"
          margin="0"
          padding="0"
        >
          {sessions.map((session) => (
            <Flex as="li" key={session.id}>
              <Link href={`/sessions/${session.id}`}>
                <Text
                  fontSize="sm"
                  color="var(--text-muted)"
                  transition="color 0.2s"
                  _hover={{ color: "var(--accent-hex)" }}
                >
                  {session.startTime} · {session.title}
                </Text>
              </Link>
            </Flex>
          ))}
        </Flex>
      </CardContent>
    </Card>
  );
}
