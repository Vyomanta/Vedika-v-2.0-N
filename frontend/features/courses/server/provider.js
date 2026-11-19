import { backend, query, transaction } from '@/shared/database/index.cjs';
import { frappeRequest } from '@/integrations/frappe/server';
import repository from '@/features/assessments/server/repository.cjs';
import { randomUUID } from 'crypto';
import { getFrappeDb } from '@/integrations/frappe/database';

const normalise = c => ({ ...c, id: c.id || c.name, name: c.name || c.id, instructor: c.instructor || c.instructor_name || 'Instructor', description: c.description || c.short_introduction || '', image: c.image || c.image_url || '', lessonsCount: Number(c.lessonsCount || c.lessons || 0), status: c.status || (c.published ? 'Published' : 'Draft') });

export async function listCourses(request, auth) {
  const archived = new Set((await repository.list(query,auth.user.tenant_id,'course-archive')).map(record=>record.id));
  if (backend() === 'frappe') {
    const params = new URLSearchParams({ fields: JSON.stringify(['name','title','category','short_introduction','image','published','lessons']), limit_page_length: '1000' });
    let items;
    try {
      items = await frappeRequest(request, `/api/resource/LMS%20Course?${params}`);
    } catch {
      const [rows] = await getFrappeDb().query(
        'SELECT name, title, category, short_introduction, image, published, lessons FROM `tabLMS Course` ORDER BY creation DESC LIMIT 1000'
      );
      items = rows || [];
    }
    return items.map(normalise).filter(course=>!archived.has(course.id)&&(auth.isAdmin||course.status==='Published'));
  }
  const rows = await query(`SELECT c.*, (SELECT COUNT(*) FROM course_lessons l WHERE l.course_id=c.id) AS "lessonsCount", (SELECT COUNT(*) FROM enrollments e WHERE e.course_id=c.id) AS enrolled FROM courses c WHERE tenant_id = ? ${auth.isAdmin ? '' : "AND status = 'Published'"} ORDER BY created_at DESC`, [auth.user.tenant_id]);
  return rows.map(normalise).filter(course=>!archived.has(course.id)&&course.status!=='Archived');
}

export async function saveCourse(request, auth, input, existingId) {
  if (!input?.title || typeof input.title !== 'string') throw Object.assign(new Error('Course title is required.'), { status: 400 });
  if (backend() === 'frappe') {
    const [users]=await getFrappeDb().query('SELECT name FROM `tabUser` WHERE name=? OR email=? LIMIT 1',[auth.user.user_id,auth.user.email]);
    if(!users[0])throw Object.assign(new Error('The author account is unavailable in Frappe.'),{status:403});
    const data = { title: input.title, category: input.category || 'General', short_introduction: input.description || input.short_introduction || input.title, image: input.image || '', published: input.status === 'Draft' ? 0 : 1, ...(!existingId?{instructors:[{instructor:users[0].name}]}:{}) };
    const result = await frappeRequest(request, `/api/resource/LMS%20Course${existingId ? '/' + encodeURIComponent(existingId) : ''}`, { method: existingId ? 'PUT' : 'POST', data });
    return normalise(result);
  }
  const id = existingId || input.id || randomUUID();
  await query(`INSERT INTO courses (id,title,category,instructor_name,description,image_url,status,tenant_id) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,category=EXCLUDED.category,instructor_name=EXCLUDED.instructor_name,description=EXCLUDED.description,image_url=EXCLUDED.image_url,status=EXCLUDED.status WHERE courses.tenant_id=EXCLUDED.tenant_id`, [id,input.title,input.category || 'General',input.instructor || 'Instructor',input.description || '',input.image || '',input.status || 'Published',auth.user.tenant_id]);
  const rows = await query('SELECT * FROM courses WHERE id = ? AND tenant_id = ?', [id,auth.user.tenant_id]);
  if (!rows[0]) throw Object.assign(new Error('Course belongs to another organisation.'), { status: 403 });
  return normalise(rows[0]);
}

export async function deleteCourse(request, auth, id) {
  if (!id) throw Object.assign(new Error('Course ID required.'), { status: 400 });
  if (backend() === 'frappe') await frappeRequest(request, `/api/resource/LMS%20Course/${encodeURIComponent(id)}`, { method: 'PUT',data:{published:0} });
  await transaction(async run=>{
    if(backend()==='neon')await run("UPDATE courses SET status='Archived' WHERE id=? AND tenant_id=?",[id,auth.user.tenant_id]);
    await repository.save(run,auth.user.tenant_id,'course-archive',{id,archived_at:new Date().toISOString()});
    for(const kind of ['quiz','assignment','batch']){
      const rows=await repository.list(run,auth.user.tenant_id,kind);
      for(const row of rows.filter(row=>row.course===id))await repository.save(run,auth.user.tenant_id,kind,{...row,status:'Archived'});
    }
  });
  return { success: true,archived:true };
}

