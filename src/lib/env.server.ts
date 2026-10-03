import "server-only";
import { z } from "zod";

/**
 * Server-only environment. Every AI variable is optional so the site runs without a key:
 * the demo then serves its built-in examples and reports live AI as unavailable.
 */
const serverEnvSchema = z.object({
  AI_PROVIDER: z.enum(["gemini"]).default("gemini"),
  AI_MODEL: z.string().min(1).default("gemini-3.5-flash-lite"),
  GEMINI_API_KEY: z.string().min(1).optional(),
  AI_DEMO_MAX_PER_IP_PER_HOUR: z.coerce.number().int().positive().default(5),
  AI_DEMO_MAX_PER_DAY: z.coerce.number().int().positive().default(200),
  IP_HASH_SALT: z.string().min(16).optional(),

  // Supabase (Phase 5). Optional so the site still runs without a database.
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),

  // Lead notification email via Resend (Phase 5). Optional.
  RESEND_API_KEY: z.string().min(1).optional(),
  LEAD_NOTIFICATION_EMAIL: z.email().optional(),
  EMAIL_FROM: z.string().min(3).default("Mithila Web Labs <onboarding@resend.dev>"),
  CONTACT_MAX_PER_IP_PER_HOUR: z.coerce.number().int().positive().default(5),
});

const parsed = serverEnvSchema.safeParse({
  AI_PROVIDER: process.env.AI_PROVIDER || undefined,
  AI_MODEL: process.env.AI_MODEL || undefined,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || undefined,
  AI_DEMO_MAX_PER_IP_PER_HOUR: process.env.AI_DEMO_MAX_PER_IP_PER_HOUR || undefined,
  AI_DEMO_MAX_PER_DAY: process.env.AI_DEMO_MAX_PER_DAY || undefined,
  IP_HASH_SALT: process.env.IP_HASH_SALT || undefined,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || undefined,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || undefined,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  LEAD_NOTIFICATION_EMAIL: process.env.LEAD_NOTIFICATION_EMAIL || undefined,
  EMAIL_FROM: process.env.EMAIL_FROM || undefined,
  CONTACT_MAX_PER_IP_PER_HOUR: process.env.CONTACT_MAX_PER_IP_PER_HOUR || undefined,
});

if (!parsed.success) {
  throw new Error(`Invalid server environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const serverEnv = parsed.data;

export const isDatabaseConfigured = () =>
  Boolean(serverEnv.NEXT_PUBLIC_SUPABASE_URL && serverEnv.SUPABASE_SECRET_KEY);

export const isAuthConfigured = () =>
  Boolean(serverEnv.NEXT_PUBLIC_SUPABASE_URL && serverEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const isEmailConfigured = () =>
  Boolean(serverEnv.RESEND_API_KEY && serverEnv.LEAD_NOTIFICATION_EMAIL);
