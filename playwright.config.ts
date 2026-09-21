import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3100", trace: "off", video: "off", screenshot: "off" },
  projects: [
    { name: "desktop", testMatch: /(?:public-(?:foundation|boundary)|consumer-preview-foundation|payment-channel-journey|product-confidence)\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", testMatch: /(?:public-(?:foundation|boundary)|consumer-preview-foundation|payment-channel-journey|product-confidence)\.spec\.ts/, use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
    { name: "accessibility", testMatch: /public-accessibility\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
