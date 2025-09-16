import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/server pieces
class MockHeaders {
  private map = new Map<string, string>();
  set(k: string, v: string) { this.map.set(k.toLowerCase(), v); }
  get(k: string) { return this.map.get(k.toLowerCase()) ?? null; }
}

function makeReq(path: string, method: string = 'GET', ip = '1.2.3.4') {
  const headers = new MockHeaders();
  const req: any = {
    method,
    ip,
    headers,
    nextUrl: { pathname: path },
  };
  return req;
}

vi.mock('next/server', () => ({
  NextResponse: class MR extends Response {
    static next() { return new MR(null as any, { status: 200 }); }
  },
}));

// Ensure config uses a tiny window/limit for test speed by mocking the JSON import
vi.mock('./config/rate_limits.json', () => ({ default: { api: { limit: 3, window: '1m' } } }));

import { middleware } from './middleware';

describe('middleware rate limiting', () => {
  beforeEach(() => {
    // nothing needed; counters are module-scoped but test limits small
  });

  it('allows up to limit and then 429s', () => {
    const path = '/api/health';
    const req = makeReq(path);
    // First 3 should pass
    for (let i = 0; i < 3; i++) {
      const res = middleware(req as any) as Response;
      expect(res.status).toBe(200);
    }
    // Fourth should be rate-limited
    const res4 = middleware(req as any) as Response;
    expect(res4.status).toBe(429);
  });
});
