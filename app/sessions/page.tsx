import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessions } from "@/data/sessions";

export default function SessionsPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Schedule</h1>
        <p className="text-muted-foreground">
          All sessions, one track. Times are local (CET).
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <Link key={session.id} href={`/sessions/${session.id}`}>
            <Card className="hover:border-foreground/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>{session.title}</CardTitle>
                  <Badge variant="secondary">{session.track}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {session.startTime} · {session.room} · {session.speaker}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
