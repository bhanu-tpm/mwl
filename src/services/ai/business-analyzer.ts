import "server-only";
import { demoResultSchema, type DemoResult } from "@/lib/validation/demo.schema";
import { getAIProvider } from ".";
import {
  BUSINESS_ANALYZER_PROMPT_VERSION,
  BUSINESS_ANALYZER_SYSTEM,
  wrapProcess,
} from "./prompts/business-analyzer";

/** Turns a visitor's description of a process into a structured, practical suggestion. */
export async function analyzeBusinessProblem(input: string): Promise<DemoResult> {
  const started = Date.now();
  const { data, model, usage } = await getAIProvider().generateStructured({
    system: BUSINESS_ANALYZER_SYSTEM,
    input: wrapProcess(input),
    schema: demoResultSchema,
    maxOutputTokens: 900,
    timeoutMs: 20_000,
  });

  // Phase 5 stores this in ai_demo_runs; until then, a server log line.
  console.info("[ai-demo]", {
    prompt: BUSINESS_ANALYZER_PROMPT_VERSION,
    model,
    ...usage,
    latencyMs: Date.now() - started,
    isBusinessProblem: data.isBusinessProblem,
  });
  return data;
}
