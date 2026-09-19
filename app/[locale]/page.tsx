import { FeaturedSessions } from "@/app/[locale]/_components/featured-sessions";
import { Hero } from "@/app/[locale]/_components/hero";
import { PageShell } from "@/components/layout/page-shell";
import { fetchSessions } from "@/services/sessions";

const FEATURED_SESSION_COUNT = 3;

export default async function Home() {
  const sessions = await fetchSessions();

  return (
    <PageShell>
      <Hero />
      <FeaturedSessions sessions={sessions.slice(0, FEATURED_SESSION_COUNT)} />
    </PageShell>
  );
}
