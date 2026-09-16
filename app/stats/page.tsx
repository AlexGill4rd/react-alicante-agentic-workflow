import { HourlyCountChart } from "@/app/stats/_components/hourly-count-chart";
import { TrackCountChart } from "@/app/stats/_components/track-count-chart";
import { sessions } from "@/data/sessions";
import {
  getSessionCountByHour,
  getSessionCountByTrack,
} from "@/lib/shared/session-stats";

export default function StatsPage() {
  const trackCounts = getSessionCountByTrack(sessions);
  const hourlyCounts = getSessionCountByHour(sessions);

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Stats</h1>
        <p className="text-[color:var(--text-muted)]">
          A quick visual read of the day: what tracks show up most, and which
          hours are busiest.
        </p>
      </div>

      <div className="grid gap-6">
        <TrackCountChart data={trackCounts} />
        <HourlyCountChart data={hourlyCounts} />
      </div>
    </div>
  );
}
