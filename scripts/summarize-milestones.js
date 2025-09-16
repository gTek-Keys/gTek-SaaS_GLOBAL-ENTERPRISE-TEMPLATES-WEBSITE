#!/usr/bin/env node
/*
 Summarize milestone statuses and task progress.
 - Scans reports/milestones/*.md
 - Extracts Status (not-started/in-progress/completed) and checkbox task counts
 - Writes .reports/milestones-summary.json and .reports/milestones-summary.md
 - Prints markdown summary to stdout (for GitHub Step Summary)
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MILES_DIR = path.join(ROOT, 'reports', 'milestones');
const REPORT_DIR = path.join(ROOT, '.reports');

function ensureDir(p){
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function parseMilestone(filePath){
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  // Title
  const titleMatch = lines.find(l => /^#\s+/.test(l)) || path.basename(filePath);
  const title = titleMatch.replace(/^#\s+/, '').trim();

  // Find Status section
  let status = 'not-started';
  let inStatus = false;
  for (const line of lines){
    if (/^##\s+Status\s*$/.test(line)) { inStatus = true; continue; }
    if (inStatus) {
      const m = /^-\s*(.*)\s*$/.exec(line);
      if (m) {
        status = String(m[1]).toLowerCase().trim();
      }
      if (/^##\s+/.test(line)) { // next heading ended status block
        break;
      }
    }
  }

  // Count tasks
  let tasksTotal = 0, tasksDone = 0;
  let inTasks = false;
  for (const line of lines){
    if (/^##\s+Tasks\s*$/.test(line)) { inTasks = true; continue; }
    if (inTasks) {
      if (/^##\s+/.test(line)) break; // end of section
      const unchecked = /^-\s*\[\s\]/.test(line);
      const checked = /^-\s*\[x\]/i.test(line);
      if (unchecked || checked) {
        tasksTotal++;
        if (checked) tasksDone++;
      }
    }
  }

  return { title, file: path.relative(ROOT, filePath), status, tasksDone, tasksTotal };
}

function main(){
  ensureDir(REPORT_DIR);
  if (!fs.existsSync(MILES_DIR)){
    const empty = { totals: { completed: 0, 'in-progress': 0, 'not-started': 0 }, milestones: [] };
    fs.writeFileSync(path.join(REPORT_DIR, 'milestones-summary.json'), JSON.stringify(empty, null, 2));
    const md = `## Milestones Summary\n\n_No milestones directory found._\n`;
    fs.writeFileSync(path.join(REPORT_DIR, 'milestones-summary.md'), md);
    process.stdout.write(md + '\n');
    return;
  }

  const files = fs.readdirSync(MILES_DIR).filter(f => f.endsWith('.md')).sort();
  const milestones = files.map(f => parseMilestone(path.join(MILES_DIR, f)));

  const totals = { completed: 0, 'in-progress': 0, 'not-started': 0 };
  for (const m of milestones){
    if (totals[m.status] !== undefined) totals[m.status]++;
  }

  const out = { totals, milestones };
  fs.writeFileSync(path.join(REPORT_DIR, 'milestones-summary.json'), JSON.stringify(out, null, 2));

  const rows = milestones.map(m => {
    const pct = m.tasksTotal ? Math.round((m.tasksDone / m.tasksTotal) * 100) : 0;
    return `| ${m.title} | ${m.status} | ${m.tasksDone}/${m.tasksTotal} (${pct}%) | [link](${m.file}) |`;
  });

  const md = [
    '## Milestones Summary',
    '',
    `Totals: completed=${totals.completed}, in-progress=${totals['in-progress']}, not-started=${totals['not-started']}`,
    '',
    '| Milestone | Status | Tasks | File |',
    '| --- | --- | --- | --- |',
    ...rows
  ].join('\n');

  fs.writeFileSync(path.join(REPORT_DIR, 'milestones-summary.md'), md + '\n');
  process.stdout.write(md + '\n');
}

main();
