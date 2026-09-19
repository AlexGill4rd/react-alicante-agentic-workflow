import { HourlyCountChart } from "@/app/[locale]/stats/_components/hourly-count-chart";
import { TrackCountChart } from "@/app/[locale]/stats/_components/track-count-chart";
import { fetchSessions } from "@/services/sessions";
import { isStatsEnabled } from "@/utils/feature-flags";
import {
  getSessionCountByHour,
  getSessionCountByTrack,
} from "@/utils/session-stats";
import { PageHeading } from "@/components/layout/page-heading";
import { Flex, Grid } from "@chakra-ui/react";
import { notFound } from "next/navigation";

export default async function StatsPage() {
  if (!isStatsEnabled) {
    notFound();
  }

  const sessions = await fetchSessions();

  const trackCounts = getSessionCountByTrack(sessions);
  const hourlyCounts = getSessionCountByHour(sessions);

  return (
    <Flex direction="column" gap="8" flex="1" width="full">
      <PageHeading title="Stats">
        A quick visual read of the day: what tracks show up most, and which
        hours are busiest.
      </PageHeading>

      <Grid gap="6">
        <TrackCountChart data={trackCounts} />
        <HourlyCountChart data={hourlyCounts} />
      </Grid>
    </Flex>
  );
}
