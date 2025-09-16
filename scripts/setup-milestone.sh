#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Initializing milestone reports..."

mkdir -p reports/milestones

M1="reports/milestones/M1.md"
if [[ ! -f "$M1" ]]; then
  cat > "$M1" <<'EOM'
# Milestone 1 — Backend Scaffold

- [ ] Backend scaffold complete
- [ ] CI checks passing
- [ ] Compliance pipeline running
- [ ] Governance contract applied
EOM
  echo "✅ Created $M1"
else
  echo "⚠️  $M1 already exists, skipping creation."
fi

git add "$M1" || true
git commit -m "chore: add baseline milestone report" || echo "⚠️  No changes to commit."
git push

echo "🎉 Baseline milestone pushed. You can now run your Compliance Pipeline."
