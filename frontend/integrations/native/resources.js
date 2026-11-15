import { query, transaction } from '@/shared/database/index.cjs';
import records from '@/features/assessments/server/repository.cjs';
import policy from '@/features/assessments/domain/policy.cjs';
import { randomUUID } from 'crypto';
import { listCourses, saveCourse, deleteCourse } from '@/features/courses/server/provider';

const generic = new Map([['LMS Batch','batch'],['Job Opportunity','job'],['LMS Certificate','certificate'],['LMS Alert','alert'],['LMS Category','category'],['LMS Certificate Settings','certificate-settings']]);
const withName = record => ({ ...record, name: record.name || record.id });
function filters(params) {
  try { const value=JSON.parse(params.get('filters')||'[]');return Array.isArray(value)?value.map(f=>f.length===4?f.slice(1):f):Object.entries(value).map(([key,val])=>[key,'=',val]); }
  catch { policy.fail('Invalid resource filters.'); }
}
function applyFilters(rows, params) {
  const criteria=filters(params);
  const filtered=rows.filter(row=>criteria.every(([key,op,value])=>op==='='?String(row[key])===String(value):op==='!='?String(row[key])!==String(value):op==='in'?Array.isArray(value)&&value.includes(row[key]):op==='like'?String(row[key]||'').toLowerCase().includes(String(value).replaceAll('%','').toLowerCase()):false));
  const start=Math.max(0,Number(params.get('limit_start')||0));
  const limit=Math.min(1000,Math.max(1,Number(params.get('limit_page_length')||1000)));
  return filtered.slice(start,start+limit);
}

export async function nativeResource(request,auth,type,id,method,data={}) {
  const tenant=auth.user.tenant_id, owner=auth.user.email.toLowerCase();
  if(type==='LMS Course') {
    if(method==='GET'){const rows=await listCourses(request,auth);return id?rows.find(r=>r.id===id):applyFilters(rows.map(withName),new URL(request.url).searchParams);}
    if(!auth.isAdmin)policy.fail('Administrator permission required.',403);
    return method==='DELETE'?deleteCourse(request,auth,id):saveCourse(request,auth,data,id);
  }
  if(type==='User') {
    if(!auth.isAdmin)policy.fail('Administrator permission required.',403);
    if(method!=='GET')policy.fail('User provisioning must use the registration flow.',405);
    const rows=await query('SELECT email AS name,email,full_name,enabled,role FROM users WHERE tenant_id = ?',[tenant]);
    return id?rows.find(r=>r.name===id):applyFilters(rows,new URL(request.url).searchParams);
  }
  if(type==='LMS Enrollment') {
    if(method==='GET') {
      const rows=await query('SELECT e.id::text AS name,e.course_id AS course,u.email AS member FROM enrollments e JOIN users u ON u.id=e.user_id JOIN courses c ON c.id=e.course_id WHERE u.tenant_id=? AND c.tenant_id=?'+(auth.isAdmin?'':' AND LOWER(u.email)=?'),auth.isAdmin?[tenant,tenant]:[tenant,tenant,owner]);
      return applyFilters(rows,new URL(request.url).searchParams);
    }
    if(method!=='POST')policy.fail('Unsupported enrollment operation.',405);
    const member=String(data.member||owner).toLowerCase();
    if(!auth.isAdmin&&member!==owner)policy.fail('Cannot enroll another student.',403);
    const users=await query('SELECT id FROM users WHERE LOWER(email)=? AND tenant_id=?',[member,tenant]);
    const courses=await query("SELECT id FROM courses WHERE id=? AND tenant_id=? AND status='Published'",[data.course,tenant]);
    if(!users[0]||!courses[0])policy.fail('Student or course not found.',404);
    await query('INSERT INTO enrollments (user_id,course_id) VALUES (?,?) ON CONFLICT (user_id,course_id) DO NOTHING',[users[0].id,data.course]);
    return {member,course:data.course,name:`${member}:${data.course}`};
  }
  if(type==='Course Lesson'||type==='Course Chapter') {
    if(method!=='GET')policy.fail('Use the course syllabus editor to change lessons.',405);
    const lesson=type==='Course Lesson', table=lesson?'course_lessons':'course_chapters';
    const rows=await query(`SELECT t.*,t.id AS name,t.course_id AS course${lesson?',t.chapter_id AS chapter,t.youtube_url AS youtube,t.content_body AS body,t.content_body AS content':''} FROM ${table} t JOIN courses c ON c.id=t.course_id WHERE c.tenant_id=?`,[tenant]);
    return id?rows.find(r=>r.id===id):applyFilters(rows,new URL(request.url).searchParams);
  }
  const kind=generic.get(type);
  if(!kind)policy.fail('This resource is not supported by the native backend.',404);
  if(method==='GET') {
    if(['certificate','alert'].includes(kind)&&!auth.isAdmin){const rows=await records.list(query,tenant,kind,{owner});return applyFilters(rows.map(withName),new URL(request.url).searchParams);}
    const rows=await records.list(query,tenant,kind);
    return id?rows.find(r=>r.id===id):applyFilters(rows.map(withName),new URL(request.url).searchParams);
  }
  if(!auth.isAdmin)policy.fail('Administrator permission required.',403);
  return transaction(async run=>{
    const previous=id?await records.get(run,tenant,kind,id,true):null;
    if(id&&!previous)policy.fail('Resource not found.',404);
    if(method==='DELETE'){await records.remove(run,tenant,kind,id);return {name:id};}
    const record={...previous,...data,id:id||data.id||randomUUID(),updated_at:new Date().toISOString()};
    record.name=record.id;
    return records.save(run,tenant,kind,record,{owner:String(record.member||record.student||'').toLowerCase()});
  });
}
