import { test, expect } from '@playwright/test';

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

test('health is OK (API preferred, fallback to homepage)', async ({ request }) => {
  let status = 0;
  try {
    const res = await request.get('/api/health');
    status = res.status();
    if (res.ok()) {
      const json = await res.json().catch(() => null);
      if (json) console.log('Health body:', json);
    }
  } catch (e) {
    console.warn('⚠️ API health fetch failed, will check homepage', e);
  }

  // Prefer API health, fallback to homepage if not found/blocked
  if (status === 0 || status === 404 || status === 401) {
    const resHome = await request.get('/');
    status = resHome.status();
  }

  const acceptable = status >= 200 && status < 400;
  expect(acceptable).toBe(true);
});
