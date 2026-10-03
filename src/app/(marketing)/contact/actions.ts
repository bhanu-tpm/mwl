"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createLead } from "@/services/leads/create-lead";
import { clientIp, hashIp } from "@/services/rate-limit";
import { leadSchema, type LeadField } from "@/lib/validation/lead.schema";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<LeadField, string>>;
  /** Echoed back so the form keeps the visitor's input after a failed submit. */
  values?: Partial<Record<LeadField, string>>;
};

const fields = Object.keys(leadSchema.shape) as LeadField[];

export async function submitLead(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: hidden from people, often filled by bots. Pretend success, store nothing.
  if (formData.get("website")) {
    return { status: "success" };
  }

  const raw = Object.fromEntries(
    fields.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<LeadField, string>;

  // Always validate on the server, whatever the browser checked.
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]]),
      ),
      values: raw,
    };
  }

  const h = await headers();
  const result = await createLead(parsed.data, {
    ipHash: hashIp(clientIp(h)),
    userAgent: h.get("user-agent") ?? undefined,
  });
  if (!result.ok && result.reason === "rate_limited") {
    return {
      status: "error",
      message:
        "We've already received several messages from you in the last hour. We'll be in touch soon, or email us directly.",
      values: raw,
    };
  }
  if (!result.ok) {
    return {
      status: "error",
      message:
        "Sorry, we couldn't send your message just now. Please email us directly, and we'll reply within one business day.",
      values: raw,
    };
  }

  return { status: "success" };
}
