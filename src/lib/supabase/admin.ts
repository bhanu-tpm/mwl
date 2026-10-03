import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isDatabaseConfigured, serverEnv } from "@/lib/env.server";

let client: SupabaseClient | undefined;

/**
 * Privileged client using the secret key. It bypasses RLS, so use it ONLY in server code,
 * and only for writes that have already been validated (lead inserts, demo-run logs).
 * Returns null when the database isn't configured.
 */
export function getAdminDb(): SupabaseClient | null {
  if (!isDatabaseConfigured()) return null;
  client ??= createClient(serverEnv.NEXT_PUBLIC_SUPABASE_URL!, serverEnv.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
