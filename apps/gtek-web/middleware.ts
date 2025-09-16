import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import limits from "./config/rate_limits.json";

// In-memory counter fallback (swap for Redis in prod)
const counters: Record<string, { count: number; reset: number }> = {};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const method = req.method ?? "GET";
  const ip = getClientIp(req);
  const actor = req.headers.get("x-actor-id") ?? "anonymous";
  const key = `${ip}:${url}`;

  const routeLimit = limits.api?.limit ?? 60;
  const windowMs = parseWindow(limits.api?.window ?? "1m");
  const now = Date.now();

  if (!counters[key] || counters[key].reset < now) {
    counters[key] = { count: 1, reset: now + windowMs };
  } else {
    counters[key].count++;
  }

  const resetAt = counters[key].reset;
  const metaBase = {
    ip,
    path: url,
    method,
    actor,
    count: counters[key].count,
    limit: routeLimit,
    reset: new Date(resetAt).toISOString(),
  };

  if (counters[key].count > routeLimit) {
    queueAudit("rate.limit", metaBase);
    return new NextResponse("⛔ Rate limit exceeded", { status: 429 });
  }

  queueAudit("api.hit", metaBase);
  return NextResponse.next();
}

function parseWindow(w: string): number {
  const match = /^(\d+)([smh])$/.exec(w);
  if (!match) return 60000;
  const num = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    default:
      return 60000;
  }
}

function getClientIp(req: NextRequest): string {
  if (req.ip) return req.ip;
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  const [first] = xff.split(",");
  return first?.trim() || "unknown";
}

function queueAudit(action: string, meta: Record<string, unknown>) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!supabaseUrl || !serviceKey) return;
  const payload = {
    action,
    entity: "api.middleware",
    meta,
  };
  fetch(`${supabaseUrl}/rest/v1/audit_logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* swallow audit errors */
  });
}

export const config = {
  matcher: ["/api/:path*"], // apply to all API routes
};
