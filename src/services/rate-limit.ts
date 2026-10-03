import "server-only";
import { createHash } from "node:crypto";
import { serverEnv } from "@/lib/env.server";

/**
 * AI demo usage limits: per visitor per hour, plus a global daily ceiling.
 *
 * Interim in-memory store (per server instance, resets on restart). Phase 5 replaces it with
 * counts from the `ai_demo_runs` table, which also works across serverless instances
 * (docs/database-design.md). The final cost backstop is the provider's free-tier quota:
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

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

export type LimitResult = { ok: true } | { ok: false; reason: "rate_limited" | "daily_limit" };

/** Checks and, if allowed, records one AI run for this visitor. */
export function consumeDemoRun(ipHash: string, now = Date.now()): LimitResult {
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
