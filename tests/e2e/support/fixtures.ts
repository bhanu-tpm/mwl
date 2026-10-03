import { randomInt } from "node:crypto";
import { test as base, expect } from "@playwright/test";

/**
 * - Every test is a different "visitor" (its own fake IP via CLIENT_IP_HEADER), so per-visitor
 *   limits never leak between tests.
 * - The first-visit intro is skipped unless a test opts in with `test.use({ intro: true })`.
 */
export const test = base.extend<{ intro: boolean; visitorIp: string }>({
  intro: [false, { option: true }],
  // Playwright's fixture callback is conventionally named `use`; renamed so React's hooks lint
  // rule doesn't mistake it for a hook.
  visitorIp: async ({}, provide) => {
    await provide(`203.0.${randomInt(0, 255)}.${randomInt(1, 255)}`);
  },
  context: async ({ context, intro, visitorIp }, provide) => {
    await context.setExtraHTTPHeaders({ "x-e2e-client-ip": visitorIp });
    if (!intro) await context.addInitScript(() => sessionStorage.setItem("mwl-intro", "1"));
    await provide(context);
  },
});

export { expect };

export const publicPages = ["/", "/solutions", "/ai-demo", "/how-we-work", "/about", "/contact", "/privacy"];
