# Milestone 7 — SBOM & Provenance

## Scope

Auto-generate CycloneDX SBOMs. Sign artifacts with cosign and attach to GitHub Releases.

## Objectives

- SBOM generated as part of predeploy
- Release artifacts signed and published
- Chain-of-custody documented

## Acceptance Criteria

- CycloneDX JSON output produced and uploaded
- Optional cosign step scaffolded in CI
- Links visible in release notes

## Tasks

- [ ] Add SBOM generation script
- [ ] Update compliance.yml to upload SBOM
- [ ] Add optional cosign step

## Evidence

- SBOM file in artifacts and releases

## Validation

- SBOM parses; signatures verify (if enabled)

## Risks

- Tooling version drift; pin versions

## Status

- not-started

## Dates

- start:
- end:

## Owner

-
