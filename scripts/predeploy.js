#!/usr/bin/env node
/**
 * scripts/predeploy.js
 * Lightweight predeploy readiness report.
 * - Does not fail the build; always exits 0
 * - Writes .reports/predeploy-<ts>.json with checks, env hints, and notes
 */

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function fileExists(p) {
  try { await fsp.access(p, fs.constants.F_OK); return true; } catch { return false; }
}

async function main() {
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);

  const ts = Date.now();
  const reportPath = path.join(reportsDir, `predeploy-${ts}.json`);

  // Basic file checks (non-fatal)
  const filesToCheck = [
    'README.md',
    'package.json',
    '.github/workflows/compliance.yml',
  ];

  const fileChecks = {};
  for (const rel of filesToCheck) {
    const exists = await fileExists(path.join(cwd, rel));
    fileChecks[rel] = exists ? 'ok' : 'missing';
  }

  // Env presence hints (non-fatal)
  const envVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'VERCEL_TOKEN',
    'VERCEL_ORG_ID',
    'VERCEL_PROJECT_ID',
    'BASE_URL',
  ];
  const envHints = {};
  for (const k of envVars) {
    envHints[k] = process.env[k] ? 'set' : 'missing';
  }

  // Coverage hints
  const coverageDir = path.join(cwd, 'coverage');
  const coverageJson = path.join(coverageDir, 'coverage-final.json');
  const coverage = {
    dir: (await fileExists(coverageDir)) ? 'present' : 'absent',
    summary: (await fileExists(coverageJson)) ? 'present' : 'absent',
  };

  const report = {
    timestamp: new Date(ts).toISOString(),
    status: 'ok',
    checks: {
      files: fileChecks,
    },
    envHints,
    coverage,
    notes: [
      'This report is informational and does not fail CI.',
      'Set BASE_URL for postdeploy checks to query your running app.',
    ],
  };

  await fsp.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Predeploy report written: ${path.relative(cwd, reportPath)}`);
}

main().catch((err) => {
  // Never fail; write a minimal error report and exit 0
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const ts = Date.now();
  const reportPath = path.join(reportsDir, `predeploy-${ts}.json`);
  const report = {
    timestamp: new Date(ts).toISOString(),
    status: 'error',
    error: String(err && err.stack || err),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Predeploy report (error) written: ${path.relative(cwd, reportPath)}`);
  process.exit(0);
});
 
