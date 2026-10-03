import { expect, test } from "./support/fixtures";

test.describe("first-visit intro", () => {
  test.use({ intro: true });

  test("plays once, clears in under 2.5s, and is skipped on reload", async ({ page }) => {
    await page.goto("/");
    const overlay = page.locator(".intro");
    await expect(overlay).toBeVisible();
    await expect(overlay).toBeHidden({ timeout: 2_500 });
    await page.reload();
    await expect(overlay).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test("problem picker reveals fixes and pre-fills the contact form", async ({ page }) => {
  await page.goto("/");
  const excel = page.getByRole("button", { name: /Everything runs on Excel/ });
  await excel.click();
  await expect(excel).toHaveAttribute("aria-pressed", "true");
  await expect(excel).toContainText("How we fix it");
  await page.getByRole("button", { name: /Approvals take days/ }).click();
  await expect(page.locator("#problems [aria-live]")).toContainText("2 of 7 selected");

  await page.getByRole("link", { name: /Discuss these with us/ }).first().click();
  await expect(page).toHaveURL(/\/contact\?problems=excel,approvals/);
  await expect(page.locator("#problem")).toHaveValue(/Everything runs on Excel; Approvals take days/);
});

test("AI in practice tabs switch by click and keyboard", async ({ page }) => {
  await page.goto("/#ai");
  const run = page.locator("#ai-run");
  await page.getByRole("tab", { name: /Manufacturing/ }).click();
  await expect(run).toContainText("Supplier invoice matching");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Logistics/ })).toHaveAttribute("aria-selected", "true");
  await expect(run).toContainText("Proof of delivery");
});

test("navigation works on every screen size", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Solutions" }).click();
  } else {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Solutions" }).click();
  }
  await expect(page).toHaveURL(/\/solutions$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("real business problems");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
});
