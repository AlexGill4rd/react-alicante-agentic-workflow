import { AnnouncementsFeed } from "@/app/[locale]/_components/announcements-feed";
import { ConferenceOverview } from "@/app/[locale]/_components/conference-overview";
import { FeaturedSessions } from "@/app/[locale]/_components/featured-sessions";
import { Hero } from "@/app/[locale]/_components/hero";
import { PageShell } from "@/components/templates/page-shell";
import { fetchAnnouncements } from "@/services/announcements";
import { fetchSessions } from "@/services/sessions";
import { Flex } from "@chakra-ui/react";
import { setRequestLocale } from "next-intl/server";

const FEATURED_SESSION_COUNT = 3;

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [sessions, announcements] = await Promise.all([
    fetchSessions(),
    fetchAnnouncements(),
  ]);

  return (
    <PageShell>
      <Flex direction="column" gap="16" width="full">
        <Hero />
        <ConferenceOverview sessions={sessions} />
        <AnnouncementsFeed announcements={announcements} />
        <FeaturedSessions
          sessions={sessions.slice(0, FEATURED_SESSION_COUNT)}
        />
      </Flex>
    </PageShell>
  );
}
