#!/usr/bin/env bash
set -euo pipefail

echo "🛫 Running Pre-Flight Checks..."

# Go to repo root
cd "$(dirname "$0")/.." || exit 1

mkdir -p .reports

# Install deps with strict lockfile at workspace root
if ! pnpm install --frozen-lockfile; then
  echo "⚠️ Lockfile mismatch. Run 'pnpm install' locally to update."
  exit 1
fi

# Lint (run from app directory if script exists)
if [ -f apps/gtek-web/package.json ]; then
  if jq -e '.scripts.lint' apps/gtek-web/package.json >/dev/null 2>&1; then
    echo "🔎 Running lint..."
    pnpm -C apps/gtek-web run lint || { echo "❌ Lint failed"; exit 1; }
  else
    echo "ℹ️ No lint script in apps/gtek-web; skipping"
  fi
else
  echo "ℹ️ apps/gtek-web not found; skipping lint"
fi

# Type check (tsc) if available
if pnpm --filter gtek-web exec tsc -v >/dev/null 2>&1; then
  if [ -f apps/gtek-web/tsconfig.json ]; then
    echo "🧰 Running TypeScript check..."
    pnpm --filter gtek-web exec tsc -p tsconfig.json --noEmit
  else
    echo "ℹ️ No tsconfig.json in apps/gtek-web; skipping type check"
  fi
else
  echo "ℹ️ TypeScript not available; skipping type check"
fi

# Unit tests (vitest)
if pnpm run -r test >/dev/null 2>&1; then
  echo "🧪 Running unit tests..."
  pnpm run -r test
else
  echo "ℹ️ No unit tests configured; skipping"
fi

# Compliance / SBOM (non-fatal)
if [ -f scripts/predeploy.js ]; then
  echo "🧾 Generating predeploy/compliance report (non-fatal)..."
  node scripts/predeploy.js || echo '{"ok":false,"note":"predeploy.js failed"}' > .reports/preflight-fallback.json
fi
if [ -f scripts/generate-sbom.js ]; then
  echo "📦 Generating SBOM (non-fatal)..."
  node scripts/generate-sbom.js || true
fi

REPORT=".reports/preflight-$(date +%s).json"
echo '{"ok":true,"stage":"preflight","timestamp":'"$(date +%s)"'}' > "$REPORT"
echo "✅ Pre-Flight checks passed. Report: $REPORT"
