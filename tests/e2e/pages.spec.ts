import AxeBuilder from "@axe-core/playwright";
import { expect, publicPages, test } from "./support/fixtures";

test.describe("every public page", () => {
  for (const path of publicPages) {
    test(`${path} loads cleanly, is secure, and is accessible`, async ({ page, context }) => {
      const consoleErrors: string[] = [];
      page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
      const cdp = await context.newCDPSession(page);
      const cspIssues: string[] = [];
      cdp.on("Audits.issueAdded", ({ issue }) => {
        if (issue.code.includes("ContentSecurityPolicy")) cspIssues.push(JSON.stringify(issue.details));
      });
      await cdp.send("Audits.enable");

      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/Mithila Web Labs/);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

      const headers = res!.headers();
      expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
      expect(headers["strict-transport-security"]).toContain("max-age=");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-powered-by"]).toBeUndefined();

      const a11y = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"]).analyze();
      expect(a11y.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);

      await page.waitForTimeout(300); // let late console/CSP reports arrive
      expect(cspIssues).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
});

test("unknown pages return a friendly 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn't exist");
  await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
});

test("robots.txt and sitemap.xml are published", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");
  expect(robots).toContain("Sitemap:");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/solutions", "/ai-demo", "/contact"]) expect(sitemap).toContain(`${path}</loc>`);
  expect(sitemap).not.toContain("/admin");
});

test("social share image renders", async ({ request }) => {
  const res = await request.get("/opengraph-image");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/png");
});
