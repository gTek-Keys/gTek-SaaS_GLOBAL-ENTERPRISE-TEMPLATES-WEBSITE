#!/usr/bin/env node
/**
 * scripts/deploy-chain.js
 * Runs: predeploy -> vercel deploy -> postdeploy
 * Parses the deployment URL from Vercel CLI output and passes it to postdeploy as BASE_URL.
 */

const { spawnSync } = require('child_process');

function run(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...options });
  return res.status === null ? 1 : res.status;
}

function runCapture(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, { encoding: 'utf-8', stdio: ['inherit', 'pipe', 'pipe'], ...options });
  process.stdout.write(res.stdout || '');
  process.stderr.write(res.stderr || '');
  const code = res.status === null ? 1 : res.status;
  return { code, out: `${res.stdout || ''}${res.stderr || ''}` };
}

function parseDeploymentUrl(output) {
  // Look for a line like: "Production: https://xxx.vercel.app"
  const m = output.match(/Production:\s+(https?:\/\/[^\s]+)/i);
  if (m && m[1]) return m[1].trim();
  // Fallback: first https URL in output
  const any = output.match(/https?:\/\/[^\s]+/);
  return any ? any[0] : '';
}

(async () => {
  // 1) Predeploy
  const pre = run('bash', ['scripts/predeploy.sh']);
  if (pre !== 0) process.exit(pre);

  // 2) Vercel deploy
  const { code, out } = runCapture('pnpm', ['dlx', 'vercel', '--prod', '--yes', '--cwd', 'apps/gtek-web']);
  if (code !== 0) process.exit(code);

  const deployedUrl = parseDeploymentUrl(out);
  if (deployedUrl) {
    process.stdout.write(`Using deployed URL for postdeploy: ${deployedUrl}\n`);
  } else if (process.env.BASE_URL) {
    process.stdout.write(`No URL parsed; falling back to BASE_URL=${process.env.BASE_URL}\n`);
  } else {
    process.stdout.write('No deployment URL parsed and no BASE_URL provided; postdeploy will use its default.\n');
  }

  // 3) Postdeploy with BASE_URL set to deployedUrl when available
  const env = { ...process.env };
  if (deployedUrl) env.BASE_URL = deployedUrl;
  const post = spawnSync('bash', ['scripts/postdeploy.sh'], { stdio: 'inherit', env });
  const postCode = post.status === null ? 1 : post.status;
  process.exit(postCode);
})();
