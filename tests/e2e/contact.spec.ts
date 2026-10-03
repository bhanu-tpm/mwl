import { randomUUID } from "node:crypto";
import { E2E_DOMAIN, adminDb } from "./support/db";
import { expect, test } from "./support/fixtures";
import type { Page } from "@playwright/test";

async function fillMinimal(page: Page, email: string, problem = "E2E: our approvals live in email threads and get stuck.") {
  await page.goto("/contact");
  await page.locator("#problem").fill(problem);
  await page.locator("#name").fill("E2E Visitor");
  await page.locator("#email").fill(email);
}

test("server-side validation shows field errors and keeps the input", async ({ page }) => {
  await page.goto("/contact");
  await page.locator("form").evaluate((f) => f.setAttribute("novalidate", ""));
  await page.locator("#problem").fill("too short");
  await page.locator("#email").fill("not-an-email");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("main [role=alert]")).toContainText("check the highlighted fields");
  await expect(page.locator("#problem-error")).toBeVisible();
  await expect(page.locator("#email-error")).toBeVisible();
  await expect(page.locator("#problem")).toHaveValue("too short");
  await expect(page.locator("#problem")).toBeFocused();
});

test("an enquiry is stored in the database", async ({ page }) => {
  const email = `lead-${randomUUID().slice(0, 8)}@${E2E_DOMAIN}`;
  await fillMinimal(page, email);
  await page.locator("#company").fill("E2E Industries");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("received your message");

  const { data } = await adminDb().from("leads").select("name, company, status, source, ip_hash").eq("email", email).single();
  expect(data).toMatchObject({ name: "E2E Visitor", company: "E2E Industries", status: "new", source: "contact_form" });
  expect(data?.ip_hash).toMatch(/^[0-9a-f]{32}$/);
});

test("the honeypot silently drops bots", async ({ page }) => {
  const email = `bot-${randomUUID().slice(0, 8)}@${E2E_DOMAIN}`;
  await fillMinimal(page, email);
  await page.locator("#website").evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("received your message");
  const { count } = await adminDb().from("leads").select("id", { count: "exact", head: true }).eq("email", email);
  expect(count).toBe(0);
});

test("a visitor sending too many enquiries is politely limited", async ({ page }) => {
  // CONTACT_MAX_PER_IP_PER_HOUR=3 on the e2e server; this test is one visitor (one fake IP).
  for (let i = 0; i < 3; i++) {
    await fillMinimal(page, `limit-${i}-${randomUUID().slice(0, 6)}@${E2E_DOMAIN}`);
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByRole("status")).toContainText("received your message");
  }
  await fillMinimal(page, `limit-4@${E2E_DOMAIN}`);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("main [role=alert]")).toContainText("several messages from you");
});
