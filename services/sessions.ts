import { cacheLife } from "next/cache";

import type { Session, Track } from "@/types/session";

import { createSupabaseClient } from "./supabase";

interface SessionRow {
  id: string;
  title: string;
  speaker: string;
  track: Track;
  room: string;
  start_time: string;
  duration_minutes: number;
  description: string;
}

const SESSION_COLUMNS =
  "id, title, speaker, track, room, start_time, duration_minutes, description";

function toSession(row: SessionRow): Session {
  return {
    id: row.id,
    title: row.title,
    speaker: row.speaker,
    track: row.track,
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
    throw new Error(`Failed to load sessions: ${error.message}`);
  }

  return (data as SessionRow[]).map(toSession);
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
    throw new Error(`Failed to load session ${id}: ${error.message}`);
  }

  return data ? toSession(data as SessionRow) : null;
}
