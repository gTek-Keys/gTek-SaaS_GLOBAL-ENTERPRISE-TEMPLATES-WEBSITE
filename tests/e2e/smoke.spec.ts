import { test, expect } from '@playwright/test';

test('home page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('gTek GLOBAL')).toBeVisible();
});

test('governance page loads and shows header', async ({ page }) => {
  await page.goto('/console/governance');
  await expect(page.getByText('Governance Dashboard')).toBeVisible();
});

test('health API returns ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
});
