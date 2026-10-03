import "server-only";
import { createHash } from "node:crypto";
import { serverEnv } from "@/lib/env.server";

/**
 * Visitor identity helpers, plus the in-memory fallback for AI demo limits (per server
 * instance, resets on restart). With a database, limits come from `ai_demo_runs` instead
 * (src/services/ai/demo-runs.ts). The final cost backstop is the provider's free-tier quota:
 * no billing account is attached to the key.
 */

const HOUR = 60 * 60 * 1000;
const hits = new Map<string, number[]>();
let day = { key: "", count: 0 };

/** Visitors are identified only by a salted one-way hash of their IP, never the raw IP. */
export function hashIp(ip: string) {
  const salt = serverEnv.IP_HASH_SALT ?? "dev-only-salt-set-IP_HASH_SALT";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Best-effort client IP. Platform headers set by the host (Cloudflare, Netlify) come first
 * because visitors can't forge them. Otherwise use the *last* x-forwarded-for entry, which
 * the nearest proxy appended; the first entry is whatever the client chose to send.
 */
export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-nf-client-connection-ip") ||
    forwarded?.at(-1) ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export type LimitResult = { ok: true } | { ok: false; reason: "rate_limited" | "daily_limit" };

/** In-memory fallback: checks and, if allowed, records one AI run for this visitor. */
export function consumeDemoRunInMemory(ipHash: string, now = Date.now()): LimitResult {
  const today = new Date(now).toISOString().slice(0, 10);
  if (day.key !== today) day = { key: today, count: 0 };
  if (day.count >= serverEnv.AI_DEMO_MAX_PER_DAY) return { ok: false, reason: "daily_limit" };

  const recent = (hits.get(ipHash) ?? []).filter((t) => now - t < HOUR);
  if (recent.length >= serverEnv.AI_DEMO_MAX_PER_IP_PER_HOUR) {
    hits.set(ipHash, recent);
    return { ok: false, reason: "rate_limited" };
  }

  recent.push(now);
  hits.set(ipHash, recent);
  day.count++;

  // Keep memory bounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < HOUR)) hits.delete(k);
  }
  return { ok: true };
}
