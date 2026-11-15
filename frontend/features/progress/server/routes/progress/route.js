import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import repository from '@/features/assessments/server/repository.cjs';
const headers={'Cache-Control':'private, no-store'};
export const dynamic='force-dynamic';
export async function GET(request){
 const auth=await authenticateRequest(request);if(auth.response)return auth.response;
 const requested=new URL(request.url).searchParams.get('email')?.toLowerCase();
 const owner=auth.user.email.toLowerCase(),tenant=auth.user.tenant_id;
 if(requested&&requested!==owner&&!auth.isAdmin)return NextResponse.json({error:'You may only access your own progress.'},{status:403,headers});
 try{
  if(requested||!auth.isAdmin){const record=await repository.get(repository.query,tenant,'progress',requested||owner);return NextResponse.json({completed:record?.completed||{}},{headers});}
  const records=await repository.list(repository.query,tenant,'progress');
  return NextResponse.json({allProgress:Object.fromEntries(records.map(row=>[row.id,row.completed]))},{headers});
 }catch(e){return NextResponse.json({error:'Progress storage unavailable.'},{status:503,headers});}
}
export async function POST(request){
 const auth=await authenticateRequest(request);if(auth.response)return auth.response;
 try{
  const origin=request.headers.get('origin');if(origin&&new URL(origin).host!==new URL(request.url).host)return NextResponse.json({error:'Cross-origin mutation denied.'},{status:403,headers});
  const raw=await request.text();if(raw.length>100000)return NextResponse.json({error:'Progress payload too large.'},{status:413,headers});
  const {email,completed}=JSON.parse(raw);const owner=auth.user.email.toLowerCase();
  if(typeof email!=='string'||!completed||typeof completed!=='object'||Array.isArray(completed))return NextResponse.json({error:'Email and completed object required.'},{status:400,headers});
  if(email.toLowerCase()!==owner&&!auth.isAdmin)return NextResponse.json({error:'You may only update your own progress.'},{status:403,headers});
  await repository.save(repository.query,auth.user.tenant_id,'progress',{id:email.toLowerCase(),completed},{owner:email.toLowerCase()});
  return NextResponse.json({ok:true},{headers});
 }catch(e){return NextResponse.json({error:e instanceof SyntaxError?'Invalid JSON.':'Progress storage unavailable.'},{status:e instanceof SyntaxError?400:503,headers});}
}
