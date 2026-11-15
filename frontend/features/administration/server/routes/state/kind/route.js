import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import repository from '@/features/assessments/server/repository.cjs';
import { randomUUID,createHash } from 'crypto';
export const dynamic='force-dynamic';
const kinds=new Set(['notification','certificate','certificate-config','category','batch','job']);
async function handle(request,context) {
 const auth=await authenticateRequest(request);if(auth.response)return auth.response;
 try {
  const {kind}=await context.params;
  if(!kinds.has(kind))return NextResponse.json({error:'Unknown collection.'},{status:404});
  const tenant=auth.user.tenant_id,owner=auth.user.email.toLowerCase();
  if(request.method==='GET') {
   const rows=(await repository.list(repository.query,tenant,kind)).filter(row=>row.status!=='Archived');
   const visible=auth.isAdmin?rows:kind==='certificate'?rows.filter(r=>String(r.member||r.student||'').toLowerCase()===owner):kind==='notification'?rows.filter(r=>!r.member||String(r.member).toLowerCase()===owner):['category','certificate-config','job','batch'].includes(kind)?rows:[];
   if(kind==='notification'){
    const receipts=await repository.list(repository.query,tenant,'notification-read');
    for(const row of visible)row.read=receipts.some(r=>r.member===owner&&r.notification===row.id);
   }
   return NextResponse.json(visible,{headers:{'Cache-Control':'private, no-store'}});
  }
  if(kind==='notification'&&request.method==='POST'){
   const input=await request.clone().json();
   if(input?.id&&input.read===true&&Object.keys(input).every(key=>['id','read'].includes(key))){
   const item=await repository.get(repository.query,tenant,'notification',String(input.id));
   if(!item||(item.member&&String(item.member).toLowerCase()!==owner))return NextResponse.json({error:'Notification unavailable.'},{status:404});
   await repository.save(repository.query,tenant,'notification-read',{id:createHash('sha256').update(JSON.stringify([owner,item.id])).digest('hex'),member:owner,notification:item.id},{owner});
   return NextResponse.json({success:true},{headers:{'Cache-Control':'private, no-store'}});
   }
  }
  if(!auth.isAdmin)return NextResponse.json({error:'Administrator permission required.'},{status:403});
  if(request.method==='DELETE'){
   const id=new URL(request.url).searchParams.get('id');if(!id)return NextResponse.json({error:'ID required.'},{status:400});
   await repository.remove(repository.query,tenant,kind,id);return NextResponse.json({success:true});
  }
  const body=await request.json();if(!body||typeof body!=='object'||Array.isArray(body)||JSON.stringify(body).length>100000)return NextResponse.json({error:'Invalid record.'},{status:400});
  const record=await repository.transaction(async run=>{
   const id=String(body.id||randomUUID());const old=await repository.get(run,tenant,kind,id,true);
   return repository.save(run,tenant,kind,{...old,...body,id,updated_at:new Date().toISOString()},{owner:String(body.member||body.student||'').toLowerCase()});
  });
  return NextResponse.json(record,{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){console.error('[Feature storage]',e.code||e.name);return NextResponse.json({error:'Storage unavailable. No success has been recorded.'},{status:503});}
}
export const GET=handle,POST=handle,DELETE=handle;
