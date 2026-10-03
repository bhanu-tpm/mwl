import "server-only";
import { publicEnv } from "@/lib/env";
import { isDatabaseConfigured, isEmailConfigured, serverEnv } from "@/lib/env.server";
import { getAdminDb } from "@/lib/supabase/admin";
import type { LeadInput } from "@/lib/validation/lead.schema";
import { sendLeadNotification } from "@/services/notifications/lead-email";

export type CreateLeadResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "failed" | "rate_limited" };

type Meta = { ipHash: string; userAgent?: string };

/** Too many enquiries from one visitor in the last hour? (spam guard; needs the database) */
async function tooManyRecent(ipHash: string) {
  const db = getAdminDb();
  if (!db) return false;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await db
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) {
    console.error("[leads] rate-limit check failed", error.message);
    return false; // never block a real lead because the check failed
  }
  return (count ?? 0) >= serverEnv.CONTACT_MAX_PER_IP_PER_HOUR;
}

/**
 * Stores a validated enquiry and emails the founder. The two happen independently: if either
 * succeeds the visitor sees success, so a database outage never silently loses a lead.
 */
export async function createLead(lead: LeadInput, meta: Meta): Promise<CreateLeadResult> {
  if (!isDatabaseConfigured() && !isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[leads] (no database or email configured) new enquiry:", {
        name: lead.name,
        email: lead.email,
      });
      return { ok: true };
    }
    return { ok: false, reason: "not_configured" };
  }

  if (await tooManyRecent(meta.ipHash)) return { ok: false, reason: "rate_limited" };

  const db = getAdminDb();
  const stored = db
    ? db
        .from("leads")
        .insert({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          phone: lead.phone,
          company_size: lead.companySize,
          industry: lead.industry,
          problem_description: lead.problem,
          current_process: lead.currentProcess,
          timeline: lead.timeline,
          budget: lead.budget,
          additional_info: lead.additionalInfo,
          ip_hash: meta.ipHash,
          user_agent: meta.userAgent?.slice(0, 400),
        })
        .select("id")
        .single()
        .then(({ data, error }) => {
          if (error) throw new Error(error.message);
          return data.id as string;
        })
    : Promise.reject(new Error("database not configured"));

  // Email doesn't wait for the insert's id, so a slow or failed database can't delay it.
  const [insert, email] = await Promise.allSettled([
    stored,
    sendLeadNotification(lead, { adminUrl: `${publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/admin` }),
  ]);

  const savedOk = insert.status === "fulfilled";
  const emailedOk = email.status === "fulfilled" && email.value.ok;
  if (!savedOk && db) console.error("[leads] insert failed", (insert as PromiseRejectedResult).reason);

  return savedOk || emailedOk ? { ok: true } : { ok: false, reason: "failed" };
}
