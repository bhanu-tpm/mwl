import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findExample, demoExamples } from "@/content/demo-examples";
import { businessProblems, problemsToEnquiry } from "@/content/problems";
import { solutions } from "@/content/solutions";
import { aiScenarios, REVIEW_THRESHOLD } from "@/content/ai-scenarios";
import { breadcrumbJsonLd, organizationJsonLd, servicesJsonLd } from "@/lib/json-ld";

describe("prepared demo examples", () => {
  it("match regardless of case and spacing", () => {
    const ex = demoExamples[0];
    expect(findExample(`  ${ex.input.toUpperCase().replace(/ /g, "   ")}  `)?.id).toBe(ex.id);
    expect(findExample("something else entirely")).toBeUndefined();
  });

  it("cover all four solution categories", () => {
    expect(new Set(demoExamples.map((e) => e.result.solutionCategory))).toEqual(
      new Set(["automation", "business-app", "knowledge", "portal"]),
    );
  });

  it("each include a human review step", () => {
    for (const e of demoExamples) expect(e.result.workflow.some((s) => s.type === "human")).toBe(true);
  });
});

describe("problem picker → contact pre-fill", () => {
  it("builds an enquiry from known ids and ignores unknown ones", () => {
    expect(problemsToEnquiry(["excel", "approvals", "nope"])).toBe(
      "We're dealing with: Everything runs on Excel; Approvals take days.\n\n",
    );
    expect(problemsToEnquiry([""])).toBe("");
  });

  it("every problem links to a real solution section", () => {
    const ids = new Set(solutions.map((s) => s.id));
    for (const p of businessProblems) expect(ids.has(p.solutionId)).toBe(true);
  });
});

describe("AI in practice scenarios", () => {
  it("each have a low-confidence field or a failed check that sends work to a person", () => {
    for (const s of aiScenarios) {
      const needsReview = s.extracted.some((f) => f.confidence < REVIEW_THRESHOLD) || s.checks.some((c) => !c.ok);
      expect(needsReview, s.id).toBe(true);
    }
  });
});

describe("structured data", () => {
  it("escapes '<' so text can never close the script tag", () => {
    const html = JSON.stringify(breadcrumbJsonLd([{ name: "</script><b>", path: "/x" }])).replace(/</g, "\\u003c");
    expect(html).not.toContain("</script>");
  });

  it("builds Organization and Service entries that reference the organization", () => {
    const org = organizationJsonLd();
    expect(org["@type"]).toBe("Organization");
    const services = servicesJsonLd(solutions);
    expect(services).toHaveLength(solutions.length);
    expect(services[0].provider["@id"]).toBe(org["@id"]);
  });
});

describe("content guard", () => {
  // The founder asked never to mention Tally anywhere on the site.
  it("never mentions Tally in site source or docs", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(tsx?|md|css)$/.test(name)) files.push(p);
      }
    };
    walk("src");
    walk("docs");
    // resume-prompt.md states the rule itself ("never mention Tally"), so it is exempt.
    const offenders = files
      .filter((f) => !f.endsWith("resume-prompt.md"))
      .filter((f) => /\btally\b/i.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
