#!/usr/bin/env node
const fs = require('fs');

function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

const checks = [];
function check(label, fn){
  try { const ok = !!fn(); checks.push({ label, status: ok?'ok':'fail' }); return ok; }
  catch(e){ checks.push({ label, status: 'fail', error: e.message }); return false; }
}

check('schema.sql present', () => exists('supabase/schema.sql'));
check('rls.sql present', () => exists('supabase/rls.sql'));
check('seed.sql present', () => exists('supabase/seed.sql'));
check('web app package', () => exists('apps/gtek-web/package.json'));

const allOk = checks.every(c=>c.status==='ok');
const report = { ts: new Date().toISOString(), ok: allOk, checks };
fs.mkdirSync('.reports', { recursive: true });
const file = `.reports/predeploy-${Date.now()}.json`;
fs.writeFileSync(file, JSON.stringify(report, null, 2));
console.log('Predeploy report written:', file);
console.table(checks.map(c=>({ check: c.label, status: c.status })));

if (!allOk) process.exit(1);
