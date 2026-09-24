"use client";

import { SessionTimeline } from "@/app/[locale]/sessions/_components/session-timeline";
import type { SessionLevelLabels } from "@/app/[locale]/sessions/_components/session-timeline";
import { filterSessions } from "@/utils/filter-sessions";
import type { Session, SessionLevel, Track } from "@/types/session";
import { Flex, Input, NativeSelect, Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const TRACKS: Track[] = ["React", "Agentic AI", "Performance", "Architecture"];
const LEVELS: SessionLevel[] = ["beginner", "intermediate", "advanced"];

interface SessionScheduleExplorerProps {
  sessions: Session[];
  levelLabels: SessionLevelLabels;
}

export function SessionScheduleExplorer({
  sessions,
  levelLabels,
}: SessionScheduleExplorerProps) {
  const t = useTranslations("Schedule.filters");
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track | "all">("all");
  const [level, setLevel] = useState<SessionLevel | "all">("all");

  const filtered = useMemo(
    () => filterSessions(sessions, { query, track, level }),
    [sessions, query, track, level],
  );

  const fieldStyles = {
    background: "var(--card-fill)",
    borderColor: "var(--card-border-hex)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-lg)",
    _focusVisible: {
      borderColor: "var(--accent-hex)",
      boxShadow: "0 0 0 2px var(--accent-glow-soft)",
    },
  };

  return (
    <Flex direction="column" gap="6" width="full" minWidth="0">
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="3"
        wrap="wrap"
        align={{ md: "center" }}
      >
        <Input
          flex="1"
          minWidth="200px"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          css={fieldStyles}
        />
        <NativeSelect.Root width={{ base: "full", md: "180px" }}>
          <NativeSelect.Field
            value={track}
            onChange={(event) =>
              setTrack(event.currentTarget.value as Track | "all")
            }
            css={fieldStyles}
          >
            <option value="all">{t("allTracks")}</option>
            {TRACKS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
        <NativeSelect.Root width={{ base: "full", md: "180px" }}>
          <NativeSelect.Field
            value={level}
            onChange={(event) =>
              setLevel(event.currentTarget.value as SessionLevel | "all")
            }
            css={fieldStyles}
          >
            <option value="all">{t("allLevels")}</option>
            {LEVELS.map((value) => (
              <option key={value} value={value}>
                {levelLabels[value]}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
        <Text
          fontSize="sm"
          color="var(--text-muted)"
          marginLeft={{ md: "auto" }}
        >
          {t("results", { count: filtered.length, total: sessions.length })}
        </Text>
      </Flex>

      {filtered.length === 0 ? (
        <Text color="var(--text-muted)" textAlign="center" paddingY="12">
          {t("empty")}
        </Text>
      ) : (
        <SessionTimeline sessions={filtered} levelLabels={levelLabels} />
      )}
    </Flex>
  );
}
