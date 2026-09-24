import { cacheLife } from "next/cache";

import { createSupabaseClient } from "./supabase";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
}

const MISSING_TABLE_CODES = ["42P01", "PGRST205"];

function isMissingTable(error: { code?: string }): boolean {
  return error.code !== undefined && MISSING_TABLE_CODES.includes(error.code);
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  "use cache";
  cacheLife("hours");

  const { data, error } = await createSupabaseClient()
    .from("announcements")
    .select("id, title, body, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Failed to load announcements: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    publishedAt: row.published_at,
  }));
}
