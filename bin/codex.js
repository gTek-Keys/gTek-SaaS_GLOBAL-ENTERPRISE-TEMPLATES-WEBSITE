#!/usr/bin/env node

/**
 * Codex CLI — SaaS Scaffold & Compliance Generator
 * gTek / BFH Trust Designs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function writeFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("created", p);
}

function initProject({ app, domain, repo }) {
  const scaffold = JSON.parse(fs.readFileSync("scaffold.json", "utf8"));

  // Replace placeholders
  const scaffoldStr = JSON.stringify(scaffold)
    .replace(/{{APP_NAME}}/g, app)
    .replace(/{{PROJECT_DOMAIN}}/g, domain)
    .replace(/{{REPO_NAME}}/g, repo);

  const manifest = JSON.parse(scaffoldStr);

  console.log(`🚀 Initializing project: ${repo} (${app}, domain=${domain})`);

  // Apps
  for (const [appName, conf] of Object.entries(manifest.apps)) {
    const base = path.join("apps", appName);
    for (const [file, content] of Object.entries(conf.pages || {})) {
      writeFileSafe(path.join(base, "app", file), content);
    }
    for (const [file, content] of Object.entries(conf.api || {})) {
      writeFileSafe(path.join(base, "app", "api", file), content);
    }
    for (const [file, content] of Object.entries(conf.components || {})) {
      writeFileSafe(path.join(base, "components", file), content);
    }
    for (const [file, content] of Object.entries(conf.configs || {})) {
      writeFileSafe(path.join(base, file), content);
    }
  }

  // Supabase
  for (const [file, content] of Object.entries(manifest.supabase)) {
    writeFileSafe(path.join("supabase", file), content);
  }

  // Config
  for (const [file, content] of Object.entries(manifest.config)) {
    writeFileSafe(path.join("config", file), content);
  }

  // CI
  for (const [file, content] of Object.entries(manifest.ci)) {
    writeFileSafe(file, content);
  }

  // Makefile
  writeFileSafe("Makefile", manifest.makefile);

  // Compliance docs
  writeFileSafe("COMPLIANCE_TEMPLATE.md", "# Compliance Playbook\nRefer to COMPLIANCE.md for full guide.");
  console.log("✅ Project scaffold generated.");
}

// ---- CLI ----

const args = process.argv.slice(2);

if (args[0] === "init") {
  const app = args[1] || "webapp";
  const domain = args[2] || "example.com";
  const repo = args[3] || "new-repo";

  initProject({ app, domain, repo });
} else if (args[0] === "check") {
  console.log("\n🔎 Running predeploy compliance checks...");
  try {
    execSync('make predeploy', { stdio: 'inherit' });
    console.log("✅ Predeploy checks passed.");
  } catch (e) {
    console.error("❌ Predeploy checks failed.");
    process.exit(1);
  }
  console.log("\n🔎 Running postdeploy compliance checks...");
  try {
    execSync('make postdeploy', { stdio: 'inherit' });
    console.log("✅ Postdeploy checks passed.");
  } catch (e) {
    console.error("❌ Postdeploy checks failed.");
    process.exit(1);
  }
  console.log("\nAll compliance checks complete.");
} else {
  console.log(`
Codex CLI — SaaS Scaffold Tool

Usage:
  codex init <appName> <domain> <repoName>
  codex check

Examples:
  codex init gtek-web gtek.world saas-global-templates-services
  codex init webapp newapp.world saas-new-project
  codex check
`);
}
