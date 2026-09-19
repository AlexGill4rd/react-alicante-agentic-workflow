import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Box, Text } from "@chakra-ui/react";

interface SessionBlockProps {
  session: Session;
  /** Distance from the top of the room column, in pixels. */
  top: number;
  height: number;
}

export function SessionBlock({ session, top, height }: SessionBlockProps) {
  return (
    <Link href={`/sessions/${session.id}`}>
      <Box
        position="absolute"
        left="1"
        right="1"
        top={`${top}px`}
        height={`${height}px`}
        overflow="hidden"
        padding="1.5"
        borderRadius="md"
        borderWidth="1px"
        borderColor="var(--card-border-hex)"
        background="var(--card-bg)"
        fontSize="xs"
        lineHeight="tight"
        transition="border-color 0.2s"
        _hover={{ borderColor: "var(--card-border-hover-hex)" }}
      >
        <Text fontWeight="medium" color="var(--text-primary)" truncate>
          {session.title}
        </Text>
        <Text color="var(--text-muted)" truncate>
          {session.startTime} · {session.speaker}
        </Text>
      </Box>
    </Link>
  );
}
