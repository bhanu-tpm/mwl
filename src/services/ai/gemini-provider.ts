import "server-only";
import { z } from "zod";
import { AIProviderError, type AIProvider } from "./provider";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: string[];
  description?: string;
  minItems?: number;
  maxItems?: number;
};

/** Converts Zod's JSON Schema to the OpenAPI subset Gemini's `responseSchema` accepts. */
function toGeminiSchema(s: JsonSchema): Record<string, unknown> {
  const out: Record<string, unknown> = { type: (s.type ?? "string").toUpperCase() };
  if (s.description) out.description = s.description;
  if (s.enum) out.enum = s.enum;
  if (s.properties) {
    out.properties = Object.fromEntries(
      Object.entries(s.properties).map(([k, v]) => [k, toGeminiSchema(v)]),
    );
    out.required = s.required ?? [];
    out.propertyOrdering = Object.keys(s.properties);
  }
  if (s.items) out.items = toGeminiSchema(s.items);
  if (s.minItems !== undefined) out.minItems = s.minItems;
  if (s.maxItems !== undefined) out.maxItems = s.maxItems;
  return out;
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
};

export function createGeminiProvider({ apiKey, model }: { apiKey?: string; model: string }): AIProvider {
  return {
    name: "gemini",
    async generateStructured({ system, input, schema, maxOutputTokens, timeoutMs }) {
      if (!apiKey) throw new AIProviderError("not_configured", "GEMINI_API_KEY is not set");

      const body = JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: toGeminiSchema(z.toJSONSchema(schema) as JsonSchema),
          maxOutputTokens,
          temperature: 0.3,
        },
      });

      // One retry on timeouts and 5xx; never on 4xx (bad request, quota, auth).
      for (let attempt = 0; ; attempt++) {
        let res: Response;
        try {
          res = await fetch(`${ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            body,
            signal: AbortSignal.timeout(timeoutMs),
            cache: "no-store",
          });
        } catch (err) {
          if (attempt === 0) continue;
          const timedOut = err instanceof DOMException && err.name === "TimeoutError";
          throw new AIProviderError(timedOut ? "timeout" : "upstream", String(err));
        }

        if (res.status >= 500 && attempt === 0) continue;
        if (res.status === 429) throw new AIProviderError("rate_limited", "Provider quota exhausted");
        if (!res.ok) {
          throw new AIProviderError("upstream", `Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
        }

        const json = (await res.json()) as GeminiResponse;
        if (json.promptFeedback?.blockReason) {
          throw new AIProviderError("blocked", json.promptFeedback.blockReason);
        }
        const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";

        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          throw new AIProviderError("invalid_output", `Non-JSON output (${json.candidates?.[0]?.finishReason})`);
        }
        const result = schema.safeParse(parsed);
        if (!result.success) {
          throw new AIProviderError("invalid_output", z.prettifyError(result.error));
        }

        return {
          data: result.data,
          model,
          usage: {
            inputTokens: json.usageMetadata?.promptTokenCount ?? 0,
            outputTokens: json.usageMetadata?.candidatesTokenCount ?? 0,
          },
        };
      }
    },
  };
}
