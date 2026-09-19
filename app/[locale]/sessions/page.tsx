import { SessionTimeline } from "@/app/[locale]/sessions/_components/session-timeline";
import { PageHeading } from "@/components/atoms/page-heading";
import { fetchSessions } from "@/services/sessions";
import { Flex } from "@chakra-ui/react";

export default async function SessionsPage() {
  const sessions = await fetchSessions();

  return (
    <Flex direction="column" gap="8" flex="1" width="full" minWidth="0">
      <PageHeading title="Schedule">
        All sessions, by room and time. Times are local (CET).
      </PageHeading>

      <SessionTimeline sessions={sessions} />
    </Flex>
  );
}
