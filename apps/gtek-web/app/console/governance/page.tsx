'use client';
import Shell from '@/components/Shell';
import { useEffect, useState } from 'react';

type AuditSummary = {
  ok: boolean;
  stats: { total: number; rateLimits: number };
  events: Array<{ created_at: string; meta: any }>;
  mock?: boolean;
};

export default function GovernancePage(){
  const [data,setData] = useState<AuditSummary|null>(null);
  const [err,setErr] = useState<string|null>(null);
  const [miles,setMiles] = useState<{ milestones: Array<{id:number; title:string; status:string}> }|null>(null);
  const [milesErr,setMilesErr] = useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch('/api/governance/audit');
        const j = await r.json();
        setData(j);
      }catch(e:any){
        setErr(e.message||'error');
      }
    })();
    (async()=>{
      try{
        const r = await fetch('/api/governance/milestones');
        const j = await r.json();
        setMiles(j);
      }catch(e:any){
        setMilesErr(e.message||'error');
      }
    })();
  },[]);

  return (
    <Shell>
      <h2 className='text-xl font-semibold mb-4'>Governance Dashboard</h2>
      {err && <div className='text-red-600 mb-4'>Error: {err}</div>}
      {!data && !err && <div>Loading…</div>}
      {data && (
        <div className='space-y-6'>
          <div>
            <h3 className='font-medium mb-2'>Milestone Progress</h3>
            {!miles && !milesErr && <div className='text-sm text-gray-500'>Loading milestones…</div>}
            {milesErr && <div className='text-sm text-red-600'>Error loading milestones</div>}
            {miles && (
              <div className='border p-3 rounded'>
                {(() => {
                  const total = miles.milestones?.length ?? 0;
                  const done = (miles.milestones||[]).filter(m=>m.status==='done').length;
                  const pct = total>0 ? Math.round((done/total)*100) : 0;
                  return (
                    <div>
                      <div className='w-full bg-slate-200 rounded-full h-2 mb-3'>
                        <div className='bg-green-500 h-2 rounded-full' style={{ width: `${pct}%` }} />
                      </div>
                      <ul className='text-xs space-y-1'>
                        {(miles.milestones||[]).map(m=> (
                          <li key={m.id}>
                            {m.status==='done' && '✅'} {m.status==='in-progress' && '🔄'} {m.status==='pending' && '⬜'} {m.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <div>
            <h3 className='font-medium mb-2'>Last 24h</h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='border p-3 rounded'>
                <div className='text-gray-500'>Total audit events</div>
                <div className='text-2xl'>{data.stats.total}</div>
              </div>
              <div className='border p-3 rounded'>
                <div className='text-gray-500'>Rate limit hits</div>
                <div className='text-2xl'>{data.stats.rateLimits}</div>
              </div>
            </div>
            {data.mock && <div className='text-xs text-gray-500 mt-2'>Mock data (no Supabase configured)</div>}
          </div>

          <div>
            <h3 className='font-medium mb-2'>Recent rate limit events</h3>
            <div className='overflow-x-auto text-xs'>
              <table className='min-w-full border'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='text-left p-2 border'>Time (UTC)</th>
                    <th className='text-left p-2 border'>IP</th>
                    <th className='text-left p-2 border'>Path</th>
                    <th className='text-left p-2 border'>Count</th>
                    <th className='text-left p-2 border'>Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.map((e,i)=>{
                    const m = e.meta||{};
                    return (
                      <tr key={i}>
                        <td className='p-2 border'>{new Date(e.created_at).toISOString()}</td>
                        <td className='p-2 border'>{m.ip||'-'}</td>
                        <td className='p-2 border'>{m.path||'-'}</td>
                        <td className='p-2 border'>{m.count??'-'}</td>
                        <td className='p-2 border'>{m.limit??'-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
