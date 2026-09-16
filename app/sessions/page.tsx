import { SessionTimeline } from "@/app/sessions/_components/session-timeline";
import { sessions } from "@/data/sessions";

export default function SessionsPage() {
  return (
    <div className="flex-1 w-full min-w-0 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Schedule</h1>
        <p className="text-[color:var(--text-muted)]">
          All sessions, by room and time. Times are local (CET).
        </p>
      </div>

      <SessionTimeline sessions={sessions} />
    </div>
  );
}
