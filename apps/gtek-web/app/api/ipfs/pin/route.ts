import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = 'nodejs';

function supa() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const { data, name } = await req.json();

  // Fallback to mock if no API keys
  const cid = await pinToIPFS(data);

  const checksum = crypto.createHash("sha256").update(data).digest("hex");
  const sb = supa();
  if (!sb) {
    // Return mock object when Supabase is not configured
    return NextResponse.json({ vault: { name, cid, checksum, mock: true } });
  }

  // Insert into vaults + audit_logs (real DB)
  const { data: vault, error: vaultError } = await sb
    .from("vaults")
    .insert({ name, cid, checksum })
    .select()
    .single();

  if (vaultError) {
    return NextResponse.json({ error: vaultError.message }, { status: 500 });
  }

  const { error: auditError } = await sb.from("audit_logs").insert({
    action: "vault.create",
    subject: name,
    meta: { cid },
  });

  if (auditError) {
    return NextResponse.json({ error: auditError.message }, { status: 500 });
  }

  return NextResponse.json({ vault });
}

async function pinToIPFS(data: string): Promise<string> {
  if (process.env.PINATA_JWT) {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const out = await res.json();
    return out.IpfsHash;
  }

  if (process.env.WEB3_STORAGE_TOKEN) {
    const res = await fetch("https://api.web3.storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WEB3_STORAGE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const out = await res.json();
    return out.cid;
  }

  // fallback mock CID
  return "QmMockCID" + Date.now();
}
