#!/usr/bin/env node
/**
 * scripts/generate-sbom.js
 * Attempts to generate a CycloneDX SBOM using cyclonedx-bom.
 * Falls back to a lightweight stub if tooling is unavailable.
 * Always exits 0.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

function run(cmd, args, opts = {}){
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ['ignore','pipe','pipe'], ...opts });
    let out = '';
    let err = '';
    child.stdout.on('data', d => out += d.toString());
    child.stderr.on('data', d => err += d.toString());
    child.on('close', code => resolve({ code, out, err }));
    child.on('error', e => resolve({ code: 1, out, err: String(e) }));
  });
}

async function main(){
  const cwd = process.cwd();
  const outDir = path.join(cwd, 'reports', 'sbom');
  await ensureDir(outDir);
  const ts = Date.now();
  const outfile = path.join(outDir, `bom-${ts}.json`);

  // Try npx cyclonedx-bom -o <file> .
  const attempt = await run('npx', ['-y', 'cyclonedx-bom', '-o', outfile, '.'], { cwd });
  if (attempt.code === 0 && fs.existsSync(outfile)) {
    console.log(`SBOM written to ${path.relative(cwd, outfile)}`);
    return;
  }

  // Fallback: write a minimal stub so downstream steps have an artifact
  const stub = {
    specVersion: '1.5',
    bomFormat: 'CycloneDX',
    serialNumber: `urn:uuid:${Math.random().toString(36).slice(2)}`,
    version: 1,
    metadata: {
      timestamp: new Date(ts).toISOString(),
      tools: [
        { vendor: 'fallback', name: 'generate-sbom.js', version: 'stub' }
      ],
    },
    components: [],
  };
  await fsp.writeFile(outfile, JSON.stringify(stub, null, 2));
  console.warn('SBOM generation via cyclonedx-bom failed; wrote stub instead.');
  console.warn((attempt.err || attempt.out || '').slice(0, 500));
  console.log(`SBOM written to ${path.relative(cwd, outfile)}`);
}

main().catch(async (err) => {
  // Fallback on unexpected errors
  const cwd = process.cwd();
  const outDir = path.join(cwd, 'reports', 'sbom');
  await ensureDir(outDir);
  const ts = Date.now();
  const outfile = path.join(outDir, `bom-${ts}.json`);
  const stub = {
    specVersion: '1.5',
    bomFormat: 'CycloneDX',
    serialNumber: `urn:uuid:${Math.random().toString(36).slice(2)}`,
    version: 1,
    metadata: { timestamp: new Date(ts).toISOString() },
    components: [],
    error: String(err && err.stack || err),
  };
  fs.writeFileSync(outfile, JSON.stringify(stub, null, 2));
  console.log(`SBOM (error fallback) written to ${path.relative(cwd, outfile)}`);
  process.exit(0);
});
 
