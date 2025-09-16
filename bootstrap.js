import fs from "fs";
import path from "path";

const manifest = JSON.parse(fs.readFileSync("scaffold.json", "utf8"));

function writeFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("created", p);
}

// Apps
for (const [app, conf] of Object.entries(manifest.apps)) {
  const base = path.join("apps", app);
  for (const [file, content] of Object.entries(conf.pages || {})) {
    writeFileSafe(path.join(base, "app", file), content);
  }
  for (const [file, content] of Object.entries(conf.console || {})) {
    writeFileSafe(path.join(base, "app", "console", file), content);
  }
  for (const [file, content] of Object.entries(conf.api || {})) {
    writeFileSafe(path.join(base, "app", "api", file), content);
  }
  for (const [file, content] of Object.entries(conf.components || {})) {
    writeFileSafe(path.join(base, "components", file), content);
  }
  for (const [file, content] of Object.entries(conf.lib || {})) {
    writeFileSafe(path.join(base, "lib", file), content);
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

console.log("Scaffold ready.");
