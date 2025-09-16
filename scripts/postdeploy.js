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
const base = process.env.POSTDEPLOY_URL || "https://gtek.world";

const urls = [
  { url: base + "/", label: "Homepage" },
  { url: base + "/console", label: "Console page" },
  { url: base + "/api/health", label: "Health API" }
];

for (const { url, label } of urls) {
  checks.push(await checkHttp(url, label));
}

const report = { ts: new Date().toISOString(), checks };
fs.mkdirSync(".reports", { recursive: true });
const file = `.reports/postdeploy-${Date.now()}.json`;
fs.writeFileSync(file, JSON.stringify(report, null, 2));
console.log("Postdeploy report written:", file);
console.table(checks.map(c => ({ check: c.label, status: c.status })));

if (checks.some(c => c.status === "fail")) process.exit(1);
