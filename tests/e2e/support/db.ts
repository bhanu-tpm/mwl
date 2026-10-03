import { createClient } from "@supabase/supabase-js";

/** Every record the e2e suite creates uses this email domain, so cleanup is precise. */
export const E2E_DOMAIN = "e2e.test";
export const ADMIN = { email: `admin@${E2E_DOMAIN}`, password: "E2eAdminPass2026" };
export const NON_ADMIN = { email: `member@${E2E_DOMAIN}`, password: "E2eMemberPass2026" };

export function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("E2E tests need the local Supabase vars in .env.local (run `npm run db:start`).");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function cleanup() {
  const db = adminDb();
  await db.from("leads").delete().like("email", `%@${E2E_DOMAIN}`);
  await db.from("ai_demo_runs").delete().like("input", "E2E%");
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  for (const u of data?.users ?? []) {
    if (u.email?.endsWith(`@${E2E_DOMAIN}`)) await db.auth.admin.deleteUser(u.id);
  }
}
