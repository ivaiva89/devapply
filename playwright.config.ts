import { defineConfig, devices } from "@playwright/test";

// Its own port, so a `pnpm dev` already on 3000 is never the app under test.
const port = 3100;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.test.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm start --port ${port}`,
    // Ready when the port accepts connections: no route answers 2xx yet.
    port,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
