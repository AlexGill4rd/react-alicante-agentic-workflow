import { SurfaceCard } from "@/components/atoms/surface-card";
import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Box, Text } from "@chakra-ui/react";

interface SessionBlockProps {
  session: Session;
  levelLabel: string;
  top: number;
  height: number;
}

export function SessionBlock({
  session,
  levelLabel,
  top,
  height,
}: SessionBlockProps) {
  return (
    <Link href={`/sessions/${session.id}`}>
      <Box
        position="absolute"
        insetX="1"
        top={`${top}px`}
        height={`${height}px`}
      >
        <SurfaceCard>
          <Text fontWeight="medium" color="var(--text-primary)" truncate>
            {session.title}
          </Text>
          <Text color="var(--text-muted)" truncate>
            {session.startTime} · {session.speaker} · {levelLabel}
          </Text>
        </SurfaceCard>
      </Box>
    </Link>
  );
}
