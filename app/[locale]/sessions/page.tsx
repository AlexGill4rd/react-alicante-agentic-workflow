import { SessionScheduleExplorer } from "@/app/[locale]/sessions/_components/session-schedule-explorer";
import { PageHeading } from "@/components/atoms/page-heading";
import { fetchSessions } from "@/services/sessions";
import type { SessionLevel } from "@/types/session";
import { Flex } from "@chakra-ui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";

type SessionsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SessionsPage({ params }: SessionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sessions = await fetchSessions();
  const t = await getTranslations("Schedule");
  const tLevel = await getTranslations("Session.level");
  const levelLabels: Record<SessionLevel, string> = {
    beginner: tLevel("beginner"),
    intermediate: tLevel("intermediate"),
    advanced: tLevel("advanced"),
  };

  return (
    <Flex direction="column" gap="8" flex="1" width="full" minWidth="0">
      <PageHeading title={t("title")}>{t("description")}</PageHeading>

      <SessionScheduleExplorer sessions={sessions} levelLabels={levelLabels} />
    </Flex>
  );
}
