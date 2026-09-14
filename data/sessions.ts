export type Track = "React" | "Agentic AI" | "Performance" | "Architecture";

export interface Session {
  id: string;
  title: string;
  speaker: string;
  track: Track;
  room: string;
  startTime: string;
  durationMinutes: number;
  description: string;
}

export const sessions: Session[] = [
  {
    id: "opening-keynote",
    title: "Opening Keynote: The Shape of Frontend in 2026",
    speaker: "Marta Fernandez",
    track: "Architecture",
    room: "Main Hall",
    startTime: "09:00",
    durationMinutes: 30,
    description:
      "Where React, the platform, and AI-assisted tooling are actually headed — past the hype cycle.",
  },
  {
    id: "build-your-agentic-workflow",
    title: "Build Your Agentic Workflow: Markdown-Driven AI for Real Projects",
    speaker: "Evangelia Mitsopoulou",
    track: "Agentic AI",
    room: "Workshop Room A",
    startTime: "09:45",
    durationMinutes: 180,
    description:
      "Hands-on workshop: build your own Claude Code skills and agents against a real Next.js + Supabase codebase, from scoped ticket to opened PR.",
  },
  {
    id: "server-components-deep-dive",
    title: "Server Components Beyond the Tutorial",
    speaker: "Iker Otxoa",
    track: "React",
    room: "Main Hall",
    startTime: "10:15",
    durationMinutes: 45,
    description:
      "Streaming, partial pre-rendering, and the caching model React's docs gloss over — with production war stories.",
  },
  {
    id: "rsc-payload-budget",
    title: "Keeping Your RSC Payload on a Diet",
    speaker: "Naia Etxeberria",
    track: "Performance",
    room: "Room B",
    startTime: "11:15",
    durationMinutes: 45,
    description:
      "Measuring and trimming what actually crosses the server/client boundary, with real before/after payload traces.",
  },
  {
    id: "agent-context-windows",
    title: "Context Windows Are a Budget, Not a Suggestion",
    speaker: "Diego Castellanos",
    track: "Agentic AI",
    room: "Room B",
    startTime: "12:15",
    durationMinutes: 45,
    description:
      "Practical patterns for keeping long agent sessions coherent: memory files, subagents, and knowing what to forget.",
  },
  {
    id: "micro-frontends-2026",
    title: "Micro-Frontends Without the Regret",
    speaker: "Sofia Almeida",
    track: "Architecture",
    room: "Main Hall",
    startTime: "14:00",
    durationMinutes: 45,
    description:
      "Module federation, shared design systems, and the org-chart problems no framework solves for you.",
  },
  {
    id: "testing-ai-generated-code",
    title: "Testing Code You Didn't Write Yourself",
    speaker: "Pablo Iglesias",
    track: "Agentic AI",
    room: "Room B",
    startTime: "15:00",
    durationMinutes: 45,
    description:
      "What changes about test strategy when an agent scaffolds the first draft — and what stays exactly the same.",
  },
  {
    id: "closing-panel",
    title: "Closing Panel: Frontend Careers in an AI-Assisted World",
    speaker: "Full speaker lineup",
    track: "Architecture",
    room: "Main Hall",
    startTime: "16:30",
    durationMinutes: 45,
    description:
      "Open Q&A with the day's speakers on how the day-to-day of the job is actually changing.",
  },
];

export function getSessionById(id: string): Session | undefined {
  return sessions.find((session) => session.id === id);
}
