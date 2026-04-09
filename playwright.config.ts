import { defineConfig } from "@playwright/test";

export default defineConfig({
  globalSetup: "./tests/global-setup.ts",
  testDir: "./tests",
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: "http://127.0.0.1:4173/game/",
    headless: true,
    trace: "on-first-retry",
    launchOptions: {
      args: ["--disable-features=WebRtcHideLocalIpsWithMdns"]
    }
  },
  webServer: {
    command:
      "APP_BASE_URL=/game/ npm run build && APP_BASE_URL=/game/ npm run serve:test",
    url: "http://127.0.0.1:4173/game/",
    reuseExistingServer: false,
    timeout: 60_000
  }
});
