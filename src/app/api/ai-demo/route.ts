import { findExample } from "@/content/demo-examples";
import { demoInputSchema, type DemoErrorCode, type DemoResponse } from "@/lib/validation/demo.schema";
import { isAIConfigured } from "@/services/ai";
import { analyzeBusinessProblem } from "@/services/ai/business-analyzer";
import { AIProviderError } from "@/services/ai/provider";
import { clientIp, consumeDemoRun, hashIp } from "@/services/rate-limit";

const messages: Record<DemoErrorCode, string> = {
  invalid_input: "Please describe the process in a sentence or two.",
  rate_limited: "You've reached the demo limit for now. Tell us about your process directly and we'll reply personally.",
  daily_limit: "The live demo is very busy today. Try one of the examples above, or tell us about your process directly.",
  unavailable: "The live demo is busy right now. Try one of the examples above, or tell us about your process directly.",
  not_configured: "Live AI is offline right now. The examples above still work, or tell us about your process directly.",
};

const statusFor: Record<DemoErrorCode, number> = {
  invalid_input: 400,
  rate_limited: 429,
  daily_limit: 429,
  unavailable: 503,
  not_configured: 503,
};

const error = (code: DemoErrorCode) =>
  Response.json({ status: "error", code, message: messages[code] } satisfies DemoResponse, {
    status: statusFor[code],
  });

export async function POST(request: Request) {
  // 1. Validate input (never trust the browser).
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("invalid_input");
  }
  const parsed = demoInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { status: "error", code: "invalid_input", message: parsed.error.issues[0]?.message ?? messages.invalid_input } satisfies DemoResponse,
      { status: 400 },
    );
  }
  const { input } = parsed.data;

  // 2. Curated examples: instant, free, and always available.
  const example = findExample(input);
  if (example) {
    return Response.json({ status: "ok", source: "example", result: example.result } satisfies DemoResponse);
  }

  // 3. Usage limits before any quota-bound call (no key → nothing to protect or count).
  if (!isAIConfigured()) return error("not_configured");
  const limit = consumeDemoRun(hashIp(clientIp(request.headers)));
  if (!limit.ok) return error(limit.reason);

  // 4. Ask the model; every response is validated against the output contract.
  try {
    const result = await analyzeBusinessProblem(input);
    return Response.json({ status: "ok", source: "ai", result } satisfies DemoResponse);
  } catch (err) {
    if (err instanceof AIProviderError) {
      console.warn("[ai-demo] provider error:", err.kind, err.message.slice(0, 200));
      return error(err.kind === "not_configured" ? "not_configured" : "unavailable");
    }
    console.error("[ai-demo] unexpected error:", err);
    return error("unavailable");
  }
}
