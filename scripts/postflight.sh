#!/usr/bin/env bash
set -euo pipefail

echo "🛬 Running Post-Flight Checks..."

# Go to repo root
cd "$(dirname "$0")/.." || exit 1

mkdir -p .reports

BASE_URL="${BASE_URL:-}"
if [ -z "${BASE_URL}" ]; then
  # Try to read last deployment URL from a known place if you store it; fallback to vars.BASE_URL in CI
  BASE_URL="${BASE_URL:-}"
fi
if [ -z "$BASE_URL" ]; then
  echo "ℹ️ BASE_URL not provided. Try: BASE_URL=... bash scripts/postflight.sh"
  BASE_URL="https://example.com"
fi

echo "🌐 Target BASE_URL=$BASE_URL"
REPORT=".reports/postflight-$(date +%s).json"

# Begin JSON
printf '{' > "$REPORT"

# Health check
if curl -fsSL -H "x-vercel-protection-bypass: ${VERCEL_BYPASS_TOKEN:-}" "$BASE_URL/api/health" >/dev/null; then
  printf '"health":true,' >> "$REPORT"
  echo "✅ Health check passed"
else
  printf '"health":false,' >> "$REPORT"
  echo "⚠️ Health check failed"
fi

# Ping check
if curl -fsSL -H "x-vercel-protection-bypass: ${VERCEL_BYPASS_TOKEN:-}" "$BASE_URL/api/ping" >/dev/null; then
  printf '"ping":true,' >> "$REPORT"
  echo "✅ Ping check passed"
else
  printf '"ping":false,' >> "$REPORT"
  echo "⚠️ Ping check failed"
fi

# Analytics presence check (use existing Node script if present)
ANALYTICS_OK=1
if [ -f scripts/check-analytics.js ]; then
  set +e
  node scripts/check-analytics.js
  ANALYTICS_OK=$?
  set -e
fi
if [ "$ANALYTICS_OK" -eq 0 ]; then
  printf '"analytics":true,' >> "$REPORT"
  echo "✅ Analytics detected"
else
  printf '"analytics":false,' >> "$REPORT"
  echo "⚠️ Analytics missing"
fi

# E2E smoke tests (Playwright) - install browsers if needed
E2E_STATUS="fail"
set +e
pnpm exec playwright --version >/dev/null 2>&1 || pnpm add -D @playwright/test >/dev/null 2>&1
pnpm exec playwright install --with-deps >/dev/null 2>&1
if pnpm exec playwright test --config=playwright.config.ts --reporter=json --timeout=90000; then
  E2E_STATUS="ok"
fi
set -e
printf '"e2e":"%s"' "$E2E_STATUS" >> "$REPORT"

# End JSON
printf '}' >> "$REPORT"

echo "📄 Post-Flight report written to $REPORT"
