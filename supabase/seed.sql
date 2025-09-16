-- gTek GLOBAL — minimal seed

insert into orgs (name, crid) values ('TrustPresident Org', 'CRID-TP-0001') returning id \gset

insert into users (email, display_name) values ('president@example.com','Trust President') returning id \gset
insert into users (email, display_name) values ('lead@example.com','Lead Engineer') returning id \gset

-- Assuming the last two ids are in :id (psql limitation for demo). For clarity, reselect ids
\set tp_user_id  (select id from users where email='president@example.com')
\set le_user_id  (select id from users where email='lead@example.com')

insert into memberships (org_id, user_id, role) values (:'id', :'tp_user_id', 'owner');
insert into memberships (org_id, user_id, role) values (:'id', :'le_user_id', 'admin');

-- demo vault row
insert into vaults (org_id, cid, crid, vault_code, codex_id, created_by)
values (:'id','QmTestCid','CRID-DEMO-1','VAULT-DEMO-001','CODEX-DEMO-001', :'tp_user_id');

insert into audit_logs (org_id, actor_user_id, action, entity, meta)
values (:'id', :'tp_user_id', 'seed.insert', 'vaults', '{"cid":"QmTestCid"}'::jsonb);
