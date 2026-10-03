import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validation/lead.schema";
import { demoInputSchema, demoResultSchema } from "@/lib/validation/demo.schema";
import { demoExamples } from "@/content/demo-examples";

const validLead = {
  name: "Asha Rao",
  email: "asha@example.com",
  problem: "We process supplier invoices by hand every month.",
  company: "",
  phone: "",
  companySize: "",
  industry: "",
  currentProcess: "",
  timeline: "",
  budget: "",
  additionalInfo: "",
};

describe("leadSchema", () => {
  it("accepts a minimal enquiry and turns empty optional fields into undefined", () => {
    const r = leadSchema.parse(validLead);
    expect(r.name).toBe("Asha Rao");
    expect(r.company).toBeUndefined();
    expect(r.budget).toBeUndefined();
  });

  it("trims values", () => {
    expect(leadSchema.parse({ ...validLead, name: "  Asha  " }).name).toBe("Asha");
  });

  it.each([
    ["email", { email: "not-an-email" }],
    ["problem", { problem: "too short" }],
    ["name", { name: "A" }],
    ["phone", { phone: "call me maybe" }],
    ["budget", { budget: "a million" }],
    ["industry", { industry: "spaceships" }],
  ])("rejects an invalid %s", (field, patch) => {
    const r = leadSchema.safeParse({ ...validLead, ...patch });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.path[0]).toBe(field);
  });

  it("caps very long text", () => {
    expect(leadSchema.safeParse({ ...validLead, problem: "x".repeat(3001) }).success).toBe(false);
  });
});

describe("demoInputSchema", () => {
  it("enforces 20–600 characters after trimming", () => {
    expect(demoInputSchema.safeParse({ input: "   too short   " }).success).toBe(false);
    expect(demoInputSchema.safeParse({ input: "x".repeat(601) }).success).toBe(false);
    expect(demoInputSchema.parse({ input: `  ${"a".repeat(30)}  ` }).input).toHaveLength(30);
  });

  it("gives a friendly message when the field is missing", () => {
    const r = demoInputSchema.safeParse({ text: "hello" });
    expect(r.error?.issues[0]?.message).toMatch(/describe the process/);
  });
});

describe("demoResultSchema", () => {
  it.each(demoExamples.map((e) => [e.id, e.result]))("accepts the prepared example %s", (_, result) => {
    expect(demoResultSchema.safeParse(result).success).toBe(true);
  });

  it("rejects unknown step types and categories", () => {
    const base = demoExamples[0].result;
    expect(demoResultSchema.safeParse({ ...base, solutionCategory: "magic" }).success).toBe(false);
    expect(
      demoResultSchema.safeParse({ ...base, workflow: [{ label: "x", type: "robot" }] }).success,
    ).toBe(false);
  });
});
