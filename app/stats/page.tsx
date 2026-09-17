import { HourlyCountChart } from "@/app/stats/_components/hourly-count-chart";
import { TrackCountChart } from "@/app/stats/_components/track-count-chart";
import { fetchSessions } from "@/services/sessions";
import { isStatsEnabled } from "@/utils/feature-flags";
import {
  getSessionCountByHour,
  getSessionCountByTrack,
} from "@/utils/session-stats";
import { notFound } from "next/navigation";

export default async function StatsPage() {
  if (!isStatsEnabled) {
    notFound();
  }

  const sessions = await fetchSessions();

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
