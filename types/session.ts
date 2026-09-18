import type { Database } from "./supabase.types";

/** Generated from the database by `pnpm db:types`. */
export type SessionRow = Database["public"]["Tables"]["sessions"]["Row"];

/** The `session_track` enum, straight from the schema. */
export type Track = Database["public"]["Enums"]["session_track"];

/**
 * What the app works with. Every field's type comes from the database; the
 * only changes are the two columns renamed to camelCase.
 */
export type Session = Pick<
  SessionRow,
  "id" | "title" | "speaker" | "track" | "room" | "description"
> & {
  startTime: SessionRow["start_time"];
  durationMinutes: SessionRow["duration_minutes"];
};
