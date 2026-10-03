import { ADMIN, NON_ADMIN, adminDb, cleanup } from "./db";

/** Fresh e2e accounts: one admin, one ordinary (non-admin) user. */
export default async function globalSetup() {
  await cleanup();
  const db = adminDb();
  for (const user of [ADMIN, NON_ADMIN]) {
    const { data, error } = await db.auth.admin.createUser({ ...user, email_confirm: true });
    if (error) throw error;
    if (user === ADMIN) {
      const { error: e } = await db.from("admin_users").insert({ user_id: data.user.id });
      if (e) throw e;
    }
  }
}
