import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { backend } from '@/lib/backend.cjs';
import { nativeResource } from '@/integrations/native/resources';
import { frappeRequest } from '@/integrations/frappe/server';
export const dynamic='force-dynamic';
async function handle(request,context) {
 const auth=await authenticateRequest(request);if(auth.response)return auth.response;
 try {
  const {segments}=await context.params;const [type,id]=segments;
  if(/quiz|assignment|question/i.test(type))return NextResponse.json({error:'Use the permission-checked assessment API.'},{status:403});
  if(type==='User'&&!auth.isAdmin)return NextResponse.json({error:'Administrator permission required.'},{status:403});
  if(request.method!=='GET'&&!auth.isAdmin&&type!=='LMS Enrollment')return NextResponse.json({error:'Administrator permission required.'},{status:403});
  const data=['POST','PUT','PATCH'].includes(request.method)?await request.json():undefined;
  if(type==='LMS Enrollment'&&!auth.isAdmin){
   const filters=new URL(request.url).searchParams.get('filters');
   let member=data?.member;
   if(request.method==='GET'){try{member=JSON.parse(filters||'{}').member;}catch{member=null;}}
   if(!member||member.toLowerCase()!==auth.user.email.toLowerCase()||!['GET','POST'].includes(request.method))return NextResponse.json({error:'Only your own enrollment is accessible.'},{status:403});
  }
  const result=backend()==='neon'?await nativeResource(request,auth,type,id,request.method,data):await frappeRequest(request,`/api/resource/${segments.map(encodeURIComponent).join('/')}${new URL(request.url).search}`,{method:request.method,data});
  return NextResponse.json({data:result},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return NextResponse.json({error:e.status<500?e.message:'LMS resource service unavailable.'},{status:e.status||503});}
}
export const GET=handle,POST=handle,PUT=handle,DELETE=handle;
