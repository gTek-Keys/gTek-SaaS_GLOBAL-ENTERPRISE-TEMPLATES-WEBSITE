import { describe, it, expect, vi } from 'vitest';

// Mock NextResponse.json
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), { status: init?.status ?? 200, headers: { 'content-type': 'application/json' } }),
  },
}));

// Mock ts-path alias module for Supabase service client
vi.mock('@/lib/supa', () => ({
  getServiceClient: () => null,
}));

import { GET } from './route';

describe('GET /api/governance/audit', () => {
  it('returns mock stats when Supabase is not configured', async () => {
    const res = await GET();
    const body = await (res as Response).json();
    expect(body.ok).toBe(true);
    expect(body.mock).toBe(true);
    expect(body.stats).toEqual({ total: 0, rateLimits: 0 });
    expect(Array.isArray(body.events)).toBe(true);
  });
});
