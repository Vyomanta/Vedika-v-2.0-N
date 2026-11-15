import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { backend,query } from '@/shared/database/index.cjs';
import { frappeRequest } from '@/integrations/frappe/server';
import { listCourses,getSyllabus } from '@/features/courses/server/provider';
export const dynamic='force-dynamic';
async function handle(request,context) {
 const auth=await authenticateRequest(request);if(auth.response)return auth.response;
 try {
  const {segments}=await context.params;const method=segments.join('/');
  const allowed=new Set(['academy_portal.api.get_enrolled_courses','lms.lms.api.get_course_syllabus_optimized','lms.lms.api.get_courses_optimized','lms.lms.api.get_lms_students_optimized','lms.lms.api.save_course_lesson_custom','lms.lms.api.save_course_chapter_custom']);
  if(!allowed.has(method))return NextResponse.json({error:'Method not exposed by this application.'},{status:404});
  if((method.includes('get_lms_students')||method.includes('save_course_'))&&!auth.isAdmin)return NextResponse.json({error:'Administrator permission required.'},{status:403});
  if(backend()==='frappe'){const data=request.method==='POST'?await request.json():undefined;const result=await frappeRequest(request,`/api/method/${segments.map(encodeURIComponent).join('/')}${new URL(request.url).search}`,{method:request.method,data});return NextResponse.json({message:result});}
  let result;
  if(method==='lms.lms.api.get_lms_students_optimized'){
   if(!auth.isAdmin)return NextResponse.json({error:'Administrator permission required.'},{status:403});
   result=await query("SELECT email AS username,full_name AS name FROM users WHERE tenant_id=? AND role='student'",[auth.user.tenant_id]);
  }else if(method==='academy_portal.api.get_enrolled_courses'){
   const courses=await listCourses(request,auth);const enrolled=await query('SELECT e.course_id FROM enrollments e JOIN users u ON u.id=e.user_id WHERE LOWER(u.email)=? AND u.tenant_id=?',[auth.user.email.toLowerCase(),auth.user.tenant_id]);result=courses.filter(c=>enrolled.some(e=>e.course_id===c.id));
  }else if(method==='lms.lms.api.get_course_syllabus_optimized')result=await getSyllabus(request,auth,new URL(request.url).searchParams.get('course_id')||new URL(request.url).searchParams.get('course'));
  else return NextResponse.json({error:'Native method not supported. Use the documented feature API.'},{status:404});
  return NextResponse.json({message:result},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return NextResponse.json({error:'LMS method unavailable.'},{status:e.status||503});}
}
export const GET=handle,POST=handle;
