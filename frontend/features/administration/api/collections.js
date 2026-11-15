import { request } from '@/shared/api/client';
import { DEFAULT_CERT_CONFIG } from '@/features/progress/api/lms';
import { frappeRestGet,frappeRestPost } from '@/integrations/frappe/transport';
const list=kind=>request('/api/state/'+kind);
const save=(kind,body)=>request('/api/state/'+kind,{method:'POST',body:JSON.stringify(body)});
const remove=(kind,id)=>request('/api/state/'+kind+'?id='+encodeURIComponent(id),{method:'DELETE'});
export const getBatches=()=>list('batch');
export const createBatch=data=>save('batch',data);
export const updateBatch=(id,data)=>save('batch',{...data,id});
export const deleteBatch=id=>remove('batch',id);
export const getJobs=()=>list('job');
export const createJob=data=>save('job',data);
export const updateJob=(id,data)=>save('job',{...data,id});
export const deleteJob=id=>remove('job',id);
export const getCertificates=()=>list('certificate');
export const createCertificate=data=>save('certificate',data);
export const deleteCertificate=id=>remove('certificate',id);
export async function getCertificateConfig(){const rows=await list('certificate-config');return {...DEFAULT_CERT_CONFIG,...rows.find(r=>r.id==='default')};}
export const saveCertificateConfig=data=>save('certificate-config',{...data,id:'default'});
export const getNotifications=()=>list('notification');
export const createNotification=data=>save('notification',data);
export const updateNotification=(id,data)=>save('notification',{...data,id});
export const deleteNotification=id=>remove('notification',id);
export async function markNotificationRead(id){return save('notification',{id,read:true});}
export async function clearAllNotifications(){for(const item of await getNotifications())await markNotificationRead(item.id);return true;}
export async function getCourseCategories(){return(await list('category')).map(r=>r.title);}
export async function addCourseCategory(title){await save('category',{id:title.trim().toLowerCase(),title:title.trim()});return getCourseCategories();}
export const enrollStudentInCourse=(course,member)=>frappeRestPost('LMS Enrollment',{course,member});
export async function checkStudentEnrollment(course,member){return(await frappeRestGet('LMS Enrollment',{filters:JSON.stringify({course,member})})).length>0;}
export async function getStudentEnrollments(member){return(await frappeRestGet('LMS Enrollment',{filters:JSON.stringify({member}),limit_page_length:1000})).map(r=>r.course);}
