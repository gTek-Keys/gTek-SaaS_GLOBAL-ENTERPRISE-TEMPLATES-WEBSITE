# Milestone 6 — Test Infrastructure

## Scope

Add Vitest unit tests + Playwright smoke tests. Run tests in compliance pipeline → red/green signal.

## Objectives

- Fast unit tests for APIs
- Smoke tests for critical user paths
- CI-enforced quality gate

## Acceptance Criteria

- Vitest configured, tests run on CI
- Playwright smoke runs on CI (health, rate-limit, IPFS pin)
- Pipeline fails on test errors

## Tasks

- [ ] Add Vitest setup and sample tests
- [ ] Add Playwright setup and 3 smokes
- [ ] Wire tests in compliance.yml

## Evidence

- CI test outputs, coverage reports

## Validation

- Red/green signals on PRs and main

## Risks

- Flaky network calls; use retries and timeouts

## Status

- not-started

## Dates

- start:
- end:

## Owner

-
