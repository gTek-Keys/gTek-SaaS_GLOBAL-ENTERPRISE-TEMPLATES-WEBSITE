#!/usr/bin/env bash
set -euo pipefail

echo "🛫 Running Postdeploy Checks..."

BASE_URL="${BASE_URL:-https://gtek.vercel.app}"
BYPASS_HEADER=""
if [ -n "${VERCEL_BYPASS_TOKEN:-}" ]; then
  BYPASS_HEADER="-H x-vercel-protection-bypass:${VERCEL_BYPASS_TOKEN}"
fi

HEALTH="fail"
# Smoke test: Health endpoint
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BYPASS_HEADER "$BASE_URL/api/health" || true)
if echo "$STATUS" | grep -q "200"; then
  echo "✅ Health check passed"
  HEALTH="ok"
else
  echo "⚠️ Health check failed (non-blocking). Got $STATUS"
fi

# Analytics script check
ANALYTICS="fail"
HTML=$(curl -s $BYPASS_HEADER "$BASE_URL" || true)
if echo "$HTML" | grep -q 'data-vercel-analytics'; then
  echo "✅ Vercel Analytics detected"
  ANALYTICS="ok"
else
  echo "⚠️ Vercel Analytics missing (non-blocking)"
fi

# Optional: Run Playwright smoke suite against BASE_URL
E2E="skip"
if command -v pnpm >/dev/null 2>&1; then
  echo "🎭 Running Playwright smoke tests against $BASE_URL..."
  export BASE_URL="$BASE_URL"
  export VERCEL_BYPASS_TOKEN="${VERCEL_BYPASS_TOKEN:-}"
  if pnpm exec playwright test tests/e2e/smoke.spec.ts; then
    E2E="ok"
  else
    echo "⚠️ Playwright smoke failed (non-blocking)"
    E2E="fail"
  fi
fi

echo "🎉 Postdeploy checks completed"

# Compact summary
echo "Summary: Health=${HEALTH} | Analytics=${ANALYTICS} | E2E=${E2E}"

# Optional JSON summary file
SUMMARY_FILE=".reports/postdeploy-summary-$(date +%s).json"
mkdir -p .reports
printf '{"baseUrl":"%s","health":"%s","analytics":"%s","e2e":"%s"}\n' "$BASE_URL" "$HEALTH" "$ANALYTICS" "$E2E" > "$SUMMARY_FILE"
echo "📄 Wrote $SUMMARY_FILE"
