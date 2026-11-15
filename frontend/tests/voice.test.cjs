const { test }=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const fs=require('node:fs'),path=require('node:path');
const {verify,createWsAuthenticator}=require('../features/voice-tutor/server/auth.cjs');
const secret='dummy-local-test-secret-which-is-not-a-real-key';
function token(payload,header={alg:'HS256',typ:'JWT'}) {const body=[header,payload].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.');return body+'.'+crypto.createHmac('sha256',secret).update(body).digest('base64url');}
test('voice rejects expired, unsigned, missing-expiry, and wrong-algorithm credentials',()=>{
 assert.equal(verify(token({user_id:'alice',exp:Date.now()/1000+100}),secret).user_id,'alice');
 assert.equal(verify(token({user_id:'alice'}),secret),null);
 assert.equal(verify(token({user_id:'alice',exp:1}),secret),null);
 assert.equal(verify(token({user_id:'alice',exp:Date.now()/1000+100},{alg:'none',typ:'JWT'}),secret),null);
 assert.equal(verify('invalid',secret),null);
});
test('voice tickets are consumed atomically and cannot be replayed',async()=>{
 const tickets=new Map([['ws_ticket:once',{user_id:'alice',session_id:'session-one'}]]);
 const authenticate=createWsAuthenticator({getdel:async key=>{const value=tickets.get(key);tickets.delete(key);return value;}});
 const params=new URLSearchParams({ticket:'once',userId:'attacker'});
 const results=await Promise.all([authenticate(params),authenticate(params)]);
 assert.equal(results.filter(r=>r.valid).length,1);assert.equal(results.find(r=>r.valid).user,'alice');
});
test('a ticket-store outage rejects the connection without crashing the voice process',async()=>{
 const authenticate=createWsAuthenticator({getdel:async()=>{throw new Error('Redis offline');}});
 assert.deepEqual(await authenticate(new URLSearchParams({ticket:'fixture'})),{valid:false});
});
test('required PCM, playback, interruption and navigation invariants remain present',()=>{
 const root=path.join(__dirname,'..');
 const view=fs.readFileSync(path.join(root,'features/voice-tutor/components/VoiceAgentView.jsx'),'utf8');
 const modelFiles=fs.readdirSync(path.join(root,'features/voice-tutor/hooks'),{withFileTypes:true}).filter(e=>e.isFile()).map(e=>fs.readFileSync(path.join(root,'features/voice-tutor/hooks',e.name),'utf8')).join('\n');
 const source=view+'\n'+modelFiles;
 for(const pattern of [/sampleRate: 16000/,/createScriptProcessor\(4096, 1, 1\)/,/createBuffer\(1, int16Samples.length, 24000\)/,/nextPlayTimeRef/,/stopAllAudioPlaybacks/,/message.type === 'audio'/,/message.type === 'interrupted'/,/agent-transcription/,/user-transcription/,/Back to Chat/,/localhost:5001/])assert.match(source,pattern);
 assert.doesNotMatch(source,/connectDirectGeminiLive|apiKey:\s*key|SpeechRecognition|speechSynthesis/);
 const route=fs.readFileSync(path.join(root,'app/api/voice/token/route.js'),'utf8');
 assert.doesNotMatch(route,/getRotatedKey|\bkey\s*[,}]/);
});
