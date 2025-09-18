#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Running Predeploy Checks..."

# Ensure we're in repo root
cd "$(dirname "$0")/.." || exit 1

# Predeploy compliance (non-fatal summary report)
node scripts/predeploy.js || true

# Move into app root
cd apps/gtek-web || { echo "❌ apps/gtek-web not found"; exit 1; }

# Install deps and build (lockfile enforced)
pnpm install --frozen-lockfile
pnpm build
