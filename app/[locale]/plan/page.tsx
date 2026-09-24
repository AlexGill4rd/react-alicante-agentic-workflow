import { SessionPlanList } from "@/app/[locale]/plan/_components/session-plan-list";
import { PageHeading } from "@/components/atoms/page-heading";
import { fetchSessions } from "@/services/sessions";
import { Flex } from "@chakra-ui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";

type PlanPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PlanPage({ params }: PlanPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Plan");
  const sessions = await fetchSessions();

  return (
    <Flex direction="column" gap="8" flex="1" width="full" minWidth="0">
      <PageHeading title={t("title")}>{t("description")}</PageHeading>
      <SessionPlanList sessions={sessions} />
    </Flex>
  );
}
