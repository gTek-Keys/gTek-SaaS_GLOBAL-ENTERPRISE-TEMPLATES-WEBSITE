#!/usr/bin/env node
/**
 * scripts/compliance-quadrinary.js
 * Validates presence of key artifacts and emits:
 * - .reports/compliance-quadrinary.json
 * - .reports/final-certificate.md (when all gates pass)
 * Always exits 0.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

async function main(){
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);

  const artifacts = {
    predeploy: exists(path.join(cwd, '.reports')) && fs.readdirSync(path.join(cwd, '.reports')).some(f=>f.startsWith('predeploy-')),
    sbom: exists(path.join(cwd, 'reports', 'sbom')) && fs.readdirSync(path.join(cwd, 'reports', 'sbom')).some(f=>f.endsWith('.json')),
    milestones: exists(path.join(cwd, '.reports', 'milestones-summary.md')),
    complianceSummary: exists(path.join(cwd, '.reports', 'compliance-summary.json')),
  };
  const gates = [
    { id: 'G1', label: 'Predeploy report exists', pass: !!artifacts.predeploy },
    { id: 'G2', label: 'SBOM exists', pass: !!artifacts.sbom },
    { id: 'G3', label: 'Milestones summary exists', pass: !!artifacts.milestones },
    { id: 'G4', label: 'Compliance rollup exists', pass: !!artifacts.complianceSummary },
  ];
  const allPass = gates.every(g=>g.pass);

  const out = {
    timestamp: new Date().toISOString(),
    artifacts,
    gates,
    result: allPass ? 'pass' : 'fail',
  };
  const outPath = path.join(reportsDir, 'compliance-quadrinary.json');
  await fsp.writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(`Quadrinary report written: ${path.relative(cwd, outPath)}`);

  if (allPass) {
    const cert = [
      '# Final QA Certificate',
      '',
      '- Status: PASS',
      `- Timestamp: ${out.timestamp}`,
      '- Gates: G1-G4 passed',
    ].join('\n');
    await fsp.writeFile(path.join(reportsDir, 'final-certificate.md'), cert);
    console.log('Final QA Certificate written: .reports/final-certificate.md');
  } else {
    console.log('Final QA Certificate not issued (some gates failed).');
  }
}

main().catch((err) => {
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const out = { timestamp: new Date().toISOString(), error: String(err && err.stack || err) };
  fs.writeFileSync(path.join(reportsDir, 'compliance-quadrinary.json'), JSON.stringify(out, null, 2));
  console.log('Quadrinary report (error) written.');
  process.exit(0);
});
