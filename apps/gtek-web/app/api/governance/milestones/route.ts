import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

async function readMilestoneFile(fp: string) {
  const content = await fs.readFile(fp, 'utf8');
  const lines = content.split(/\r?\n/);
  // Title
  const titleLine = lines.find(l => /^#\s+/.test(l));
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : path.basename(fp);
  // Status
  let statusBlock = false;
  let statusRaw: string | null = null;
  for (const line of lines) {
    if (/^##\s+Status\s*$/.test(line)) { statusBlock = true; continue; }
    if (statusBlock) {
      if (/^##\s+/.test(line)) break; // end of section
      const m = /^-\s*(.*)\s*$/.exec(line);
      if (m) { statusRaw = m[1].toLowerCase().trim(); break; }
    }
  }
  let status: 'done' | 'in-progress' | 'pending' = 'pending';
  if (statusRaw === 'completed' || statusRaw === 'done') status = 'done';
  else if (statusRaw === 'in-progress') status = 'in-progress';
  else status = 'pending';

  return { title, status };
}

export async function GET() {
  try {
    const milesDir = process.env.MILESTONES_DIR || path.join(process.cwd(), 'reports', 'milestones');
    const files = (await fs.readdir(milesDir)).filter(f => f.endsWith('.md')).sort();
    const items = await Promise.all(files.map(async (f, i) => {
      const fp = path.join(milesDir, f);
      const { title, status } = await readMilestoneFile(fp);
      return { id: i + 1, title, status };
    }));
    return NextResponse.json({ updated_at: new Date().toISOString(), milestones: items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, milestones: [] }, { status: 500 });
  }
}
