import { SessionBlock } from "@/app/[locale]/sessions/_components/session-block";
import type { Session } from "@/types/session";
import { minutesToTime, timeToMinutes } from "@/utils/schedule-time";
import {
  TIMELINE_ROOMS,
  getSessionsByRoom,
  getTimelineBounds,
} from "@/utils/session-timeline";
import { Box, Flex, Text } from "@chakra-ui/react";

const PX_PER_MINUTE = 1.6;
const TIME_COLUMN_WIDTH = 56;
const ROOM_COLUMN_MIN_WIDTH = 180;

interface SessionTimelineProps {
  sessions: Session[];
}

export function SessionTimeline({ sessions }: SessionTimelineProps) {
  const { startMinutes, endMinutes } = getTimelineBounds(sessions);
  const sessionsByRoom = getSessionsByRoom(sessions);
  const timelineHeight = (endMinutes - startMinutes) * PX_PER_MINUTE;

  const hourMarks: number[] = [];
  for (let minute = startMinutes; minute <= endMinutes; minute += 60) {
    hourMarks.push(minute);
  }

  const offsetOf = (minute: number) => (minute - startMinutes) * PX_PER_MINUTE;

  return (
    <Box width="full" minWidth="0" overflowX="auto">
      <Flex
        direction="column"
        display="inline-flex"
        minWidth={`${TIME_COLUMN_WIDTH + TIMELINE_ROOMS.length * ROOM_COLUMN_MIN_WIDTH}px`}
      >
        <Flex gap="2" marginBottom="2">
          <Box width={`${TIME_COLUMN_WIDTH}px`} flexShrink="0" />
          {TIMELINE_ROOMS.map((room) => (
            <Text
              key={room}
              flex="1"
              minWidth={`${ROOM_COLUMN_MIN_WIDTH}px`}
              textAlign="center"
              fontSize="sm"
              fontWeight="semibold"
            >
              {room}
            </Text>
          ))}
        </Flex>

        <Flex gap="2" height={`${timelineHeight}px`}>
          <Box
            position="relative"
            flexShrink="0"
            width={`${TIME_COLUMN_WIDTH}px`}
            fontSize="xs"
            color="var(--text-muted)"
          >
            {hourMarks.map((minute) => (
              <Text
                key={minute}
                as="span"
                position="absolute"
                right="2"
                top={`${offsetOf(minute)}px`}
                transform="translateY(-50%)"
              >
                {minutesToTime(minute)}
              </Text>
            ))}
          </Box>

          {TIMELINE_ROOMS.map((room) => (
            <Box
              key={room}
              position="relative"
              flex="1"
              minWidth={`${ROOM_COLUMN_MIN_WIDTH}px`}
              borderLeftWidth="1px"
              borderColor="var(--card-border-hex)"
            >
              {hourMarks.map((minute) => (
                <Box
                  key={minute}
                  position="absolute"
                  left="0"
                  right="0"
                  top={`${offsetOf(minute)}px`}
                  borderTopWidth="1px"
                  borderColor="var(--card-border-hex)"
                />
              ))}

              {sessionsByRoom[room].map((session) => (
                <SessionBlock
                  key={session.id}
                  session={session}
                  top={offsetOf(timeToMinutes(session.startTime))}
                  height={session.durationMinutes * PX_PER_MINUTE}
                />
              ))}
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
}
