gTek GLOBAL  Compliance Playbook (Master Guide)

This file defines all compliance requirements for development, deployment, and runtime governance.
Every sequence must be executed and logged. Reports are stored in .reports/ and attached to signed releases.




a Sequence 1  Pre-Deployment (10 Steps)
	1.	Run make predeploy  generates .reports/predeploy-<timestamp>.json.
	2.	Confirm repo hygiene  layout matches scaffold.json, no secrets in history.
	3.	Apply Supabase schema (schema.sql), RLS (rls.sql), and seeds (seed.sql).
	4.	Ensure required env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE).
	5.	Build Next.js app: pnpm -C apps/gtek-web build.
	6.	Test Vault API: /api/ipfs/pin returns vault_code, /api/imos/bind sets CRID.
	7.	Compile smart contracts: npx hardhat compile.
	8.	Verify compliance hub renders SOC2/NIST/ISO maps and region toggles work.
	9.	CI/CD pipeline must be green; SBOM generated.
	10.	GO/NO-GO: only deploy if all checks = ok.




a Sequence 2  Post-Deployment (10 Steps)
	1.	Run make postdeploy  generates .reports/postdeploy-<timestamp>.json.
	2.	Confirm gtek.world resolves; SSL cert valid  90 days.
	3.	Homepage + /api/health return 200 and { ok: true }.
	4.	/console page loads clean.
	5.	Vault: paste CID + CRID  response includes vault_code + codex_id.
	6.	Supabase audit logs show entry for vault pin.
	7.	IPFS gateway resolves pinned CID.
	8.	ERC-721 deployed on Sepolia; mint NFT  metadata resolves.
	9.	Compliance hub accessible; policy toggles apply region restrictions.
	10.	Attach pre/post reports + SBOM to GitHub release.




a Sequence 3  Runtime Governance (10 Steps)
	1.	Check roles in Supabase: only owner, admin, member.
	2.	Trigger /api/ipfs/pin  confirm audit_logs entry.
	3.	Resolve vault code  confirm CID + CRID link.
	4.	Validate CID resolves via IPFS gateway.
	5.	Run Hardhat treasury snapshot: npx hardhat run scripts/snapshot.js --network sepolia.
	6.	Stress test /api/health with 60 calls/min  expect HTTP 429.
	7.	Test region compliance toggle (CA  EU  ROW).
	8.	Download release artifacts; confirm presence of reports + SBOM.
	9.	Backup DB: pg_dump $SUPABASE_DB > backups/db-$(date +%F).sql; restore to test DB.
	10.	Simulate DR: pause app, redeploy, restore DB; confirm RTO  4h, RPO  1h.




a Sequence 4  Final 10-Point Completion Plan (Exhaustive)
	1.	Monorepo Initialization & Config Canon
		Scaffold from scaffold.json.
		Verify apps/, supabase/, config/, .github/, .devcontainer/, Makefile.
		Signed commits only.
	2.	Database Schema + RLS Enforcement
		Apply schema, RLS, seeds.
		Confirm audit log inserts on actions.
	3.	Next.js Web App Build (Vercel-Ready)
		Home + Console render.
		/api/health, /api/ipfs/pin, /api/imos/bind functional.
	4.	Vault Pinning + CRID/IMOS Binding
		Vault code + codex_id generated.
		Entries stored in vaults + external_registry_links.
	5.	NFT + Smart Contracts Integration
		ERC-721 compiled & deployed.
		NFT minted with IPFS metadata.
	6.	Compliance Hub & Policy Gates
		SOC2/NIST/ISO maps visible.
		Region toggles apply policy.json.
	7.	CI/CD + Continuous Compliance
		GitHub Actions runs predeploy  deploy  postdeploy  governance.
		Reports uploaded. SBOM attached.
	8.	Observability + Security Governance
		Structured logs.
		Audit logs append-only, immutable.
		Secrets rotated before deploy.
		Rate limits tested.
	9.	Domain + Deployment Validation
		gtek.world resolves.
		SSL valid.
		Health API returns { ok: true }.
	10.	Governance, Succession & DR
		Trustees hold keys.
		DB backups tested.
		DR simulation proves RTO  4h, RPO  1h.
		Signed release tagged vYYYY.MM.DD.



 Completion Rule:
A release is only valid when all four sequences (Pre, Post, Runtime, Final) pass and artifacts are archived.



Would you like me to now inline link this COMPLIANCE.md into your GitHub Actions workflow so every run posts a link back to the master compliance doc in the job summary?