export async function getSyllabus(request, auth, id) {
  if(await repository.get(query,auth.user.tenant_id,'course-archive',id))throw Object.assign(new Error('This course has been archived.'),{status:410});
  const saved = await repository.get(query, auth.user.tenant_id, 'syllabus', id);
  if (saved) return saved;
  let chapters, lessons;
  if (backend() === 'frappe') {
    const fetchList = (type, filters) => frappeRequest(request, `/api/resource/${encodeURIComponent(type)}?${new URLSearchParams({ fields: '["*"]', filters: JSON.stringify(filters), limit_page_length: '1000', order_by: 'idx asc' })}`);
    try {
      [chapters,lessons] = await Promise.all([fetchList('Course Chapter',{course:id}),fetchList('Course Lesson',{course:id})]);
    } catch {
      const db = getFrappeDb();
      const [[chRows], [lRows]] = await Promise.all([
        db.query('SELECT name, idx, title, course FROM `tabCourse Chapter` WHERE course = ? ORDER BY idx ASC', [id]),
        db.query('SELECT name, idx, title, chapter, course, content, body, youtube FROM `tabCourse Lesson` WHERE course = ? ORDER BY idx ASC', [id]),
      ]);
      chapters = chRows || [];
      lessons = lRows || [];
    }
  } else {
    const courses = await query('SELECT id FROM courses WHERE id = ? AND tenant_id = ?', [id,auth.user.tenant_id]);
    if (!courses.length) throw Object.assign(new Error('Course not found.'),{status:404});
    chapters = await query('SELECT * FROM course_chapters WHERE course_id = ? ORDER BY sort_order', [id]);
    lessons = await query('SELECT * FROM course_lessons WHERE course_id = ? ORDER BY sort_order', [id]);
  }
  return { ok: true, modules: chapters.map(ch => ({ id: ch.id || ch.name, title: ch.title, lessons: lessons.filter(l => (l.chapter_id || l.chapter) === (ch.id || ch.name)).map(l => ({ id: l.id || l.name, title:l.title, youtube:l.youtube_url || l.youtube || '', vid:l.youtube_url || l.youtube || '', overview:l.content_body || l.body || '', content:l.content_body || l.content || '' })) })) };
}

export async function saveSyllabus(request, auth, id, syllabus) {
  if (!Array.isArray(syllabus.modules) || syllabus.modules.length > 100) throw Object.assign(new Error('A syllabus requires a modules array.'),{status:400});
  // Rich editor metadata has one durable source in either deployment. Never write runtime JSON files.
  if (backend() === 'neon') await transaction(async run => {
    const owned = await run('SELECT id FROM courses WHERE id = ? AND tenant_id = ? FOR UPDATE',[id,auth.user.tenant_id]);
    if (!owned.length) throw Object.assign(new Error('Course not found.'),{status:404});
    for (const [index,ch] of syllabus.modules.entries()) {
      const chapterId=ch.id || randomUUID();
      await run('INSERT INTO course_chapters (id,course_id,title,sort_order) VALUES (?,?,?,?) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,sort_order=EXCLUDED.sort_order WHERE course_chapters.course_id=EXCLUDED.course_id',[chapterId,id,ch.title,index]);
      for (const [i,l] of (ch.lessons||[]).entries()) await run('INSERT INTO course_lessons (id,chapter_id,course_id,title,content_body,youtube_url,sort_order) VALUES (?,?,?,?,?,?,?) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,content_body=EXCLUDED.content_body,youtube_url=EXCLUDED.youtube_url,sort_order=EXCLUDED.sort_order WHERE course_lessons.course_id=EXCLUDED.course_id',[l.id||randomUUID(),chapterId,id,l.title,l.overview||l.content||'',l.vid||l.youtube||'',i]);
    }
    await repository.save(run,auth.user.tenant_id,'syllabus',{...syllabus,id});
  });
  else {
    await frappeRequest(request,`/api/resource/LMS%20Course/${encodeURIComponent(id)}`);
    await repository.save(query,auth.user.tenant_id,'syllabus',{...syllabus,id});
  }
  return { success:true,syllabus };
}
