# Milestone 4 — Audit Logs as Evidence

## Scope

Expand middleware + API to log structured JSON into audit_logs. Export hourly/daily summaries for compliance runs.

## Objectives

- Consistent structured audit events
- Export hooks for evidence collection
- Retention policy documented

## Acceptance Criteria

- API + middleware emit audit logs for key actions
- Export script produces JSON/CSV summaries
- CI links summaries in run artifacts

## Tasks

- [ ] Add log points (vault.create, rate.limit, imos.bind)
- [ ] Create scripts/export-audit.js with range filters
- [ ] Attach exports in CI artifacts

## Evidence

- .reports/exports/, CI artifacts

## Validation

- Governance dashboard reflects exported data

## Risks

- PII in logs; ensure meta excludes sensitive fields

## Status

- not-started

## Dates

- start:
- end:

## Owner

-
