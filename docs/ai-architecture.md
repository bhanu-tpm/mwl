# AI Architecture

_Status: Phase 0 draft, awaiting approval_

## 9. Goals
1. Show useful AI for business problems in under 10 seconds.
2. Never expose keys, never allow unbounded spend.
3. Make the provider replaceable (OpenAI today; Anthropic, Gemini, or a local model later).

## Provider abstraction

```ts
// src/services/ai/provider.ts
export interface AIProvider {
  name: string;
  generateStructured<T>(opts: {
    system: string;
    input: string;
    schema: ZodSchema<T>;     // the output contract
    maxOutputTokens: number;
    timeoutMs: number;
  }): Promise<{ data: T; usage: { inputTokens: number; outputTokens: number }; model: string }>;
}
```

- `openai-provider.ts` implements the interface using OpenAI structured outputs (JSON schema derived from Zod).
- `getProvider()` selects the provider from `AI_PROVIDER`. The model comes from `AI_MODEL`.
- Feature code (`business-analyzer.ts`) knows only the interface, never the vendor SDK.
- Prompts live in `services/ai/prompts/` as versioned constants (`BUSINESS_ANALYZER_V1`). The prompt version is logged with each run.

## Demo output contract (Zod)

```ts
{
  isBusinessProblem: boolean,          // false → polite "please describe a business process" message
  problemSummary: string,              // "Manual invoice processing"
  suggestedSolution: string,           // "AI document extraction + validation + approval workflow"
  workflow: { step: string; type: "input" | "ai" | "human" | "system" | "output" }[], // 3–8 steps
  benefits: string[],                  // 3–5
  considerations: string[],            // 1–3, e.g. "Requires access to the email inbox"
  solutionCategory: "automation" | "business-app" | "knowledge" | "portal"  // links to /solutions
}
```

The UI renders `workflow` as a visual chain (Email → Extraction → AI validation → Approval → Database → Dashboard), with each step type shown as an icon or colour.

## Request flow

```
POST /api/ai-demo { input }
 1. Zod: 20–1,000 chars, trimmed
 2. Exact match on a preset example?   → return cached JSON (no API call, no cost)
 3. Rate limit (ai_demo_runs table):   per-IP/hour + global/day  → 429 with a friendly message
 4. Provider call: low max_output_tokens (~600), ~20s timeout, no retries on 4xx, 1 retry on 5xx/timeout
 5. Validate output against the schema; if invalid → error state
 6. Log run (input, output, tokens, latency, status, ip_hash)
 7. Return JSON
```

## Safety & guardrails
- **Prompt injection:** the system prompt fixes the task. User input is enclosed in delimiters and treated as data, and the schema-constrained output means the model can only return the demo shape. A no-tools, no-retrieval design means there is nothing to exfiltrate.
- **Off-topic or abusive input** returns `isBusinessProblem: false`, which shows a neutral message. The provider's moderation endpoint (free) runs before the main call.
- **Spend:** per-IP limit + global daily cap + output token cap + **a hard monthly budget limit set in the OpenAI dashboard** (the final backstop).
- **Disclaimer:** shown on every result: *"AI-generated suggestion for illustration only, not professional consulting advice."*
- **Privacy:** the UI tells users not to enter confidential information. IPs are hashed. Logs are deleted after 90 days.

## Failure states (all designed, not left to defaults)
| Case | User sees |
|---|---|
| Rate limited | "You've reached the demo limit. Tell us about your problem directly →" (contact CTA, so the failure still converts) |
| Provider down / timeout | "The demo is busy right now. Try an example, or contact us." Example buttons keep working because they are cached |
| Invalid output | Same as above, and logged as `error` |
| Not a business problem | "Try describing a process your team does manually…" with examples |

## Model choice
Use the provider's current small, low-cost model (configured via `AI_MODEL`). Estimated cost: roughly **$0.001 or less per run**, so even 200 runs/day costs about $6/month at most. The model is chosen at Phase 4 time based on current pricing.

## Later reuse
The same `AIProvider` interface carries over to CompanyBrainAI demos and client projects, which makes it the start of a reusable internal toolkit.
