import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
import { getBaseURL } from "./src/utils/env.utils";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 180_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: getBaseURL(),

    launchOptions: {
      headless: false,
      slowMo: 300,
      args: [
        "--start-maximized",
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-infobars",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-popup-blocking",
        "--disable-notifications",
        "--disable-features=Translate,PasswordManagerOnboarding",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-features=AutomationControlled",
        "--lang=en-IN",
        "--window-size=1920,1080",
      ],
    },

    // Real browser experience
    viewport: null,

    // Airline/UAT friendly settings
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",

    // Auto handle SSL issues
    ignoreHTTPSErrors: true,

    // Downloads
    acceptDownloads: true,

    // Browser permissions
    permissions: ["geolocation", "clipboard-read", "clipboard-write"],

    geolocation: {
      latitude: 28.6139,
      longitude: 77.209,
    },

    // Real Chrome UA
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",

    extraHTTPHeaders: {
      "Accept-Language": "en-IN,en;q=0.9",
      ...(process.env.MOD_HEADER_VALUE
        ? { "was-secret": process.env.MOD_HEADER_VALUE }
        : {}),
    },

    actionTimeout: 10_000,
    navigationTimeout: 30_000,

    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
});
