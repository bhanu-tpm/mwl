import "server-only";
import { isEmailConfigured, serverEnv } from "@/lib/env.server";
import {
  budgetOptions,
  companySizeOptions,
  industryOptions,
  timelineOptions,
  type LeadInput,
} from "@/lib/validation/lead.schema";

const label = (opts: readonly { value: string; label: string }[], v?: string) =>
  v ? (opts.find((o) => o.value === v)?.label ?? v) : undefined;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Emails the founder about a new enquiry via Resend's REST API (free tier).
 * Sent independently of the database write, so a database outage never loses a lead.
 */
export async function sendLeadNotification(lead: LeadInput, opts: { leadId?: string; adminUrl?: string } = {}) {
  if (!isEmailConfigured()) return { ok: false as const, reason: "not_configured" as const };

  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Phone / WhatsApp", lead.phone],
    ["Company size", label(companySizeOptions, lead.companySize)],
    ["Industry", label(industryOptions, lead.industry)],
    ["Timeline", label(timelineOptions, lead.timeline)],
    ["Budget", label(budgetOptions, lead.budget)],
  ];
  const sections: [string, string | undefined][] = [
    ["Business problem", lead.problem],
    ["How it's handled today", lead.currentProcess],
    ["Anything else", lead.additionalInfo],
  ];

  const text = [
    "New enquiry from the website",
    "",
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    ...sections.filter(([, v]) => v).flatMap(([k, v]) => [`${k}:`, v!, ""]),
    opts.adminUrl ? `Open in admin: ${opts.adminUrl}` : "",
  ].join("\n");

  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#141413;line-height:1.5">
<h2 style="margin:0 0 12px">New enquiry from the website</h2>
<table cellpadding="4" style="border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="color:#5c5b57;padding-right:16px">${escape(k)}</td><td>${escape(v!)}</td></tr>`)
    .join("")}</table>
${sections
  .filter(([, v]) => v)
  .map(([k, v]) => `<h3 style="margin:18px 0 4px;font-size:14px">${escape(k)}</h3><p style="margin:0;white-space:pre-wrap">${escape(v!)}</p>`)
  .join("")}
${opts.adminUrl ? `<p style="margin-top:20px"><a href="${escape(opts.adminUrl)}">Open in admin →</a></p>` : ""}
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: serverEnv.EMAIL_FROM,
        to: [serverEnv.LEAD_NOTIFICATION_EMAIL],
        reply_to: lead.email,
        subject: `New enquiry: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[lead-email] Resend error", res.status, (await res.text()).slice(0, 300));
      return { ok: false as const, reason: "failed" as const };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("[lead-email] send failed", err);
    return { ok: false as const, reason: "failed" as const };
  }
}
