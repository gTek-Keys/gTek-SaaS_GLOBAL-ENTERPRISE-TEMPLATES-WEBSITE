# gTek GLOBAL — Continuous Compliance Instructions

This file is an operational script for GitHub Copilot.
Follow each step in order — do not skip.

---

🔹 **1. Run Pre-Deploy Checks**

    make predeploy

- This executes scripts/predeploy.js.
- It validates schema, RLS, env vars, build, contracts, IPFS, compliance, and audit log.
- The script writes .reports/predeploy-<timestamp>.json.
- Do not proceed unless every check is "ok".

---

🔹 **2. Push to GitHub**

    git add .
    git commit -S -m "deploy: passing predeploy checks"
    git push origin main

- Commits must be signed (-S).
- CI/CD runs .github/workflows/ci.yml → build + predeploy.

---

🔹 **3. Deploy to Vercel**

    vercel --prod --yes

- Project auto-deploys to gtek.world.
- Env vars are pulled from .env.local.

---

🔹 **4. Run Post-Deploy Checks**

    make postdeploy

- This executes scripts/postdeploy.js.
- It probes live URLs:
    - https://gtek.world/
    - https://gtek.world/console
    - https://gtek.world/api/health
- The script writes .reports/postdeploy-<timestamp>.json.
- Do not mark milestone complete unless every endpoint returns ok.

---

🔹 **5. Confirm Domain & SSL**
- Verify gtek.world resolves correctly.
- Check SSL cert expiry: must be ≥ 90 days.
- Confirm wildcard *.gtek.world resolves if required.

---

🔹 **6. Confirm Vault & CRID Binding**
- Go to /console/vault.
- Enter a test CID and CRID.
- Verify response includes:
    - vault_code
    - codex_id
- Check Supabase vaults and external_registry_links tables for new entries.

---

🔹 **7. Confirm IPFS Integration**
- Run ipfs add test.txt locally.
- Verify CID resolves via ipfs.io/ipfs/<CID>.
- Pin CID through /console/vault.
- CID must match vault record in Supabase.

---

🔹 **8. Confirm Smart Contracts**
- Navigate to contracts/.
- Compile and deploy ERC-721:

    npx hardhat compile
    npx hardhat run scripts/deploy.js --network sepolia

- Mint 1 token to test wallet.
- Verify token metadata loads from IPFS.

---

🔹 **9. Confirm Compliance Hub**
- Visit /compliance.
- Verify SOC2 + NIST maps render.
- Switch region toggle (CA → EU) and confirm policy gates.
- Trigger rate limits with rapid API calls (expect HTTP 429).

---

🔹 **10. Archive Reports**
- Upload .reports/predeploy-*.json and .reports/postdeploy-*.json as release artifacts.
- Attach SBOM file from CI build.
- Confirm audit logs in Supabase match actions.

---

✅ When all 10 steps are complete:
- Mark milestone as done.
- Create a signed release in GitHub.
- Tag with vYYYY.MM.DD.
