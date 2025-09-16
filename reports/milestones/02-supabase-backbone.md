# Milestone 2 — Supabase Backbone

## Scope

Finalize schema, RLS, and seeds for orgs, vaults, audit_logs, and governance tables.

## Objectives

- Schema applied and versioned
- RLS enforced for org-bound access
- Seeds provide working demo data

## Acceptance Criteria

- `supabase/schema.sql`, `rls.sql`, and `seed.sql` applied
- Policies validated with test queries
- Audit log append-only semantics verified

## Tasks

- [ ] Review and apply schema changes
- [ ] Validate RLS policies per role (owner/admin/member)
- [ ] Seed base org/users/memberships

## Evidence

- psql outputs, screenshots, or links to CI steps

## Validation

- Read/write behavior matches RLS policies

## Risks

- Over-permissive policies; mitigate via tests and reviews

## Status

- not-started

## Dates

- start:
- end:

## Owner

-
