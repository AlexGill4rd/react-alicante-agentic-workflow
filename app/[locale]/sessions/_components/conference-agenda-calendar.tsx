"use client";

import { ScheduleNowLine } from "@/app/[locale]/sessions/_components/schedule-now-line";
import { Button } from "@/components/atoms/button";
import {
  AGENDA_GRID_END_MINUTES,
  AGENDA_GRID_START_MINUTES,
  AGENDA_PX_PER_MINUTE,
  type ConferenceDayKey,
} from "@/constants/conference-2026";
import {
  REACT_ALICANTE_2026_AGENDA,
  type AgendaSlot,
  type AgendaSlotKind,
} from "@/data/react-alicante-2026-agenda";
import { useConferenceClock } from "@/hooks/use-conference-clock";
import {
  endTimeLabel,
  filterAgendaByQuery,
  isNowLineVisible,
  nowLineTopPx,
} from "@/utils/conference-clock";
import { minutesToTime, timeToMinutes } from "@/utils/schedule-time";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

const TIME_GUTTER = 52;
const DAY_MIN_WIDTH = 200;
const KIND_SURFACE: Record<AgendaSlotKind, string> = {
  welcome: "var(--md-tertiary-container)",
  session: "var(--md-surface-container-high)",
  break: "var(--md-surface-container-low)",
  lunch: "var(--md-secondary-container)",
  lightning: "var(--md-primary-container)",
  social: "var(--md-tertiary-container)",
};

const KIND_BORDER: Record<AgendaSlotKind, string> = {
  welcome: "var(--md-outline-variant)",
  session: "color-mix(in srgb, var(--md-primary) 28%, var(--card-border-hex))",
  break: "var(--md-outline-variant)",
  lunch: "color-mix(in srgb, var(--md-secondary) 40%, var(--card-border-hex))",
  lightning:
    "color-mix(in srgb, var(--md-primary) 50%, var(--card-border-hex))",
  social: "var(--md-outline-variant)",
};

interface ConferenceAgendaCalendarProps {
  searchQuery: string;
}

function offsetTop(startTime: string): number {
  return (
    (timeToMinutes(startTime) - AGENDA_GRID_START_MINUTES) *
    AGENDA_PX_PER_MINUTE
  );
}

function slotHeight(durationMinutes: number): number {
  return durationMinutes * AGENDA_PX_PER_MINUTE;
}

function AgendaSlotCard({
  slot,
  title,
  layout,
  mobileDay,
}: {
  slot: AgendaSlot;
  title: string;
  layout: "dual" | "single";
  mobileDay: ConferenceDayKey;
}) {
  if (layout === "single") {
    if (slot.day === "fri" && mobileDay !== "fri") return null;
    if (slot.day === "sat" && mobileDay !== "sat") return null;
  }

  const top = offsetTop(slot.startTime);
  const height = slotHeight(slot.durationMinutes);
  const isCompact = height < 56;

  const columnStyle =
    layout === "single" || slot.day === "both"
      ? { left: `${TIME_GUTTER}px`, right: "0" }
      : slot.day === "fri"
        ? {
            left: `${TIME_GUTTER}px`,
            width: `calc(50% - ${TIME_GUTTER / 2}px)`,
          }
        : {
            left: `calc(50% + 4px)`,
            right: "0",
          };

  return (
    <Box
      position="absolute"
      top={`${top}px`}
      height={`${height}px`}
      paddingX="1"
      paddingY="0.5"
      {...columnStyle}
    >
      <Flex
        direction="column"
        height="full"
        padding={isCompact ? "2" : "3"}
        borderRadius="var(--radius-md)"
        background={KIND_SURFACE[slot.kind]}
        borderWidth="1px"
        borderColor={KIND_BORDER[slot.kind]}
        boxShadow="0 1px 2px color-mix(in srgb, var(--text-primary) 6%, transparent)"
        overflow="hidden"
        transition="box-shadow var(--transition-standard) var(--ease-md)"
        _hover={{
          boxShadow:
            slot.kind === "session"
              ? "0 4px 14px color-mix(in srgb, var(--md-primary) 18%, transparent)"
              : undefined,
        }}
      >
        <Text
          fontSize={isCompact ? "xs" : "sm"}
          fontWeight={slot.kind === "session" ? "semibold" : "medium"}
          color="var(--text-primary)"
          lineClamp={isCompact ? 2 : 4}
          lineHeight="short"
        >
          {title}
        </Text>
        {!isCompact && (
          <Text fontSize="xs" color="var(--text-muted)" marginTop="1">
            {slot.startTime} –{" "}
            {endTimeLabel(slot.startTime, slot.durationMinutes)}
          </Text>
        )}
      </Flex>
    </Box>
  );
}

