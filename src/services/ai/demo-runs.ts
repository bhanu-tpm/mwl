import "server-only";
import { serverEnv } from "@/lib/env.server";
import { getAdminDb } from "@/lib/supabase/admin";
import type { DemoResult } from "@/lib/validation/demo.schema";
import { consumeDemoRunInMemory, type LimitResult } from "@/services/rate-limit";

const HOUR = 60 * 60 * 1000;

/**
 * Demo usage limits. With the database: counts recent runs in `ai_demo_runs` (works across
 * serverless instances). Without it: the in-memory fallback. Every run that reached the AI
 * provider counts, including ones the model rejected as off-topic.
 */
export async function checkDemoLimit(ipHash: string): Promise<LimitResult> {
  const db = getAdminDb();
  if (!db) return consumeDemoRunInMemory(ipHash);

  const now = Date.now();
  const dayStart = new Date(new Date(now).toISOString().slice(0, 10)).toISOString();
  const counted = ["success", "rejected", "error"];
  const [perIp, perDay] = await Promise.all([
    db
      .from("ai_demo_runs")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .in("status", counted)
      .gte("created_at", new Date(now - HOUR).toISOString()),
    db
      .from("ai_demo_runs")
      .select("id", { count: "exact", head: true })
      .in("status", counted)
      .gte("created_at", dayStart),
  ]);

  if (perIp.error || perDay.error) {
    console.error("[ai-demo] limit check failed", perIp.error?.message ?? perDay.error?.message);
    return consumeDemoRunInMemory(ipHash); // degrade to the in-memory limiter, never to "unlimited"
  }
  if ((perDay.count ?? 0) >= serverEnv.AI_DEMO_MAX_PER_DAY) return { ok: false, reason: "daily_limit" };
  if ((perIp.count ?? 0) >= serverEnv.AI_DEMO_MAX_PER_IP_PER_HOUR) return { ok: false, reason: "rate_limited" };
  return { ok: true };
}

export type DemoRunLog = {
  input: string;
  ipHash: string;
  status: "success" | "error" | "rate_limited" | "rejected";
  output?: DemoResult;
  errorKind?: string;
  provider?: string;
  model?: string;
  promptVersion?: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
};

/** Records a demo run. Call via `after()` so logging never delays the visitor's answer. */
export async function logDemoRun(run: DemoRunLog) {
  const db = getAdminDb();
  if (!db) return;
  const { error } = await db.from("ai_demo_runs").insert({
    input: run.input.slice(0, 1000),
    ip_hash: run.ipHash,
    status: run.status,
    output: run.output ?? null,
    error_kind: run.errorKind ?? null,
    provider: run.provider ?? null,
    model: run.model ?? null,
    prompt_version: run.promptVersion ?? null,
    input_tokens: run.inputTokens ?? null,
    output_tokens: run.outputTokens ?? null,
    latency_ms: run.latencyMs ?? null,
  });
  if (error) console.error("[ai-demo] failed to log run", error.message);
}
