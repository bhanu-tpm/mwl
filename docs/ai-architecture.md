# AI Architecture

_Status: implemented in Phase 4 (2026-10-03)_

## Implementation map
| Piece | File |
|---|---|
| Output contract + input limits | `src/lib/validation/demo.schema.ts` |
| Provider interface + errors | `src/services/ai/provider.ts` |
| Gemini provider (REST `generateContent`, JSON schema from Zod) | `src/services/ai/gemini-provider.ts` |
| Provider selection | `src/services/ai/index.ts` |
| Prompt (versioned) | `src/services/ai/prompts/business-analyzer.ts` |
| Analyzer | `src/services/ai/business-analyzer.ts` |
| Prepared examples (zero cost) | `src/content/demo-examples.ts` |
| Usage limits (interim, in-memory) | `src/services/rate-limit.ts` |
| API route | `src/app/api/ai-demo/route.ts` |
| UI | `src/components/demo/ai-demo.tsx`, `src/app/(marketing)/ai-demo/page.tsx` |

**Interim limits:** per-IP and daily caps are held in memory per server instance until Phase 5 moves them to the `ai_demo_runs` table. The real cost backstop is the free-tier quota (no billing attached).

**Without `GEMINI_API_KEY`:** prepared examples work; custom input returns `not_configured` and the UI offers the contact form.

## 9. Goals
1. Show useful AI for business problems in under 10 seconds.
2. Never expose keys, never allow unbounded spend.
3. Make the provider replaceable. **Free-only constraint (decided 2026-10-02):** start with the Google Gemini API free tier; OpenAI/Anthropic can be added later as another provider file.

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

- `gemini-provider.ts` implements the interface using Gemini structured output (JSON schema derived from Zod).
- Free-tier caveats: Google may use free-tier prompts to improve its products (disclosed in the privacy policy, and users are told not to enter confidential data), and free-tier rate limits apply. Our own daily cap stays below them. Groq's free tier is the fallback provider.
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
- **Spend:** per-IP limit + global daily cap + output token cap + **no billing account attached to the Gemini key**, so the free tier can never incur charges (the final backstop).
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
Use the provider's current free-tier "flash"-class model (configured via `AI_MODEL`). **Cost: ₹0.** When the free quota runs out the demo shows its friendly "busy" state, and the cached examples keep working.

## Later reuse
The same `AIProvider` interface carries over to CompanyBrainAI demos and client projects, which makes it the start of a reusable internal toolkit.
