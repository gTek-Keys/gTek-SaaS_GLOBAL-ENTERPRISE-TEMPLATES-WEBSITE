import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const extraHeaders: Record<string, string> = process.env.VERCEL_BYPASS_TOKEN
  ? { 'x-vercel-protection-bypass': String(process.env.VERCEL_BYPASS_TOKEN) }
  : {};

export default defineConfig({
  testDir: 'tests/e2e',
  retries: 1,
  timeout: 60_000,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
  ],
  use: {
    baseURL,
    headless: true,
    extraHTTPHeaders: extraHeaders,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
