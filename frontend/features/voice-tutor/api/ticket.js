import { getJwtToken } from '@/lib/jwtCache';
export async function getVoiceTicket(sessionId,courseId='general') {
  const token=await getJwtToken();
  const response=await fetch(`/api/auth/ws-token?${new URLSearchParams({sessionId,courseId})}`,{credentials:'same-origin',cache:'no-store',headers:{Authorization:`Bearer ${token}`}});
  const data=await response.json();
  if(!response.ok||!data.ticket)throw new Error(data.error||'Voice authentication failed.');
  return data.ticket;
}
