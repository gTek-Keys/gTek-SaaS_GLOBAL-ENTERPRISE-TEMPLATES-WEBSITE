#!/usr/bin/env node
/**
 * scripts/compliance-summary.js
 * Aggregates latest predeploy/postdeploy/sbom/milestones artifacts into
 * .reports/compliance-summary.json and prints a concise Markdown summary.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

function latestByPrefix(dir, prefix) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith(prefix))
    .map(f => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a,b)=>b.m-a.m);
  return files[0]?.f ? path.join(dir, files[0].f) : null;
}

function latestByDir(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .map(f => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a,b)=>b.m-a.m);
  return files[0]?.f ? path.join(dir, files[0].f) : null;
}

async function main(){
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);

  const latestPre = latestByPrefix(reportsDir, 'predeploy-');
  const latestPost = latestByPrefix(reportsDir, 'postdeploy-');
  const milestonesMd = path.join(reportsDir, 'milestones-summary.md');
  const sbomDir = path.join(cwd, 'reports', 'sbom');
  const latestSbom = latestByDir(sbomDir);

  const out = {
    timestamp: new Date().toISOString(),
    artifacts: {
      predeploy: latestPre && path.relative(cwd, latestPre),
      postdeploy: latestPost && path.relative(cwd, latestPost),
      milestones: fs.existsSync(milestonesMd) ? path.relative(cwd, milestonesMd) : null,
      sbom: latestSbom && path.relative(cwd, latestSbom),
    }
  };

  const outPath = path.join(reportsDir, 'compliance-summary.json');
  await fsp.writeFile(outPath, JSON.stringify(out, null, 2));

  const md = [];
  md.push('# Compliance Summary');
  md.push('');
  md.push(`- Predeploy: ${out.artifacts.predeploy || 'n/a'}`);
  md.push(`- Postdeploy: ${out.artifacts.postdeploy || 'n/a'}`);
  md.push(`- Milestones: ${out.artifacts.milestones || 'n/a'}`);
  md.push(`- SBOM: ${out.artifacts.sbom || 'n/a'}`);
  console.log(md.join('\n'));
}

main().catch((err) => {
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const outPath = path.join(reportsDir, 'compliance-summary.json');
  const out = { timestamp: new Date().toISOString(), error: String(err && err.stack || err) };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('# Compliance Summary');
  console.log('- Error generating summary; see JSON for details.');
  process.exit(0);
});
 
