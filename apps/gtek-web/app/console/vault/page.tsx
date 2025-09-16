'use client';
import Shell from '@/components/Shell';
import { useState } from 'react';

export default function Vault(){
  const [cid,setCid]=useState('');
  const [crid,setCrid]=useState('');
  const [out,setOut]=useState<any>(null);

  async function pin(){
    const org_id='0000';
    const r=await fetch('/api/ipfs/pin',{method:'POST',body:JSON.stringify({cid,crid,org_id})});
    setOut(await r.json());
  }
  return (
    <Shell>
      <h2 className='text-xl font-semibold mb-2'>Vault Pinning</h2>
      <input className='border p-1 mr-2' value={cid} onChange={e=>setCid((e.target as any).value)} placeholder='CID'/>
      <input className='border p-1 mr-2' value={crid} onChange={e=>setCrid((e.target as any).value)} placeholder='CRID'/>
      <button className='border px-3 py-1' onClick={pin}>Pin</button>
      {out && <pre className='mt-4 text-xs'>{JSON.stringify(out,null,2)}</pre>}
    </Shell>
  );
}
