#!/usr/bin/env node
// Simple analytics smoke check: verify Vercel Analytics script is present in HTML

const url = process.env.BASE_URL || '';
const bypass = process.env.VERCEL_BYPASS_TOKEN || '';

if (!url) {
  console.error('❌ BASE_URL not provided');
  process.exit(1);
}

(async () => {
  try {
    const headers = bypass ? { 'x-vercel-protection-bypass': bypass } : undefined;
    const resp = await fetch(url, { headers });
    const html = await resp.text();

    if (html.includes('data-vercel-analytics')) {
      console.log('✅ Analytics script detected');
      process.exit(0);
    } else {
      console.error('⚠️ Analytics script NOT found');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error fetching page:', err?.message || err);
    process.exit(1);
  }
})();
