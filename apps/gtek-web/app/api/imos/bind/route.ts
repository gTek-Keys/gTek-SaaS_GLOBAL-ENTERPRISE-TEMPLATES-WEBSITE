import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function supa() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const { vault_code, crid, org_id } = await req.json();
  if (!vault_code || !crid) {
    return NextResponse.json({ error: 'vault_code+crid required' }, { status: 400 });
  }

  const sb = supa();
  if (!sb) {
    return NextResponse.json({ ok: true, vault_code, crid, mock: true });
  }

  const { data: vault, error } = await sb
    .from('vaults')
    .select('id, org_id')
    .eq('vault_code', vault_code)
    .single();
  if (error || !vault) {
    return NextResponse.json({ error: 'vault not found' }, { status: 404 });
  }

  const { error: upErr } = await sb
    .from('vaults')
    .update({ crid })
    .eq('id', vault.id);
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  await sb.from('external_registry_links').insert({
    org_id: org_id || vault.org_id,
    vault_id: vault.id,
    registry: 'IMOS',
    reference: crid
  });

  await sb.from('audit_logs').insert({
    org_id: org_id || vault.org_id,
    action: 'imos.bind',
    entity: 'vaults',
    entity_id: vault.id,
    meta: { vault_code, crid }
  });

  return NextResponse.json({ ok: true, vault_code, crid });
}
