import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getUserDb } from "@/lib/supabase/server";

/**
 * Data Access Layer for the admin area. The proxy only does an optimistic redirect; this is
 * the real check, run on the server for every admin page and action. RLS in the database is
 * the final layer underneath.
 */
export const getAdmin = cache(async () => {
  const db = await getUserDb();
  if (!db) return null;

  // getUser() verifies the session with the auth server (not just the cookie).
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data: isAdmin, error } = await db.rpc("is_admin");
  if (error || !isAdmin) return null;

  return { user, db };
});

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
