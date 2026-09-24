"use client";

import { Box, Flex, Text } from "@chakra-ui/react";

interface ScheduleNowLineProps {
  top: number;
  nowLabel: string;
  timeLabel: string;
  /** Span full grid (time + day columns) or a single day column. */
  variant?: "full" | "column";
}

export function ScheduleNowLine({
  top,
  nowLabel,
  timeLabel,
  variant = "full",
}: ScheduleNowLineProps) {
  const left = variant === "full" ? "52px" : "0";

  return (
    <Box
      position="absolute"
      left={left}
      right="0"
      top={`${top}px`}
      zIndex="3"
      pointerEvents="none"
      aria-hidden
    >
      <Flex align="center" width="full">
        <Box
          flexShrink="0"
          width="2px"
          height="2px"
          borderRadius="full"
          background="var(--schedule-now)"
          boxShadow="0 0 0 4px color-mix(in srgb, var(--schedule-now) 35%, transparent)"
        />
        <Box flex="1" height="2px" background="var(--schedule-now)" />
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="var(--schedule-now)"
          background="var(--md-surface)"
          paddingX="2"
          paddingY="0.5"
          borderRadius="var(--radius-pill)"
          borderWidth="1px"
          borderColor="color-mix(in srgb, var(--schedule-now) 45%, transparent)"
          marginLeft="2"
          whiteSpace="nowrap"
        >
          {nowLabel} · {timeLabel}
        </Text>
      </Flex>
    </Box>
  );
}
