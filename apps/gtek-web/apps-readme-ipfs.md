# IPFS provider setup

Set either of these in your env (local `.env`, or GitHub Actions secrets):

- PINATA_JWT: Pinata API JWT
- WEB3_STORAGE_TOKEN: web3.storage API token

Behavior in `/api/ipfs/pin`:

- If `cid` is provided, it will be used directly.
- If `cid` is not provided and one of the provider tokens is set, it will attempt to pin `data` from the request body and return the resulting CID.
- If no provider tokens are set, it falls back to a mock CID for local testing.
