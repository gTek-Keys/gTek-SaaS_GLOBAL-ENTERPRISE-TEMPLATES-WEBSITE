# gTek GLOBAL — Post-Deployment Checklist

Run this after pushing to `main` and deploying to Vercel (`gtek.world`).

---

## A) Domain & SSL

- [ ] Primary domain `gtek.world` resolves to Vercel app
- [ ] Wildcard `*.gtek.world` resolves (if enabled)
- [ ] SSL certificate valid + auto-renew

## B) Web App Health

- [ ] `https://gtek.world/` returns 200
- [ ] `/console` renders without error
- [ ] `/api/health` returns `{ ok: true }`
- [ ] Security headers present (CSP, X-Frame, etc.)

## C) Supabase Integration

- [ ] Auth working (can login with seeded account)
- [ ] RLS active — test access control
- [ ] Audit logs created on privileged action

## D) Vault & CRID

- [ ] `/console/vault` accepts CID + CRID
- [ ] API returns vault_code + codex_id
- [ ] Vault entry visible in Supabase table
- [ ] `external_registry_links` has IMOS binding

## E) IPFS

- [ ] Pin test CID → appears in `vaults`
- [ ] CID resolves via gateway (`ipfs.io` or `dweb.link`)
- [ ] Vault code resolves privately via `/api/vault/:vault_code`

## F) Contracts

- [ ] ERC-721 deployed to target network
- [ ] Mint a token → metadata loads from IPFS
- [ ] Treasury snapshot (ERC-4626 stub) callable

## G) Compliance

- [ ] `/compliance` page loads SOC2/NIST maps
- [ ] Policy toggles work for different regions
- [ ] Rate limits enforced

## H) CI/CD Artifacts

- [ ] GitHub Actions run complete
- [ ] SBOM artifact uploaded to release
- [ ] `.reports/predeploy-*.json` present in repo artifacts

## I) Monitoring

- [ ] Logs streaming to console + stored in Supabase
- [ ] Alerts configured for 5xx or auth failures
- [ ] Uptime check active against `/api/health`

## J) Governance & Continuity

- [ ] Trustees have keys
- [ ] Key rotation tested
- [ ] Disaster recovery drill passes (RTO ≤ 4h, RPO ≤ 1h)

---

**Command:**  

```bash
make postdeploy
```

Generates .reports/postdeploy-YYYYMMDD.json
