import { Badge } from "@/components/primitives/badge";
import { Link } from "@/i18n/navigation";
import { fetchSessionById, fetchSessions } from "@/services/sessions";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const sessions = await fetchSessions();
  return sessions.map((session) => ({ id: session.id }));
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await fetchSessionById(id);

  if (!session) {
    notFound();
  }

  return (
    <Flex direction="column" gap="6" flex="1" width="full">
      <Link href="/sessions">
        <Text
          fontSize="sm"
          width="fit-content"
          color="var(--text-muted)"
          _hover={{ textDecoration: "underline" }}
        >
          ← Back to schedule
        </Text>
      </Link>

      <Flex direction="column" gap="3">
        <Flex align="center" gap="3">
          <Badge>{session.track}</Badge>
          <Text fontSize="sm" color="var(--text-muted)">
            {session.startTime} · {session.durationMinutes} min · {session.room}
          </Text>
        </Flex>
        <Heading as="h1" fontSize="3xl" fontWeight="bold">
          {session.title}
        </Heading>
        <Text color="var(--text-muted)">{session.speaker}</Text>
      </Flex>

      <Text fontSize="md" lineHeight="relaxed" maxWidth="2xl">
        {session.description}
      </Text>
    </Flex>
  );
}
