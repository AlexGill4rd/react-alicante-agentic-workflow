import { cacheLife } from "next/cache";

import type { Session, SessionRow } from "@/types/session";

import { createSupabaseClient } from "./supabase";

/** Only the columns SESSION_COLUMNS asks for, taken from the generated row. */
type SelectedSessionRow = Pick<
  SessionRow,
  | "id"
  | "title"
  | "speaker"
  | "track"
  | "level"
  | "room"
  | "start_time"
  | "duration_minutes"
  | "description"
>;

const SESSION_COLUMNS =
  "id, title, speaker, track, level, room, start_time, duration_minutes, description";

/**
 * Codes for "this table does not exist": Postgres `undefined_table` (42P01) and
 * PostgREST "table not found in the schema cache" (PGRST205), which is what the
 * Supabase API returns. A fresh project has no tables until its migrations are
 * applied, and these pages are prerendered at build time — so without this the
 * first deploy to a new environment fails the build instead of coming up with
 * an empty schedule.
 */
const MISSING_TABLE_CODES = ["42P01", "PGRST205"];

function isMissingTable(error: { code?: string }): boolean {
  return error.code !== undefined && MISSING_TABLE_CODES.includes(error.code);
}

function toSession(row: SelectedSessionRow): Session {
  return {
    id: row.id,
    title: row.title,
    speaker: row.speaker,
    track: row.track,
    level: row.level,
    room: row.room,
    // Postgres `time` comes back as "09:00:00"; the UI works in "HH:MM".
    startTime: row.start_time.slice(0, 5),
    durationMinutes: row.duration_minutes,
    description: row.description,
  };
}

export async function fetchSessions(): Promise<Session[]> {
  "use cache";
  cacheLife("hours");

  const { data, error } = await createSupabaseClient()
    .from("sessions")
    .select(SESSION_COLUMNS)
    .order("start_time");

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Failed to load sessions: ${error.message}`);
  }

  return (data as SelectedSessionRow[]).map(toSession);
}

export async function fetchSessionById(id: string): Promise<Session | null> {
  "use cache";
  cacheLife("hours");

  const { data, error } = await createSupabaseClient()
    .from("sessions")
    .select(SESSION_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingTable(error)) return null;
    throw new Error(`Failed to load session ${id}: ${error.message}`);
  }

  return data ? toSession(data as SelectedSessionRow) : null;
}
