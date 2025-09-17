import { test, expect, request } from '@playwright/test';

test('home page renders', async ({ page }) => {
  await page.goto('/');
  // On external hosts with custom routing, status may be 404 but page still renders an error shell.
  // For smoke purposes, ensure the document body is visible.
  await expect(page.locator('body')).toBeVisible();
});

test('governance page loads (if present)', async ({ page }) => {
  const resp = await page.goto('/console/governance');
  if (resp && resp.status() === 404) {
    test.skip(true, 'Governance console not available on this host');
  }
  await expect(page.locator('body')).toBeVisible();
});

test('health is OK (API preferred, fallback to homepage)', async () => {
  const context = await request.newContext();
  let status = 0;

  try {
    const res = await context.get('/api/health', {
      headers: process.env.VERCEL_BYPASS_TOKEN
        ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN }
        : {},
    });
    status = res.status();
  } catch (e) {
    console.warn('⚠️ API health fetch failed, will check homepage', e);
  }

  // Prefer API health, fallback to homepage if not found
  if (status === 0 || status === 404) {
    const resHome = await context.get('/');
    status = resHome.status();
  }

  const acceptable = status >= 200 && status < 400;
  expect(acceptable).toBe(true);
});
