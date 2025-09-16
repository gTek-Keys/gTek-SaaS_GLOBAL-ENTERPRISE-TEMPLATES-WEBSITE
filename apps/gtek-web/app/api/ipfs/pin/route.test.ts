import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock next/server to avoid bringing full Next.js into test runtime
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), { status: init?.status ?? 200, headers: { 'content-type': 'application/json' } }),
    },
  };
});

// Mock supabase client
const insertCalls: any[] = [];
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: () => {
      return {
        from: (table: string) => {
          if (table === 'vaults') {
            return {
              insert: (payload: any) => {
                insertCalls.push({ table, payload });
                return {
                  select: () => ({
                    single: async () => ({ data: { id: 1, ...payload }, error: null }),
                  }),
                };
              },
            };
          }
          if (table === 'audit_logs') {
            return {
              insert: async (_payload: any) => ({ error: null }),
            };
          }
          throw new Error('Unexpected table: ' + table);
        },
      };
    },
  };
});

// Import after mocks
import { POST } from './route';
import crypto from 'crypto';

describe('POST /api/ipfs/pin', () => {
  const envBackup = { ...process.env };
  beforeEach(() => {
    insertCalls.length = 0;
    // Ensure no Supabase envs for mock-mode test
    delete process.env.SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });
  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('pins data (mock) and returns mock vault when Supabase not configured', async () => {
    // Arrange
    const data = 'hello world';
    const name = 'Test Vault';
    const req: any = { json: async () => ({ data, name }) };

    // Act
    const res = (await POST(req)) as Response;

    // Assert
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.vault).toBeTruthy();
    expect(body.vault.name).toBe(name);
    expect(body.vault.cid).toMatch(/^QmMockCID/);
    const expectedChecksum = crypto.createHash('sha256').update(data).digest('hex');
    expect(body.vault.checksum).toBe(expectedChecksum);
    expect(body.vault.mock).toBe(true);
  });

  it('inserts into Supabase when env is configured', async () => {
    // Arrange
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE = 'service-role-key';
    const data = 'hello world 2';
    const name = 'DB Vault';
    const req: any = { json: async () => ({ data, name }) };

    // Act
    const res = (await POST(req)) as Response;
    const body = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(body.vault.name).toBe(name);
    expect(insertCalls.find(c => c.table === 'vaults')).toBeTruthy();
  });
});
