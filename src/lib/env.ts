import { z } from "zod";

/**
 * Public env — safe to read anywhere (inlined into the client bundle at build time).
 * Server-only secrets are validated in `src/lib/env.server.ts` (added in Phases 4–5).
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

// Each variable is referenced explicitly so Next.js can inline it.
const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});

if (!parsed.success) {
  throw new Error(
    `Invalid public environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const publicEnv = parsed.data;
