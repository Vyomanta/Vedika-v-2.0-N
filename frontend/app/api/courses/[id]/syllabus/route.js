import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { getSyllabus, saveSyllabus } from '@/features/courses/server/provider';
export const dynamic = 'force-dynamic';
async function dispatch(request, context, admin) {
 const auth=await authenticateRequest(request,{requireAdmin:admin});if(auth.response)return auth.response;
 try {const {id}=await context.params;const data=admin?await saveSyllabus(request,auth,id,(await request.json()).syllabus):await getSyllabus(request,auth,id);return NextResponse.json(data,{headers:{'Cache-Control':'private, no-store'}});}
 catch(e){return NextResponse.json({error:e.status<500?e.message:'Syllabus backend unavailable.'},{status:e.status||503});}
}
export const GET=(request,context)=>dispatch(request,context,false);
export const POST=(request,context)=>dispatch(request,context,true);
