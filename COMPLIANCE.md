# gTek GLOBAL — Compliance Playbook (Master Guide)

This file defines all compliance requirements for development, deployment, and runtime governance.
Every sequence must be executed and logged. Reports are stored in .reports/ and attached to signed releases.

---

## Sequence 1 — Pre-Deployment (10 Steps)

1. Run `make predeploy` → generates `.reports/predeploy-<timestamp>.json`.
2. Confirm repo hygiene — layout matches `scaffold.json`, no secrets in history.
3. Apply Supabase schema (`schema.sql`), RLS (`rls.sql`), and seeds (`seed.sql`).
4. Ensure required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`).
5. Build Next.js app: `pnpm -C apps/gtek-web build`.
6. Test Vault API: `/api/ipfs/pin` returns `vault_code`, `/api/imos/bind` sets `CRID`.
7. Compile smart contracts: `npx hardhat compile`.
8. Verify compliance hub renders SOC2/NIST/ISO maps and region toggles work.
9. CI/CD pipeline must be green; SBOM generated.
10. GO/NO-GO: only deploy if all checks = ok.

---

## Sequence 2 — Post-Deployment (10 Steps)

1. Run `make postdeploy` → generates `.reports/postdeploy-<timestamp>.json`.
2. Confirm `gtek.world` resolves; SSL cert valid ≥ 90 days.
3. Homepage + `/api/health` return 200 and `{ ok: true }`.
4. `/console` page loads clean.
5. Vault: paste CID + CRID → response includes `vault_code` + `codex_id`.
6. Supabase audit logs show entry for vault pin.
7. IPFS gateway resolves pinned CID.
8. ERC-721 deployed on Sepolia; mint NFT → metadata resolves.
9. Compliance hub accessible; policy toggles apply region restrictions.
10. Attach pre/post reports + SBOM to GitHub release.

11. E2E Smoke: Playwright smoke tests must pass against the deployed URL.

---

## Sequence 3 — Runtime Governance (10 Steps)

1. Check roles in Supabase: only owner, admin, member.
2. Trigger `/api/ipfs/pin` → confirm `audit_logs` entry.
3. Resolve vault code → confirm CID + CRID link.
4. Validate CID resolves via IPFS gateway.
5. Run Hardhat treasury snapshot: `npx hardhat run scripts/snapshot.js --network sepolia`.
6. Stress test `/api/health` with >60 calls/min → expect HTTP 429.
7. Test region compliance toggle (CA → EU → ROW).
8. Download release artifacts; confirm presence of reports + SBOM.
9. Backup DB: `pg_dump $SUPABASE_DB > backups/db-$(date +%F).sql`; restore to test DB.
10. Simulate DR: pause app, redeploy, restore DB; confirm RTO ≤ 4h, RPO ≤ 1h.

11. E2E Smoke Re-Run (optional): re-run Playwright smoke as a post-governance gate.

---

## Sequence 4 — Final 10-Point Completion Plan (Exhaustive)

1. Monorepo Initialization & Config Canon
   - Scaffold from `scaffold.json`.
   - Verify `apps/`, `supabase/`, `config/`, `.github/`, `.devcontainer/`, `Makefile`.
   - Signed commits only.
2. Database Schema + RLS Enforcement
   - Apply schema, RLS, seeds.
   - Confirm audit log inserts on actions.
3. Next.js Web App Build (Vercel-Ready)
   - Home + Console render.
   - `/api/health`, `/api/ipfs/pin`, `/api/imos/bind` functional.
4. Vault Pinning + CRID/IMOS Binding
   - Vault code + codex_id generated.
   - Entries stored in vaults + external_registry_links.
5. NFT + Smart Contracts Integration
   - ERC-721 compiled & deployed.
6. Compliance Hub & Policy Gates
   - SOC2/NIST/ISO maps visible.
   - Region toggles apply `policy.json`.
   - GitHub Actions runs predeploy → deploy → postdeploy → governance.
   - Reports uploaded. SBOM attached.
7. Observability + Security Governance
   - Structured logs.
   - Audit logs append-only, immutable.
   - Rate limits tested.
8. Domain + Deployment Validation
   - `gtek.world` resolves.
   - SSL valid.
9. Governance, Succession & DR
   - Trustees hold keys.
   - DB backups tested.
   - Signed release tagged `vYYYY.MM.DD`.

---

A release is only valid when all four sequences (Pre, Post, Runtime, Final) pass and artifacts are archived.

---

## CI/CD Secrets and Provider Tokens

- VERCEL_PROJECT_ID — The Vercel Project ID
- VERCEL_ORG_ID — The Vercel Organization ID
- DATABASE_URL — Postgres connection string (e.g., Supabase)

Optional providers (enable real IPFS pinning in `/api/ipfs/pin`):

- PINATA_JWT — Pinata API JWT
- WEB3_STORAGE_TOKEN — web3.storage API token

---

- [Milestone 4 — Audit Logs as Evidence](reports/milestones/04-audit-logs-as-evidence.md)
- [Milestone 5 — Governance Dashboard](reports/milestones/05-governance-dashboard.md)
- [Milestone 6 — Test Infrastructure](reports/milestones/06-test-infrastructure.md)
- [Milestone 7 — SBOM & Provenance](reports/milestones/07-sbom-provenance.md)
- [Milestone 8 — Contracts & Token Flow](reports/milestones/08-contracts-and-token-flow.md)

- Test runner: Vitest (repo root). Config in `vitest.config.ts`.
- Commands:
  - `pnpm test` — run unit tests once
  - `pnpm test:watch` — watch mode
  - `pnpm coverage` — generate coverage report
- Scope covered (initial):
  - `apps/gtek-web/app/api/ipfs/pin/route.ts` — happy path (mock mode) and DB insert path
  - `apps/gtek-web/app/api/governance/audit/route.ts` — mock mode without Supabase
  - `apps/gtek-web/middleware.ts` — rate limit threshold behavior (in-memory)
- CI integration: Pre-deploy job runs `pnpm test` and uploads `coverage/` if present; failures block deployment.

---

## Compliance Scripts (Quick Reference)

- SBOM generator (CycloneDX): `scripts/generate-sbom.js`
  - Output: `reports/sbom/bom-<timestamp>.json`
- SBOM signing (stub): `scripts/sign-sbom.js`
  - Output: `.reports/sbom-signature.json`
- Milestones summarizer: `scripts/summarize-milestones.js`
  - Output: `.reports/milestones-summary.{md,json}`
- Predeploy report: `scripts/predeploy.js`
  - Output: `.reports/predeploy-<timestamp>.json`
- Postdeploy snapshot: `scripts/postdeploy.js` (uses `BASE_URL`)
  - Output: `.reports/postdeploy-<timestamp>.json`
- Compliance rollup: `scripts/compliance-summary.js`
  - Output: `.reports/compliance-summary.json`
- Quadrinary checks: `scripts/compliance-quadrinary.js`
  - Output: `.reports/compliance-quadrinary.json` and `.reports/final-certificate.md` (when all gates pass)

### Health Canary

- API: `/api/ping` returns `{ ok: true }` and can be probed by e2e smoke and external monitors for a deterministic liveness signal.

### E2E Artifacts

- Playwright produces reports in `playwright-report/` (HTML + JSON) and `test-results/` (traces, screenshots, videos on failure).
- The CI e2e-smoke job uploads these folders as artifacts and appends a summary with pass/fail/skip counts to the job summary.

### Orchestrated Local Run

Run all major steps non-fatally and produce a pipeline report:

- `node scripts/compliance-pipeline.js`
