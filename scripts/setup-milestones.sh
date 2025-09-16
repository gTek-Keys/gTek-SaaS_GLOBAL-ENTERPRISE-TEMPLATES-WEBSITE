#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Initializing full milestone suite..."

mkdir -p reports/milestones

declare -A milestones=(
  ["01-repo-foundation.md"]="# Milestone 1 — Repo Foundation\n\n- [ ] Monorepo scaffold\n- [ ] Package manager setup\n- [ ] Initial CI workflow"
  ["02-supabase-backbone.md"]="# Milestone 2 — Supabase Backbone\n\n- [ ] Schema + RLS\n- [ ] Auth wired\n- [ ] Seed data loaded"
  ["03-rate-limiting-enforcement.md"]="# Milestone 3 — Rate Limiting Enforcement\n\n- [ ] Middleware limits\n- [ ] 429 audit logs\n- [ ] Upstash integration ready"
  ["04-audit-logs-as-evidence.md"]="# Milestone 4 — Audit Logs as Evidence\n\n- [ ] Append-only logs\n- [ ] Governance API\n- [ ] Evidence export"
  ["05-governance-dashboard.md"]="# Milestone 5 — Governance Dashboard\n\n- [ ] Console UI\n- [ ] Audit stats\n- [ ] Rate-limit events"
  ["06-test-infrastructure.md"]="# Milestone 6 — Test Infrastructure\n\n- [ ] Vitest suite\n- [ ] Coverage gate\n- [ ] Playwright harness"
  ["07-sbom-provenance.md"]="# Milestone 7 — SBOM & Provenance\n\n- [ ] CycloneDX generation\n- [ ] Cosign signing\n- [ ] Artifacts uploaded"
  ["08-contracts-and-token-flow.md"]="# Milestone 8 — Contracts & Token Flow\n\n- [ ] ERC-721/4626 scaffold\n- [ ] Token lifecycle\n- [ ] Liquidity support"
  ["09-compliance-hub.md"]="# Milestone 9 — Compliance Hub\n\n- [ ] COMPLIANCE.md expanded\n- [ ] CI gates enforced\n- [ ] Runtime checks"
  ["10-final-qa-and-delivery.md"]="# Milestone 10 — Final QA & Delivery\n\n- [ ] QA signoff\n- [ ] Succession docs\n- [ ] Release tagged"
)

for file in "${!milestones[@]}"; do
  path="reports/milestones/$file"
  if [[ ! -f "$path" ]]; then
    echo -e "${milestones[$file]}" > "$path"
    echo "✅ Created $path"
  else
    echo "⚠️  $path already exists, skipping."
  fi
done

git add reports/milestones || true
git commit -m "chore: add baseline milestone suite" || echo "⚠️  No changes to commit."
git push

echo "🎉 Full milestone suite pushed. Compliance Pipeline can now summarize all milestones."
