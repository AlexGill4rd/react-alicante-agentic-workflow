import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/primitives/badge";
import { fetchSessionById, fetchSessions } from "@/services/sessions";

export async function generateStaticParams() {
  const sessions = await fetchSessions();
  return sessions.map((session) => ({ id: session.id }));
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await fetchSessionById(id);

  if (!session) {
    notFound();
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <Link
        href="/sessions"
        className="text-sm text-muted-foreground hover:underline w-fit"
      >
        ← Back to schedule
      </Link>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{session.track}</Badge>
          <span className="text-sm text-muted-foreground">
            {session.startTime} · {session.durationMinutes} min · {session.room}
          </span>
        </div>
        <h1 className="font-bold text-3xl">{session.title}</h1>
        <p className="text-muted-foreground">{session.speaker}</p>
      </div>

      <p className="text-base leading-relaxed max-w-2xl">
        {session.description}
      </p>
    </div>
  );
}
