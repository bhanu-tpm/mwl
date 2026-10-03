import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws outside React Server Components; unit tests run plain Node.
      "server-only": fileURLToPath(new URL("./tests/unit/server-only-stub.ts", import.meta.url)),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // Deterministic env for modules that read configuration at import time.
    env: {
      NEXT_PUBLIC_SITE_URL: "https://example.test",
      AI_DEMO_MAX_PER_IP_PER_HOUR: "2",
      AI_DEMO_MAX_PER_DAY: "3",
      IP_HASH_SALT: "unit-test-salt-0123456789",
      GEMINI_API_KEY: "",
      NEXT_PUBLIC_SUPABASE_URL: "",
      SUPABASE_SECRET_KEY: "",
      CLIENT_IP_HEADER: "",
    },
  },
});
