import { backend } from '@/lib/backend.cjs';
import { NextResponse } from 'next/server';
import { authorizeAi } from '@/shared/auth/ai-access';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';
export async function GET(request) {
 const auth=await authorizeAi(request);if(auth.response)return auth.response;
 const {searchParams}=new URL(request.url);
 const sessionId=searchParams.get('sessionId'),courseId=searchParams.get('courseId')||'general';
 if(!sessionId||sessionId.length>200||courseId.length>200)return NextResponse.json({error:'Invalid voice session.'},{status:400});
 try {
  const redis=new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN});
  const ticket=crypto.randomBytes(24).toString('hex');
  await redis.set(`ws_ticket:${ticket}`,{user_id:auth.user.user_id,tenant_id:auth.user.tenant_id,backend:backend(),session_id:sessionId,course_id:courseId},{ex:60});
  return NextResponse.json({ticket},{headers:{'Cache-Control':'private, no-store'}});
 }catch{return NextResponse.json({error:'Voice authentication service unavailable.'},{status:503});}
}
