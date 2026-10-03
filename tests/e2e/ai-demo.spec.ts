import { expect, test } from "./support/fixtures";

// Live AI is switched off in the e2e server (AI_PROVIDER=none), so these runs are deterministic.

test("prepared examples answer instantly and hand off to the contact form", async ({ page }) => {
  await page.goto("/ai-demo");
  await page.getByRole("button", { name: "Customer service requests" }).click();
  const result = page.locator("article");
  await expect(result).toContainText("Suggested approach");
  await expect(result).toContainText("Prepared example");
  await expect(result).toContainText("Service requests tracked in a shared spreadsheet");
  await expect(result.getByRole("listitem").filter({ hasText: "Person" }).first()).toBeVisible();

  await result.getByRole("link", { name: "Discuss this with us" }).click();
  await expect(page).toHaveURL(/\/contact\?brief=/);
  await expect(page.locator("#problem")).toHaveValue(/Suggested in the AI demo/);
});

test("custom text shows a helpful message when live AI is off", async ({ page }) => {
  await page.goto("/ai-demo");
  await page.locator("#demo-input").fill("E2E: we track technician visits on paper job cards and lose them.");
  await page.getByRole("button", { name: "Analyse my process" }).click();
  const alert = page.locator("main [role=alert]");
  await expect(alert).toContainText("Live AI is offline");
  await expect(alert.getByRole("link", { name: "Tell us directly" })).toHaveAttribute("href", /\/contact\?brief=/);
});

test("too-short input is caught before calling the server", async ({ page }) => {
  await page.goto("/ai-demo");
  await page.locator("#demo-input").fill("help");
  await page.getByRole("button", { name: "Analyse my process" }).click();
  await expect(page.locator("main [role=alert]")).toContainText("at least 20 characters");
});

test("the API validates input and never needs the browser", async ({ request }) => {
  const bad = await request.post("/api/ai-demo", { data: { input: "hi" } });
  expect(bad.status()).toBe(400);
  const notJson = await request.post("/api/ai-demo", { data: "not json", headers: { "content-type": "application/json" } });
  expect(notJson.status()).toBe(400);
  expect((await request.get("/api/ai-demo")).status()).toBe(405);
});
