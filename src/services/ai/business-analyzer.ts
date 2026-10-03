import "server-only";
import { demoResultSchema, type DemoResult } from "@/lib/validation/demo.schema";
import { getAIProvider } from ".";
import {
  BUSINESS_ANALYZER_PROMPT_VERSION,
  BUSINESS_ANALYZER_SYSTEM,
  wrapProcess,
} from "./prompts/business-analyzer";

/** Turns a visitor's description of a process into a structured, practical suggestion. */
export async function analyzeBusinessProblem(input: string): Promise<{
  result: DemoResult;
  meta: { provider: string; model: string; promptVersion: string; inputTokens: number; outputTokens: number; latencyMs: number };
}> {
  const started = Date.now();
  const provider = getAIProvider();
  const { data, model, usage } = await provider.generateStructured({
    system: BUSINESS_ANALYZER_SYSTEM,
    input: wrapProcess(input),
    schema: demoResultSchema,
    maxOutputTokens: 900,
    timeoutMs: 20_000,
  });

  return {
    result: data,
    meta: {
      provider: provider.name,
      model,
      promptVersion: BUSINESS_ANALYZER_PROMPT_VERSION,
      ...usage,
      latencyMs: Date.now() - started,
    },
  };
}
