# Milestone 1 — Repo Foundation

## Scope

Maintain secure monorepo structure with Makefile, workspace, and pre/post deploy scripts.

## Objectives

- Ensure reproducible bootstrap and build.
- Enforce consistent workspace layout.
- Pre/post deploy checks produce artifacts in .reports/.

## Acceptance Criteria

- Makefile targets: dev, build, predeploy, postdeploy.
- pnpm workspace configured; app builds on CI.
- CHECKS and COMPLIANCE docs referenced in CI job summary.

## Tasks

- [ ] Validate scaffold.json parity with repo layout
- [ ] Confirm scripts/predeploy.js and scripts/postdeploy.js produce reports
- [ ] Ensure CI uploads artifacts and links COMPLIANCE.md

## Evidence

- Links to CI run, artifacts, and .reports files.

## Validation

- Build green on main; reports generated.

## Risks

- Drift between docs and scripts; mitigate with CI checks.

## Status

- not-started

## Dates

- start:
- end:

## Owner

-
