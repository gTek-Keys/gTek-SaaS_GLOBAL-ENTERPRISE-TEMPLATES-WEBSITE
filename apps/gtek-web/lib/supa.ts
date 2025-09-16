import { createClient } from '@supabase/supabase-js';

export function getServiceClient(){
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE as string | undefined;
  if (!url || !key) return null as any;
  return createClient(url, key);
}
