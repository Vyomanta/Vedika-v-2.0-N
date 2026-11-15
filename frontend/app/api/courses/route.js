import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { listCourses, saveCourse, deleteCourse } from '@/features/courses/server/provider';
export const dynamic = 'force-dynamic';
async function dispatch(request, action, admin = false) {
 const auth = await authenticateRequest(request, { requireAdmin: admin });
 if (auth.response) return auth.response;
 try { return NextResponse.json(await action(auth),{headers:{'Cache-Control':'private, no-store'}}); }
 catch(e) { console.error('[Courses]',e.code||e.name);return NextResponse.json({error:e.status<500?e.message:'Course backend unavailable.'},{status:e.status||503}); }
}
export const GET = request => dispatch(request,async auth => ({success:true,courses:await listCourses(request,auth)}));
export const POST = request => dispatch(request,async auth => {const body=await request.json();if(body.courses)throw Object.assign(new Error('Use individual course operations; bulk replacement is disabled.'),{status:400});return {success:true,course:await saveCourse(request,auth,body.course||body)};},true);
export const PUT = request => dispatch(request,async auth => {const body=await request.json();return {success:true,course:await saveCourse(request,auth,body.course,body.id)};},true);
export const DELETE = request => dispatch(request,auth => deleteCourse(request,auth,new URL(request.url).searchParams.get('id')),true);