export function ConferenceAgendaCalendar({
  searchQuery,
}: ConferenceAgendaCalendarProps) {
  const t = useTranslations("Schedule.agenda");
  const tSlots = useTranslations("Schedule.agenda.slots");
  const now = useConferenceClock();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileDayPick, setMobileDayPick] = useState<ConferenceDayKey | null>(
    null,
  );
  const mobileDay = mobileDayPick ?? now.activeDay ?? "fri";

  const slots = useMemo(
    () =>
      filterAgendaByQuery(
        (key) => tSlots(key),
        searchQuery,
        REACT_ALICANTE_2026_AGENDA,
      ),
    [searchQuery, tSlots],
  );

  const titleForKey = (key: string) => tSlots(key);

  const timelineHeight =
    (AGENDA_GRID_END_MINUTES - AGENDA_GRID_START_MINUTES) *
    AGENDA_PX_PER_MINUTE;

  const hourMarks: number[] = [];
  for (
    let minute = AGENDA_GRID_START_MINUTES;
    minute <= AGENDA_GRID_END_MINUTES;
    minute += 60
  ) {
    hourMarks.push(minute);
  }

  const showNow = isNowLineVisible(now);
  const nowTop = nowLineTopPx(
    now,
    AGENDA_GRID_START_MINUTES,
    AGENDA_PX_PER_MINUTE,
  );

  useEffect(() => {
    if (!showNow || !scrollRef.current) return;
    const container = scrollRef.current;
    const target = nowTop - container.clientHeight * 0.35;
    container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [showNow, nowTop]);

  const gridMinWidth = TIME_GUTTER + DAY_MIN_WIDTH * 2;

  return (
    <Flex direction="column" gap="4" width="full" minWidth="0">
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap="3"
        align={{ sm: "center" }}
        justify="space-between"
      >
        <Flex gap="2" display={{ base: "flex", md: "none" }}>
          {(["fri", "sat"] as const).map((day) => (
            <Button
              key={day}
              type="button"
              size="sm"
              variant={mobileDay === day ? "default" : "outline"}
              onClick={() => setMobileDayPick(day)}
            >
              {t(day === "fri" ? "dayFridayShort" : "daySaturdayShort")}
            </Button>
          ))}
        </Flex>
        <Text fontSize="sm" color="var(--text-muted)">
          {t("wifi", { ssid: "REACT ALICANTE 2026", password: "LIMENIUS" })}
        </Text>
      </Flex>

      <Box
        ref={scrollRef}
        width="full"
        maxHeight={{ base: "70vh", lg: "none" }}
        overflow={{ base: "auto", lg: "visible" }}
        borderRadius="var(--radius-lg)"
        borderWidth="1px"
        borderColor="var(--card-border-hex)"
        background="var(--md-surface-container-lowest)"
        padding="3"
      >
        <Box
          position="relative"
          minWidth={{ base: "100%", md: `${gridMinWidth}px` }}
          marginX={{ md: "auto" }}
        >
          <Flex
            position="sticky"
            top="0"
            zIndex="4"
            gap="2"
            marginBottom="2"
            paddingBottom="2"
            background="var(--md-surface-container-lowest)"
            borderBottomWidth="1px"
            borderColor="var(--card-border-hex)"
          >
            <Box width={`${TIME_GUTTER}px`} flexShrink="0" />
            <Text
              flex="1"
              textAlign="center"
              fontSize="sm"
              fontWeight="bold"
              color="var(--text-primary)"
              display={{ base: "none", md: "block" }}
            >
              {t("dayFriday")}
            </Text>
            <Text
              flex="1"
              textAlign="center"
              fontSize="sm"
              fontWeight="bold"
              color="var(--text-primary)"
              display={{ base: "none", md: "block" }}
            >
              {t("daySaturday")}
            </Text>
            <Text
              flex="1"
              textAlign="center"
              fontSize="sm"
              fontWeight="bold"
              color="var(--text-primary)"
              display={{ base: "block", md: "none" }}
            >
              {mobileDay === "fri" ? t("dayFriday") : t("daySaturday")}
            </Text>
          </Flex>

          <Box position="relative" height={`${timelineHeight}px`}>
            <Box
              position="absolute"
              insetY="0"
              left={`${TIME_GUTTER}px`}
              right="0"
              backgroundImage={`repeating-linear-gradient(
                to bottom,
                transparent,
                transparent ${AGENDA_PX_PER_MINUTE * 30 - 1}px,
                color-mix(in srgb, var(--card-border-hex) 55%, transparent) ${AGENDA_PX_PER_MINUTE * 30 - 1}px,
                color-mix(in srgb, var(--card-border-hex) 55%, transparent) ${AGENDA_PX_PER_MINUTE * 30}px
              )`}
              pointerEvents="none"
              opacity="0.65"
            />

            <Box
              position="absolute"
              top="0"
              bottom="0"
              left={`${TIME_GUTTER}px`}
              width="1px"
              background="var(--card-border-hex)"
            />
            <Box
              position="absolute"
              top="0"
              bottom="0"
              left="50%"
              width="1px"
              background="var(--card-border-hex)"
              display={{ base: "none", md: "block" }}
            />

            <Box
              position="absolute"
              left="0"
              top="0"
              width={`${TIME_GUTTER}px`}
              height="full"
            >
              {hourMarks.map((minute) => (
                <Text
                  key={minute}
                  position="absolute"
                  right="2"
                  top={`${(minute - AGENDA_GRID_START_MINUTES) * AGENDA_PX_PER_MINUTE}px`}
                  transform="translateY(-50%)"
                  fontSize="xs"
                  fontWeight="medium"
                  color="var(--text-muted)"
                >
                  {minutesToTime(minute)}
                </Text>
              ))}
            </Box>

            {showNow && (
              <ScheduleNowLine
                top={nowTop}
                nowLabel={t("now")}
                timeLabel={now.timeLabel}
                variant="full"
              />
            )}

            <Box display={{ base: "none", md: "block" }}>
              {slots.map((slot) => (
                <AgendaSlotCard
                  key={slot.id}
                  slot={slot}
                  title={titleForKey(slot.titleKey)}
                  layout="dual"
                  mobileDay={mobileDay}
                />
              ))}
            </Box>

            <Box display={{ base: "block", md: "none" }}>
              {slots.map((slot) => (
                <AgendaSlotCard
                  key={`${slot.id}-mobile`}
                  slot={slot}
                  title={titleForKey(slot.titleKey)}
                  layout="single"
                  mobileDay={mobileDay}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Flex gap="4" wrap="wrap" fontSize="xs" color="var(--text-muted)">
        {(["session", "break", "lunch", "lightning", "social"] as const).map(
          (kind) => (
            <Flex key={kind} align="center" gap="2">
              <Box
                width="3"
                height="3"
                borderRadius="sm"
                background={KIND_SURFACE[kind]}
                borderWidth="1px"
                borderColor={KIND_BORDER[kind]}
              />
              <Text>{t(`legend.${kind}`)}</Text>
            </Flex>
          ),
        )}
      </Flex>
    </Flex>
  );
}
