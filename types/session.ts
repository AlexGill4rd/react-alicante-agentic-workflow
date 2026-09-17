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
