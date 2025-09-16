import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supa';

export const runtime = 'nodejs';

export async function GET() {
  const sb = getServiceClient();
  if (!sb) {
    return NextResponse.json({ ok: true, mock: true, stats: { total: 0, rateLimits: 0 }, events: [] });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Count all events last 24h
  const all = await sb
    .from('audit_logs')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since);

  // Fetch recent rate.limit events
  const rl = await sb
    .from('audit_logs')
    .select('created_at, meta')
    .eq('action', 'rate.limit')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(50);

  return NextResponse.json({
    ok: true,
    stats: {
      total: all.count ?? 0,
      rateLimits: rl.data?.length ?? 0,
    },
    events: rl.data ?? []
  });
}
