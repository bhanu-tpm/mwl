import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Tests talk to the local Supabase (for setup, cleanup, and assertions) using .env.local.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const PORT = 3100;
const isCI = Boolean(process.env.CI);

/**
 * End-to-end tests against the production build (`npm run build` first) and the local
 * Supabase stack (`npm run db:start`). Live AI is switched off so runs are deterministic.
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["github"], ["list"]] : "list",
  globalSetup: "./tests/e2e/support/global-setup.ts",
  globalTeardown: "./tests/e2e/support/global-teardown.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      // Locally use the installed Chrome; CI installs Playwright's Chromium.
      use: { ...devices["Desktop Chrome"], channel: isCI ? undefined : "chrome" },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: isCI ? undefined : "chrome" },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
    env: {
      AI_PROVIDER: "none",
      CONTACT_MAX_PER_IP_PER_HOUR: "3",
      // Each test sends its own fake visitor IP in this header, so limits don't leak between tests.
      CLIENT_IP_HEADER: "x-e2e-client-ip",
    },
  },
});
