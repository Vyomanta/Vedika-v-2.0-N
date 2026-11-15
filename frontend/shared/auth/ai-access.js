import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/serverAuth';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
let redis;
export async function authorizeAi(request, { requireAdmin = false } = {}) {
  const auth=await authenticateRequest(request,{requireAdmin});
  if(auth.response)return auth;
  if(!process.env.UPSTASH_REDIS_REST_URL||!process.env.UPSTASH_REDIS_REST_TOKEN){
    if(process.env.NODE_ENV==='production')return {...auth,response:NextResponse.json({error:'AI quota service is not configured.'},{status:503})};
    return auth;
  }
  try {
    redis ||= new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN});
    const identity=createHash('sha256').update(auth.user.tenant_id+':'+auth.user.user_id).digest('hex');
    // A bounded, shared per-minute window works across serverless instances and both deployments.
    const key=`rate:ai:${identity}:${Math.floor(Date.now()/60000)}`;
    const result=await redis.eval("local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],70) end;return n",[key],[]);
    if(Number(result)>40)return {...auth,response:NextResponse.json({error:'AI request limit reached. Please retry in one minute.'},{status:429,headers:{'Retry-After':'60'}})};
    return auth;
  }catch{return {...auth,response:NextResponse.json({error:'AI quota service unavailable.'},{status:503})};}
}
