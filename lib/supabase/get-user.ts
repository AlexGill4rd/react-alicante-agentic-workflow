import { createClient } from "./server";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}
