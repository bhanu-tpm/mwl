import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isAuthConfigured, serverEnv } from "@/lib/env.server";

/**
 * Per-request client acting as the signed-in user (publishable key + session cookie).
 * Everything it reads is filtered by RLS, so a non-admin sees nothing.
 */
export async function getUserDb() {
  if (!isAuthConfigured()) return null;
  const cookieStore = await cookies();
  return createServerClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL!,
    serverEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component, where cookies are read-only. The proxy refreshes
            // the session, so this is safe to ignore.
          }
        },
      },
    },
  );
}
