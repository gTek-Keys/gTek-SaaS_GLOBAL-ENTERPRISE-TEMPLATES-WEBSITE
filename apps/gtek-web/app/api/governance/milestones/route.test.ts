import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: ResponseInit) => new Response(JSON.stringify(data), { status: init?.status ?? 200, headers: { 'content-type': 'application/json' } }),
  },
}));

import { GET } from './route';

describe('GET /api/governance/milestones', () => {
  const tmp = path.join(os.tmpdir(), `miles-${Date.now()}`);

  beforeAll(async () => {
    await fs.mkdir(tmp, { recursive: true });
    await fs.writeFile(path.join(tmp, '01-alpha.md'), `# Alpha\n\n## Status\n- in-progress\n`);
    await fs.writeFile(path.join(tmp, '02-beta.md'), `# Beta\n\n## Status\n- done\n`);
    process.env.MILESTONES_DIR = tmp;
  });

  afterAll(async () => {
    delete process.env.MILESTONES_DIR;
    try { await fs.rm(tmp, { recursive: true, force: true }); } catch {}
  });

  it('parses milestone files and returns sorted list with statuses', async () => {
    const res = await GET();
    const body = await (res as Response).json();
    expect(Array.isArray(body.milestones)).toBe(true);
    expect(body.milestones.length).toBe(2);
    // Files are sorted so 01-alpha.md comes first
    expect(body.milestones[0].title).toBe('Alpha');
    expect(body.milestones[0].status).toBe('in-progress');
    expect(body.milestones[1].title).toBe('Beta');
    expect(body.milestones[1].status).toBe('done');
  });
});
