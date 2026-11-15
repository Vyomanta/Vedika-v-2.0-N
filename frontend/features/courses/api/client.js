import { request } from '@/shared/api/client';
import { invalidateCoursesCache, invalidateSyllabusCache } from '@/integrations/frappe/transport';
export async function getCourses() { const data=await request('/api/courses');return data.courses; }
export async function createCourse(course) {const result=await request('/api/courses',{method:'POST',body:JSON.stringify({course})});invalidateCoursesCache();return result.course;}
export async function updateCourse(id,course) {const result=await request('/api/courses',{method:'PUT',body:JSON.stringify({id,course})});invalidateCoursesCache();return result.course;}
export async function deleteCourse(id) {const result=await request('/api/courses?id='+encodeURIComponent(id),{method:'DELETE'});invalidateCoursesCache();return result;}
export async function getCourseSyllabus(id) {const data=await request('/api/courses/'+encodeURIComponent(id)+'/syllabus');return data;}
export async function saveCourseSyllabus(id,syllabus) {const result=await request('/api/courses/'+encodeURIComponent(id)+'/syllabus',{method:'POST',body:JSON.stringify({syllabus})});invalidateSyllabusCache(id);return result.syllabus;}
