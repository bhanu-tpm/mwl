import "server-only";
import type { LeadInput } from "@/lib/validation/lead.schema";

export type CreateLeadResult = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

/**
 * Persists a validated enquiry.
 *
 * Phase 2 stub: storage and email notification arrive in Phase 5 (Supabase + Resend).
 * Until then, development logs the lead, and production refuses (so a live site can
 * never silently drop an enquiry; the form shows the email fallback instead).
 */
export async function createLead(lead: LeadInput): Promise<CreateLeadResult> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[leads] (dev stub) new enquiry:", {
      name: lead.name,
      email: lead.email,
      company: lead.company,
    });
    return { ok: true };
  }
  return { ok: false, reason: "not_configured" };
}
