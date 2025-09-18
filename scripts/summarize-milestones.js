#!/usr/bin/env node
/**
 * scripts/summarize-milestones.js
 * Scans for milestone files and produces concise summary outputs:
 * - .reports/milestones-summary.md
 * - .reports/milestones-summary.json
 * Looks in MILESTONES_DIR env or common defaults under repo.
 * Non-fatal; always exits 0.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

function listFilesSafe(dir) {
  try { return fs.readdirSync(dir).map(f => path.join(dir, f)); } catch { return []; }
}

function gatherCandidates(base) {
  const dirs = [
    process.env.MILESTONES_DIR,
    path.join(base, 'reports', 'milestones'),
    path.join(base, '.reports', 'milestones'),
    path.join(base, 'docs', 'milestones'),
    path.join(base, 'governance', 'milestones'),
  ].filter(Boolean);
  const files = [];
  for (const d of dirs) {
    for (const f of listFilesSafe(d)) {
      if (/\.(md|markdown|json)$/i.test(f)) files.push(f);
    }
  }
  return files;
}

function summarizeFile(file) {
  const name = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  const stat = fs.statSync(file);
  const size = stat.size;
  let title = name;
  let items = 0;
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (ext === '.json') {
      const j = JSON.parse(content);
      title = j.title || title;
      items = Array.isArray(j.milestones) ? j.milestones.length : (Array.isArray(j.items) ? j.items.length : 0);
    } else {
      // crude markdown heuristic: count lines starting with - or * or number+
      items = (content.match(/^\s*(?:[-*]|\d+\.)\s+/gm) || []).length;
      const h1 = content.match(/^#\s+(.+)/m);
      if (h1) title = h1[1].trim();
    }
  } catch {}
  return { file, name, size, title, items, mtime: stat.mtime.toISOString() };
}

async function main(){
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);

  const candidates = gatherCandidates(cwd);
  const summaries = candidates.map(summarizeFile).sort((a,b)=>a.name.localeCompare(b.name));

  const md = [];
  md.push('# Milestones Summary');
  md.push('');
  if (summaries.length === 0) {
    md.push('- No milestone files found.');
  } else {
    md.push('| File | Title | Items | Size | Modified |');
    md.push('| --- | --- | ---:| ---:| --- |');
    for (const s of summaries) {
      md.push(`| ${path.relative(cwd, s.file)} | ${s.title} | ${s.items} | ${s.size} | ${s.mtime} |`);
    }
  }

  const jsonOut = {
    timestamp: new Date().toISOString(),
    count: summaries.length,
    files: summaries.map(s => ({
      path: path.relative(cwd, s.file),
      title: s.title,
      items: s.items,
      size: s.size,
      mtime: s.mtime,
    })),
  };

  await fsp.writeFile(path.join(reportsDir, 'milestones-summary.md'), md.join('\n'));
  await fsp.writeFile(path.join(reportsDir, 'milestones-summary.json'), JSON.stringify(jsonOut, null, 2));
  console.log('Milestones summary written to .reports/milestones-summary.{md,json}');
}

main().catch((err) => {
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const out = { timestamp: new Date().toISOString(), error: String(err && err.stack || err) };
  fs.writeFileSync(path.join(reportsDir, 'milestones-summary.json'), JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(reportsDir, 'milestones-summary.md'), '# Milestones Summary\n\n- Error generating summary.');
  console.log('Milestones summary (error) written.');
  process.exit(0);
});
