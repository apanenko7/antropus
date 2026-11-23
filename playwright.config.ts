import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: `http://localhost:${port}`,
    reducedMotion: "reduce",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}/uk`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
