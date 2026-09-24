import { HourlyCountChart } from "@/app/[locale]/stats/_components/hourly-count-chart";
import { LevelCountChart } from "@/app/[locale]/stats/_components/level-count-chart";
import { StatsKpiStrip } from "@/app/[locale]/stats/_components/stats-kpi-strip";
import { TrackCountChart } from "@/app/[locale]/stats/_components/track-count-chart";
import { PageHeading } from "@/components/atoms/page-heading";
import { fetchSessions } from "@/services/sessions";
import { isStatsEnabled } from "@/utils/feature-flags";
import {
  getConferenceSummary,
  getSessionCountByHour,
  getSessionCountByLevel,
  getSessionCountByTrack,
} from "@/utils/session-stats";
import { Flex, Grid } from "@chakra-ui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type StatsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StatsPage({ params }: StatsPageProps) {
  if (!isStatsEnabled) {
    notFound();
  }

  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Stats");
  const tLevel = await getTranslations("Session.level");
  const sessions = await fetchSessions();
  const summary = getConferenceSummary(sessions);

  const kpiItems = [
    { label: t("kpi.sessions"), value: summary.sessionCount },
    { label: t("kpi.tracks"), value: summary.trackCount },
    { label: t("kpi.speakers"), value: summary.speakerCount },
    { label: t("kpi.rooms"), value: summary.roomCount },
  ];

  const levelLabels = {
    beginner: tLevel("beginner"),
    intermediate: tLevel("intermediate"),
    advanced: tLevel("advanced"),
  };

  return (
    <Flex direction="column" gap="8" flex="1" width="full">
      <PageHeading title={t("title")}>{t("description")}</PageHeading>

      <StatsKpiStrip items={kpiItems} />

      <Grid gap="6" templateColumns={{ base: "1fr", lg: "1fr 1fr" }}>
        <TrackCountChart
          data={getSessionCountByTrack(sessions)}
          title={t("charts.tracks")}
        />
        <LevelCountChart
          data={getSessionCountByLevel(sessions)}
          title={t("charts.levels")}
          levelLabels={levelLabels}
        />
        <Grid gridColumn={{ lg: "span 2" }}>
          <HourlyCountChart
            data={getSessionCountByHour(sessions)}
            title={t("charts.hours")}
          />
        </Grid>
      </Grid>
    </Flex>
  );
}
