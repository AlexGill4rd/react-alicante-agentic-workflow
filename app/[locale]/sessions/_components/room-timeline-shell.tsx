"use client";

import { ScheduleNowLine } from "@/app/[locale]/sessions/_components/schedule-now-line";
import { useConferenceClock } from "@/hooks/use-conference-clock";
import { isNowLineVisible, nowLineTopPx } from "@/utils/conference-clock";
import { Box } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

interface RoomTimelineShellProps {
  children: React.ReactNode;
  startMinutes: number;
  pxPerMinute: number;
  timeColumnWidth: number;
}

export function RoomTimelineShell({
  children,
  startMinutes,
  pxPerMinute,
  timeColumnWidth,
}: RoomTimelineShellProps) {
  const t = useTranslations("Schedule.agenda");
  const now = useConferenceClock();
  const showNow = isNowLineVisible(now);
  const nowTop = nowLineTopPx(now, startMinutes, pxPerMinute);

  return (
    <Box position="relative" width="full" minWidth="0" height="full">
      {children}
      {showNow && (
        <Box
          position="absolute"
          left={`${timeColumnWidth}px`}
          right="0"
          top="0"
          bottom="0"
          pointerEvents="none"
        >
          <ScheduleNowLine
            top={nowTop}
            nowLabel={t("now")}
            timeLabel={now.timeLabel}
            variant="column"
          />
        </Box>
      )}
    </Box>
  );
}
