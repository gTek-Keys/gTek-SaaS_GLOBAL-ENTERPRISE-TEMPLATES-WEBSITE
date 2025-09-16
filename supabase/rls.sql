-- gTek GLOBAL — RLS policies

-- Enable RLS
alter table orgs enable row level security;
alter table users enable row level security;
alter table memberships enable row level security;
alter table vaults enable row level security;
alter table external_registry_links enable row level security;
alter table audit_logs enable row level security;

-- Assumptions:
-- 1) A Postgres session variable app.user_id (uuid) and app.org_id (uuid) are set via your API layer
--    or using Supabase's jwt -> request.jwt.claims.sub / org_id claim mapping.
-- 2) Owners/admins can read within their org; members can read; only owners/admins can insert/update.

-- Helper to check membership role
create or replace function public.has_org_role(target_org uuid, roles text[])
returns boolean language sql stable as $$
  select exists (
    select 1 from memberships m
    where m.org_id = target_org and m.user_id = current_setting('app.user_id', true)::uuid
      and m.role = any(roles)
  );
$$;

-- orgs
create policy orgs_sel on orgs for select using (
  has_org_role(id, array['owner','admin','member'])
);
create policy orgs_ins on orgs for insert with check (
  true
);

-- users (self or org members can see minimal fields)
create policy users_sel on users for select using (
  id = current_setting('app.user_id', true)::uuid
  or exists (
    select 1 from memberships m where m.user_id = users.id
      and m.org_id = current_setting('app.org_id', true)::uuid
  )
);

-- memberships
create policy memberships_sel on memberships for select using (
  org_id = current_setting('app.org_id', true)::uuid
);

-- vaults
create policy vaults_sel on vaults for select using (
  org_id = current_setting('app.org_id', true)::uuid
);
create policy vaults_ins on vaults for insert with check (
  has_org_role(org_id, array['owner','admin'])
);

-- external_registry_links
create policy erl_sel on external_registry_links for select using (
  org_id = current_setting('app.org_id', true)::uuid
);
create policy erl_ins on external_registry_links for insert with check (
  has_org_role(org_id, array['owner','admin'])
);

-- audit_logs (read within org)
create policy audit_sel on audit_logs for select using (
  org_id = current_setting('app.org_id', true)::uuid
);
