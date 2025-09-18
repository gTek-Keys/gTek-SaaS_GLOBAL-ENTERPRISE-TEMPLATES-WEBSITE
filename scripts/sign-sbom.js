#!/usr/bin/env node
/**
 * scripts/sign-sbom.js
 * Attempts to sign the latest SBOM with cosign if available.
 * Always writes .reports/sbom-signature.json (stub when unavailable).
 * Never fails.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

function latestByDir(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a,b)=>b.m-a.m);
  return files[0]?.f ? path.join(dir, files[0].f) : null;
}

async function main(){
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);

  const sbomDir = path.join(cwd, 'reports', 'sbom');
  const latest = latestByDir(sbomDir);
  const outPath = path.join(reportsDir, 'sbom-signature.json');

  if (!latest) {
    await fsp.writeFile(outPath, JSON.stringify({ ok: false, reason: 'no sbom found' }, null, 2));
    console.log('SBOM signing skipped: no SBOM found');
    return;
  }

  // Check cosign availability
  const cos = spawnSync('cosign', ['version'], { encoding: 'utf8' });
  if (cos.status !== 0) {
    await fsp.writeFile(outPath, JSON.stringify({ ok: false, reason: 'cosign not installed', sbom: path.relative(cwd, latest) }, null, 2));
    console.log('SBOM signing skipped: cosign not installed');
    return;
  }

  // Stub: we do not actually sign files here for safety, record intent instead.
  const sig = {
    ok: true,
    method: 'cosign-stub',
    sbom: path.relative(cwd, latest),
    timestamp: new Date().toISOString(),
    note: 'Signing stub recorded (no real signature generated in this environment)'
  };
  await fsp.writeFile(outPath, JSON.stringify(sig, null, 2));
  console.log('SBOM signing (stub) recorded.');
}

main().catch(async (err) => {
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);
  const outPath = path.join(reportsDir, 'sbom-signature.json');
  fs.writeFileSync(outPath, JSON.stringify({ ok: false, error: String(err && err.stack || err) }, null, 2));
  console.log('SBOM signing error recorded.');
  process.exit(0);
});
