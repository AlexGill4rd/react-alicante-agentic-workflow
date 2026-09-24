import { StatsKpiStrip } from "@/app/[locale]/stats/_components/stats-kpi-strip";
import { getConferenceSummary } from "@/utils/session-stats";
import type { Session } from "@/types/session";
import { getTranslations } from "next-intl/server";

export async function ConferenceOverview({
  sessions,
}: {
  sessions: Session[];
}) {
  const t = await getTranslations("Home.overview");
  const summary = getConferenceSummary(sessions);

  const items = [
    { label: t("sessions"), value: summary.sessionCount },
    { label: t("tracks"), value: summary.trackCount },
    { label: t("speakers"), value: summary.speakerCount },
    { label: t("rooms"), value: summary.roomCount },
  ];

  return <StatsKpiStrip items={items} />;
}
