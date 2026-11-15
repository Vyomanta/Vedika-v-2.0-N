// Run only against a local production server started with this test-only secret.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3401';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Local test server required.');
const aud=require('../deployment.json').backend;
function token(audience=aud){const message=[{alg:'HS256',typ:'JWT'},{email:'student@test.invalid',user_id:'student@test.invalid',role:'Student',tenant_id:'fixture',aud:audience,exp:Date.now()/1000+60}].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.');return message+'.'+crypto.createHmac('sha256','browser-test-only-strong-secret-should-never-be-deployed').update(message).digest('base64url');}
async function check(path,status,options={}){console.log('Checking',path);const response=await fetch(base+path,{...options,signal:AbortSignal.timeout(30000)});assert.equal(response.status,status,path);return response;}
(async()=>{
 for(const path of ['/api/quizzes','/api/assignments','/api/quiz-submissions','/api/assignment-submissions','/api/voice/token','/api/auth/jwt'])await check(path,401);
 const headers={Authorization:'Bearer '+token(),'Content-Type':'application/json'};
 for(const path of ['/api/quizzes','/api/assignments'])await check(path,403,{method:'POST',headers,body:'{}'});
 await check('/api/assignment-submissions',403,{method:'PUT',headers,body:'{}'});
 await check('/api/progress?email=other@test.invalid',403,{headers});
 await check('/api/progress',403,{method:'POST',headers,body:JSON.stringify({email:'other@test.invalid',completed:{}})});
 await check('/api/state/notification',403,{method:'POST',headers,body:JSON.stringify({title:'Forged broadcast'})});
 await check('/api/resource/LMS%20Question',403,{headers});
 await check('/api/resource/User',403,{headers});
 await check('/api/quizzes',401,{headers:{Authorization:'Bearer '+token(aud==='neon'?'frappe':'neon')}});
 await check('/api/quizzes',403,{method:'POST',headers:{...headers,Origin:'https://foreign.invalid'},body:'{}'});
 const response=await check('/api/voice/token',200,{headers});
 assert.match(response.headers.get('cache-control'),/no-store/);
 const metadata=await response.text();assert.doesNotMatch(metadata,/AIza|apiKey|access_token/);
 console.log('HTTP checks passed: unauthenticated access, student writes/grading, generic gateway bypass, cross-release tokens, cross-origin mutation, and voice metadata.');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
