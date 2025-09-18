#!/usr/bin/env node
/**
 * scripts/postdeploy.js
 * Fetches governance snapshots from the deployed app and writes .reports/postdeploy-<ts>.json.
 * Uses BASE_URL env or defaults to http://localhost:3000
 * Never fails the build; always exits 0
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

async function safeFetchJson(url, timeoutMs = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const txt = await res.text();
    try { return { ok: res.ok, json: JSON.parse(txt), status: res.status }; }
    catch { return { ok: res.ok, text: txt, status: res.status }; }
  } catch (e) {
    return { ok: false, error: String(e && e.message || e) };
  } finally { clearTimeout(t); }
}

async function main(){
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  await ensureDir(reportsDir);
  const ts = Date.now();
  const reportPath = path.join(reportsDir, `postdeploy-${ts}.json`);

  const base = process.env.BASE_URL || 'http://localhost:3000';
  const endpoints = {
    health: `${base}/api/health`,
    governanceAudit: `${base}/api/governance/audit`,
    governanceMilestones: `${base}/api/governance/milestones`,
  };

  const results = {};
  for (const [key, url] of Object.entries(endpoints)) {
    results[key] = await safeFetchJson(url);
  }

  const report = {
    timestamp: new Date(ts).toISOString(),
    baseUrl: base,
    snapshots: results,
    notes: [
      'This report is informational and does not fail CI.',
    ],
  };

  await fsp.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Postdeploy report written: ${path.relative(cwd, reportPath)}`);
}

main().catch((err) => {
  const cwd = process.cwd();
  const reportsDir = path.join(cwd, '.reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const ts = Date.now();
  const reportPath = path.join(reportsDir, `postdeploy-${ts}.json`);
  const report = {
    timestamp: new Date(ts).toISOString(),
    status: 'error',
    error: String(err && err.stack || err),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Postdeploy report (error) written: ${path.relative(cwd, reportPath)}`);
  process.exit(0);
});
import fs from "fs";
import fetch from "node-fetch";

async function checkHttp(url, label) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("status " + r.status);
    return { label, status: "ok" };
  } catch (e) {
    return { label, status: "fail", error: e.message };
  }
}

const checks = [];
const snapshots = {};
const base = process.env.POSTDEPLOY_URL || "https://gtek.world";

const urls = [
  { url: base + "/", label: "Homepage" },
  { url: base + "/console", label: "Console page" },
  { url: base + "/api/health", label: "Health API" }
];

for (const { url, label } of urls) {
  checks.push(await checkHttp(url, label));
}

// Governance snapshots (best-effort)
try {
  const audit = await fetch(base + '/api/governance/audit').then(r=>r.json());
  snapshots.audit = audit;
} catch(e) {
  snapshots.audit = { error: String(e.message||e) };
}
try {
  const miles = await fetch(base + '/api/governance/milestones').then(r=>r.json());
  snapshots.milestones = miles;
} catch(e) {
  snapshots.milestones = { error: String(e.message||e) };
}

const report = { ts: new Date().toISOString(), checks, snapshots };
fs.mkdirSync(".reports", { recursive: true });
const file = `.reports/postdeploy-${Date.now()}.json`;
fs.writeFileSync(file, JSON.stringify(report, null, 2));
console.log("Postdeploy report written:", file);
console.table(checks.map(c => ({ check: c.label, status: c.status })));

if (checks.some(c => c.status === "fail")) process.exit(1);
