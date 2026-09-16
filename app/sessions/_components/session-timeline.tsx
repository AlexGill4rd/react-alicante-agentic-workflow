import Link from "next/link";

import type { Session } from "@/data/sessions";
import { minutesToTime, timeToMinutes } from "@/lib/shared/schedule-time";
import {
  TIMELINE_ROOMS,
  getSessionsByRoom,
  getTimelineBounds,
} from "@/lib/shared/session-timeline";

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

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div
        className="inline-flex min-w-full flex-col"
        style={{
          minWidth: TIME_COLUMN_WIDTH + TIMELINE_ROOMS.length * ROOM_COLUMN_MIN_WIDTH,
        }}
      >
        <div className="flex gap-2 mb-2">
          <div style={{ width: TIME_COLUMN_WIDTH }} className="shrink-0" />
          {TIMELINE_ROOMS.map((room) => (
            <div
              key={room}
              className="flex-1 text-center text-sm font-semibold"
              style={{ minWidth: ROOM_COLUMN_MIN_WIDTH }}
            >
              {room}
            </div>
          ))}
        </div>

        <div className="flex gap-2" style={{ height: timelineHeight }}>
          <div
            className="relative shrink-0 text-xs text-[color:var(--text-muted)]"
            style={{ width: TIME_COLUMN_WIDTH }}
          >
            {hourMarks.map((minute) => (
              <span
                key={minute}
                className="absolute right-2 -translate-y-1/2"
                style={{ top: (minute - startMinutes) * PX_PER_MINUTE }}
              >
                {minutesToTime(minute)}
              </span>
            ))}
          </div>

          {TIMELINE_ROOMS.map((room) => (
            <div
              key={room}
              className="relative flex-1 border-l border-[color:var(--card-border-hex)]"
              style={{ minWidth: ROOM_COLUMN_MIN_WIDTH }}
            >
              {hourMarks.map((minute) => (
                <div
                  key={minute}
                  className="absolute left-0 right-0 border-t border-[color:var(--card-border-hex)]"
                  style={{ top: (minute - startMinutes) * PX_PER_MINUTE }}
                />
              ))}

              {sessionsByRoom[room].map((session) => {
                const top =
                  (timeToMinutes(session.startTime) - startMinutes) *
                  PX_PER_MINUTE;
                const height = session.durationMinutes * PX_PER_MINUTE;

                return (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="absolute left-1 right-1 overflow-hidden rounded-md border border-[color:var(--card-border-hex)] bg-[color:var(--card-bg)] p-1.5 text-xs leading-tight transition-colors hover:border-[color:var(--card-border-hover-hex)]"
                    style={{ top, height }}
                  >
                    <p className="font-medium text-[color:var(--text-primary)] truncate">
                      {session.title}
                    </p>
                    <p className="text-[color:var(--text-muted)] truncate">
                      {session.startTime} · {session.speaker}
                    </p>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
