-- gTek GLOBAL — Supabase schema

create extension if not exists pgcrypto;

-- Organizations
create table if not exists orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  crid text,
  created_at timestamptz not null default now()
);

-- Users (app users, not auth.users). Link to auth.users via auth_user_id
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text unique,
  display_name text,
  created_at timestamptz not null default now()
);

-- Memberships: user belongs to org with a role
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique(org_id, user_id)
);

-- Vaults store pinned artifacts (IPFS)
create table if not exists vaults (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  cid text not null,
  crid text,
  vault_code text not null unique,
  codex_id text not null,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

-- External registry links (e.g., IMOS/CRID bindings)
create table if not exists external_registry_links (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  vault_id uuid not null references vaults(id) on delete cascade,
  registry text not null,
  reference text not null,
  created_at timestamptz not null default now(),
  unique (registry, reference)
);

-- Audit log (append-only)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references orgs(id) on delete set null,
  actor_user_id uuid references users(id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  meta jsonb not null default '{}',
  checksum text,
  created_at timestamptz not null default now()
);

create index if not exists idx_memberships_org on memberships(org_id);
create index if not exists idx_vaults_org on vaults(org_id);
create index if not exists idx_audit_org on audit_logs(org_id);
