import "server-only";
import { serverEnv } from "@/lib/env.server";
import { createGeminiProvider } from "./gemini-provider";
import type { AIProvider } from "./provider";

let provider: AIProvider | undefined;

/** The configured AI provider (AI_PROVIDER). Add new providers here. */
export function getAIProvider(): AIProvider {
  provider ??= createGeminiProvider({ apiKey: serverEnv.GEMINI_API_KEY, model: serverEnv.AI_MODEL });
  return provider;
}

export function isAIConfigured() {
  return serverEnv.AI_PROVIDER !== "none" && Boolean(serverEnv.GEMINI_API_KEY);
}
