/**
 * Public env — safe to read anywhere (inlined into the client bundle at build time).
 * Deliberately Zod-free: this module reaches client components through siteConfig, and the
 * validator would add weight and trip the CSP's eval check. Server secrets live in env.server.ts.
 */
function siteUrl(): string {
  // Referenced explicitly so Next.js can inline it.
  const value = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
    return value;
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_SITE_URL: "${value}" (expected an http(s) URL)`);
  }
}

export const publicEnv = {
  NEXT_PUBLIC_SITE_URL: siteUrl(),
};
