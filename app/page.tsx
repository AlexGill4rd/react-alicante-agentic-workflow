import { Hero } from "@/app/_components/hero";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Badge } from "@/components/primitives/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";
import { sessions } from "@/data/sessions";
import Link from "next/link";

const FEATURED_SESSION_COUNT = 3;

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <SiteNav />
        <div className="flex-1 w-full min-w-0 flex flex-col gap-16 max-w-5xl p-5">
          <Hero />

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-2xl">Featured sessions</h2>
              <Link
                href="/sessions"
                className="text-sm text-muted-foreground hover:underline"
              >
                View full schedule →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {sessions.slice(0, FEATURED_SESSION_COUNT).map((session) => (
                <Link key={session.id} href={`/sessions/${session.id}`}>
                  <Card className="h-full hover:border-foreground/30 transition-colors">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit">
                        {session.track}
                      </Badge>
                      <CardTitle className="text-base">
                        {session.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {session.startTime} · {session.speaker}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
