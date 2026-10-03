import "server-only";
import type { z } from "zod";

/**
 * Vendor-neutral contract for AI calls. Feature code depends only on this interface,
 * so swapping Gemini for another provider means adding one file and changing AI_PROVIDER.
 */
export interface AIProvider {
  readonly name: string;
  generateStructured<T>(opts: {
    system: string;
    input: string;
    schema: z.ZodType<T>;
    maxOutputTokens: number;
    timeoutMs: number;
  }): Promise<{
    data: T;
    model: string;
    usage: { inputTokens: number; outputTokens: number };
  }>;
}

export type AIErrorKind =
  | "not_configured" // no API key
  | "rate_limited" // provider quota exhausted
  | "timeout"
  | "blocked" // provider safety filters
  | "invalid_output" // response didn't match the schema
  | "upstream"; // any other provider failure

export class AIProviderError extends Error {
  constructor(
    readonly kind: AIErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
