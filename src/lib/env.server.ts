import "server-only";
import { z } from "zod";

/**
 * Server-only environment. Every AI variable is optional so the site runs without a key:
 * the demo then serves its built-in examples and reports live AI as unavailable.
 */
const serverEnvSchema = z.object({
  AI_PROVIDER: z.enum(["gemini"]).default("gemini"),
  AI_MODEL: z.string().min(1).default("gemini-2.5-flash-lite"),
  GEMINI_API_KEY: z.string().min(1).optional(),
  AI_DEMO_MAX_PER_IP_PER_HOUR: z.coerce.number().int().positive().default(5),
  AI_DEMO_MAX_PER_DAY: z.coerce.number().int().positive().default(200),
  IP_HASH_SALT: z.string().min(16).optional(),
});

const parsed = serverEnvSchema.safeParse({
  AI_PROVIDER: process.env.AI_PROVIDER || undefined,
  AI_MODEL: process.env.AI_MODEL || undefined,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || undefined,
  AI_DEMO_MAX_PER_IP_PER_HOUR: process.env.AI_DEMO_MAX_PER_IP_PER_HOUR || undefined,
  AI_DEMO_MAX_PER_DAY: process.env.AI_DEMO_MAX_PER_DAY || undefined,
  IP_HASH_SALT: process.env.IP_HASH_SALT || undefined,
});

if (!parsed.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const serverEnv = parsed.data;
