import { defineConfig, devices } from "@playwright/test";
import { applicationOrigin, assertEmailHarnessEnvironment } from "./tests/email-harness/guard";

assertEmailHarnessEnvironment();
export default defineConfig({
  testDir: "./tests/browser", testMatch: /email-authentication\.spec\.ts/,
  fullyParallel: false, workers: 1, retries: 0, timeout: 30_000, reporter: [["list"]],
  // Credentials and email tokens must never enter recordings or failure screenshots.
  use: { baseURL: applicationOrigin, trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "email-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "email-mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "node --import tsx tests/email-harness/server.ts", url: `${applicationOrigin}/login`,
    reuseExistingServer: false, timeout: 60_000,
  },
});
