import { test, expect } from '@playwright/test';

test('ping endpoint returns ok (if present)', async ({ request }) => {
  const res = await request.get('/api/ping');
  if (res.status() === 404) {
    test.skip(true, 'Ping endpoint not available on this environment');
  }
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject({ ok: true });
});
