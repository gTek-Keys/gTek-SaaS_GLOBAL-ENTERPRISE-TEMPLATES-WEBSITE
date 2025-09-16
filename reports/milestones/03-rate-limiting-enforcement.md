# Milestone 3 — Rate Limiting Enforcement

## Scope

Move from in-memory → distributed (Upstash Redis / Vercel KV). Guarantee limits hold globally across edge deployments.

## Objectives

- Global quotas enforced across all regions
- Fast path with minimal latency
- Audit logs for limit exceedances

## Acceptance Criteria

- Upstash (or KV) limiter active in prod
- Fallback to in-memory when envs absent
- CI smoke test validates 429 after threshold

## Tasks

- [ ] Configure Upstash envs
- [ ] Validate distributed limiter in staging/prod
- [ ] Add Playwright stress test step in CI

## Evidence

- CI logs, job summary, governance dashboard events

## Validation

- 429 responses observed post-threshold

## Risks

- Regional clock skew; use sliding windows and server timestamps

## Status

- not-started

## Dates

- start:
- end:

## Owner

-
