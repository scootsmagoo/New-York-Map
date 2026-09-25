import { defineConfig, devices } from "@playwright/test";

/**
 * Browser tests against the production build (`vite preview`), in WebKit —
 * Safari is where this map has had its performance trouble — and Chromium.
 * Run: npm run build && npm run test:e2e
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:4173/",
    viewport: { width: 1400, height: 900 },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "webkit",
      testIgnore: /phone\.spec/,
      use: { ...devices["Desktop Safari"], viewport: { width: 1400, height: 900 } },
    },
    {
      name: "chromium",
      testIgnore: /phone\.spec/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1400, height: 900 } },
    },
    { name: "iphone", testMatch: /phone\.spec/, use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173/",
    reuseExistingServer: !process.env.CI,
  },
});
