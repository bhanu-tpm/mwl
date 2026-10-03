import { afterEach, describe, expect, it, vi } from "vitest";
import { createGeminiProvider } from "@/services/ai/gemini-provider";
import type { AIProviderError } from "@/services/ai/provider";
import { demoResultSchema } from "@/lib/validation/demo.schema";
import { demoExamples } from "@/content/demo-examples";

const good = demoExamples[0].result;
const reply = (status: number, body: unknown) =>
  new Response(typeof body === "string" ? body : JSON.stringify(body), { status });
const ok = (data: unknown) =>
  reply(200, {
    candidates: [{ content: { parts: [{ text: JSON.stringify(data) }] }, finishReason: "STOP" }],
    usageMetadata: { promptTokenCount: 310, candidatesTokenCount: 190 },
  });

function mockFetch(...responses: (Response | Error)[]) {
  const fn = vi.fn(async () => {
    const r = responses.shift();
    if (!r) throw new Error("unexpected extra call");
    if (r instanceof Error) throw r;
    return r;
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

const provider = createGeminiProvider({ apiKey: "test-key", model: "gemini-test" });
const run = () =>
  provider.generateStructured({
    system: "SYS",
    input: "<process>x</process>",
    schema: demoResultSchema,
    maxOutputTokens: 900,
    timeoutMs: 1000,
  });
const errorKind = async () => {
  try {
    await run();
    return "none";
  } catch (e) {
    return (e as AIProviderError).kind;
  }
};

afterEach(() => vi.unstubAllGlobals());

describe("Gemini provider", () => {
  it("sends a structured-output request and parses the answer", async () => {
    const fetch = mockFetch(ok(good));
    const r = await run();
    expect(r.data.problemSummary).toBe(good.problemSummary);
    expect(r.usage).toEqual({ inputTokens: 310, outputTokens: 190 });

    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/gemini-test:generateContent");
    expect(url).not.toContain("key=");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");

    const body = JSON.parse(init.body as string);
    expect(body.systemInstruction.parts[0].text).toBe("SYS");
    expect(body.generationConfig.responseMimeType).toBe("application/json");
    expect(body.generationConfig.responseSchema.type).toBe("OBJECT");
    expect(body.generationConfig.responseSchema.properties.workflow.items.properties.type.enum).toHaveLength(5);
    expect(JSON.stringify(body.generationConfig.responseSchema)).not.toMatch(/\$schema|additionalProperties/);
  });

  it("retries once on a 5xx, then succeeds", async () => {
    const fetch = mockFetch(reply(503, "busy"), ok(good));
    expect(await errorKind()).toBe("none");
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("gives up after one retry", async () => {
    mockFetch(reply(503, "busy"), reply(503, "busy"));
    expect(await errorKind()).toBe("upstream");
  });

  it("does not retry quota or bad-request errors", async () => {
    let fetch = mockFetch(reply(429, "quota"));
    expect(await errorKind()).toBe("rate_limited");
    expect(fetch).toHaveBeenCalledTimes(1);
    fetch = mockFetch(reply(401, "bad key"));
    expect(await errorKind()).toBe("upstream");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("maps timeouts, safety blocks, and malformed output", async () => {
    mockFetch(new DOMException("t", "TimeoutError"), new DOMException("t", "TimeoutError"));
    expect(await errorKind()).toBe("timeout");
    mockFetch(reply(200, { promptFeedback: { blockReason: "SAFETY" } }));
    expect(await errorKind()).toBe("blocked");
    mockFetch(reply(200, { candidates: [{ content: { parts: [{ text: "not json" }] } }] }));
    expect(await errorKind()).toBe("invalid_output");
    mockFetch(ok({ ...good, solutionCategory: "magic" }));
    expect(await errorKind()).toBe("invalid_output");
  });

  it("refuses to call without a key", async () => {
    const fetch = mockFetch();
    const unconfigured = createGeminiProvider({ model: "x" });
    await expect(
      unconfigured.generateStructured({ system: "", input: "", schema: demoResultSchema, maxOutputTokens: 1, timeoutMs: 1 }),
    ).rejects.toMatchObject({ kind: "not_configured" });
    expect(fetch).not.toHaveBeenCalled();
  });
});
