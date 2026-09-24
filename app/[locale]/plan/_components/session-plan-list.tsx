"use client";

import { Badge } from "@/components/atoms/badge";
import { InteractiveSurface } from "@/components/atoms/interactive-surface";
import { PlanCopyButton } from "@/components/molecules/plan-copy-button";
import { useSessionBookmarks } from "@/hooks/use-session-bookmarks";
import { Link } from "@/i18n/navigation";
import type { Session } from "@/types/session";
import { Flex, Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function SessionPlanList({ sessions }: { sessions: Session[] }) {
  const t = useTranslations("Plan");
  const tLevel = useTranslations("Session.level");
  const { bookmarks } = useSessionBookmarks();

  const planned = useMemo(
    () =>
      sessions
        .filter((session) => bookmarks.includes(session.id))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [sessions, bookmarks],
  );

  if (planned.length === 0) {
    return (
      <Flex direction="column" gap="4" align="center">
        <PlanCopyButton sessions={planned} />
        <Text color="var(--text-muted)" textAlign="center" paddingY="8">
          {t("empty")}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4">
      <Flex justify="flex-end">
        <PlanCopyButton sessions={planned} />
      </Flex>
      <Flex direction="column" gap="3">
        {planned.map((session) => (
          <Link key={session.id} href={`/sessions/${session.id}`}>
            <InteractiveSurface>
              <Flex direction="column" gap="2">
                <Flex gap="2" flexWrap="wrap">
                  <Badge>{session.track}</Badge>
                  <Badge variant="outline">{tLevel(session.level)}</Badge>
                </Flex>
                <Text fontWeight="semibold">{session.title}</Text>
                <Text fontSize="sm" color="var(--text-muted)">
                  {session.startTime} · {session.speaker} · {session.room}
                </Text>
              </Flex>
            </InteractiveSurface>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
}
