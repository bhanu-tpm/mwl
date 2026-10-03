import { randomUUID } from "node:crypto";
import { ADMIN, E2E_DOMAIN, NON_ADMIN, adminDb } from "./support/db";
import { expect, test } from "./support/fixtures";
import type { Page } from "@playwright/test";

async function signIn(page: Page, user: { email: string; password: string }) {
  await page.goto("/admin/login");
  await page.locator("#email").fill(user.email);
  await page.locator("#password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("signed-out visitors are sent to the login page", async ({ page }) => {
  await page.goto("/admin/leads/00000000-0000-0000-0000-000000000000");
  await expect(page).toHaveURL(/\/admin\/login$/);
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
});

test("a wrong password gets a generic error", async ({ page }) => {
  await signIn(page, { email: ADMIN.email, password: "WrongPassword123" });
  await expect(page.locator("main [role=alert]")).toContainText("don't match an admin account");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("a signed-in non-admin cannot get in", async ({ page }) => {
  await signIn(page, NON_ADMIN);
  await expect(page.locator("main [role=alert]")).toContainText("don't match an admin account");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("an admin can review a lead, update it, and sign out", async ({ page }) => {
  const tag = randomUUID().slice(0, 8);
  const name = `E2E Admin Flow ${tag}`; // unique per attempt, so retries never pick another run's lead
  const email = `admin-flow-${tag}@${E2E_DOMAIN}`;
  const { data: lead, error } = await adminDb()
    .from("leads")
    .insert({ name, email, problem_description: "E2E: quotes are prepared by hand in Word.", ip_hash: "e2e" })
    .select("id")
    .single();
  expect(error).toBeNull();

  await signIn(page, ADMIN);
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("link", { name: new RegExp(name) }).click();
  await expect(page).toHaveURL(new RegExp(`/admin/leads/${lead!.id}$`));
  await page.waitForLoadState("networkidle"); // hydrated before editing the form
  await expect(page.locator("main")).toContainText("quotes are prepared by hand");

  await page.locator("#status").selectOption("proposal");
  await page.locator("#notes").fill("E2E: quote sent on Friday.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved")).toBeVisible();

  const { data } = await adminDb().from("leads").select("status, notes").eq("id", lead!.id).single();
  expect(data).toEqual({ status: "proposal", notes: "E2E: quote sent on Friday." });

  await page.goto("/admin?status=proposal");
  await expect(page.getByRole("link", { name: new RegExp(name) })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
