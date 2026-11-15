const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { PGlite } = require('@electric-sql/pglite');
const fs = require('node:fs');
const path = require('node:path');
process.env.LMS_BACKEND='neon';
const repository = require('../features/assessments/server/repository.cjs');
const { createService } = require('../features/assessments/server/service.cjs');
const policy = require('../features/assessments/domain/policy.cjs');
let database, service;
const admin={isAdmin:true,user:{email:'teacher@test.invalid',role:'Administrator',tenant_id:'school-a'}};
const alice={isAdmin:false,user:{email:'alice@test.invalid',role:'Student',tenant_id:'school-a'}};
const bob={isAdmin:false,user:{email:'bob@test.invalid',role:'Student',tenant_id:'school-a'}};
const other={isAdmin:true,user:{email:'other@test.invalid',role:'Administrator',tenant_id:'school-b'}};
const quiz={id:'quiz-one',title:'Test quiz',course:'course-one',max_attempts:2,passing_percentage:50,questions:[{question:'2 + 2?',options:['3','4'],correct:1},{question:'3 + 3?',options:['6','7'],correct:0}]};
const runFor=client=>async(sql,params=[])=>{let i=0;return (await client.query(sql.replace(/\?/g,()=>`$${++i}`),params)).rows;};
before(async()=>{
 database=new PGlite();
 await database.exec('CREATE TABLE vedika_assessment_records (tenant_id TEXT,kind TEXT,id TEXT,owner_id TEXT,parent_id TEXT,payload TEXT,updated_at TIMESTAMP,PRIMARY KEY(tenant_id,kind,id))');
 service=createService({...repository,teachingCourses:async auth=>auth.user.email==='instructor@test.invalid'?['course-one']:[],query:runFor(database),transaction:fn=>database.transaction(tx=>fn(runFor(tx)))});
 await service.saveAssessment(admin,'quiz',quiz);
 await service.saveAssessment(admin,'assignment',{id:'assignment-one',title:'Explain',course:'course-one',question:'Explain addition.',answer:'Server-only sample answer.'});
});
after(async()=>{await database?.close();});

test('students never receive answer keys or sample solutions',async()=>{
 const [publicQuiz]=await service.assessments(alice,'quiz');
 assert.equal(publicQuiz.questions[0].correct,undefined);
 assert.equal((await service.assessments(alice,'assignment'))[0].answer,undefined);
 assert.equal((await service.assessments(admin,'quiz'))[0].questions[0].correct,1);
});
test('grades are calculated from the stored key, ignoring forged scores',async()=>{
 const result=await service.submit(alice,'quiz',{quiz:'quiz-one',answers:[1,1],score:100,percentage:100,passed:true});
 assert.equal(result.score,1);assert.equal(result.percentage,50);assert.equal(result.passed,true);assert.equal(result.member,'alice@test.invalid');
});
test('attempt caps are enforced transactionally',async()=>{
 await service.submit(alice,'quiz',{quiz:'quiz-one',answers:[1,0]});
 await assert.rejects(()=>service.submit(alice,'quiz',{quiz:'quiz-one',answers:[1,0]}),e=>e.status===409);
 assert.equal((await service.submissions(alice,'quiz')).length,2);
});
test('submission retries do not consume an additional attempt',async()=>{
 const request={quiz:'quiz-one',answers:[1,0],request_id:'stable-request-id'};
 const first=await service.submit(bob,'quiz',request);
 const replay=await service.submit(bob,'quiz',request);
 assert.equal(first.id,replay.id);assert.equal((await service.submissions(bob,'quiz')).length,1);
 await assert.rejects(()=>service.submit(bob,'quiz',{...request,answers:[0,0]}),e=>e.status===409);
});
test('student identity and private submissions cannot be forged',async()=>{
 await assert.rejects(()=>service.submit(bob,'quiz',{quiz:'quiz-one',answers:[1,0],member:alice.user.email}),e=>e.status===403);
 await assert.rejects(()=>service.submissions(bob,'quiz',{member:alice.user.email}),e=>e.status===403);
 assert.ok((await service.submissions(bob,'quiz')).every(record=>record.member===bob.user.email));
});
test('tenant boundaries apply to definitions and submissions',async()=>{
 assert.deepEqual(await service.assessments(other,'quiz'),[]);
 assert.deepEqual(await service.submissions(other,'quiz'),[]);
 await assert.rejects(()=>service.submit(other,'quiz',{quiz:'quiz-one',answers:[1,0]}),e=>e.status===404);
});
test('students cannot create assessments or assign their own grades',async()=>{
 await assert.rejects(()=>service.saveAssessment(alice,'quiz',quiz),e=>e.status===403);
 const result=await service.submit(alice,'assignment',{assignment:'assignment-one',answer:'My explanation.',status:'Pass',score:100,evaluator:'fake'});
 assert.equal(result.status,'Not Graded');assert.equal(result.score,null);assert.equal(result.evaluator,'');
 await assert.rejects(()=>service.grade(alice,{id:result.id,status:'Pass',score:100}),e=>e.status===403);
});
test('grading binds evaluator identity and graded work cannot be replaced',async()=>{
 const [submission]=await service.submissions(alice,'assignment');
 const result=await service.grade(admin,{id:submission.id,status:'Pass',score:80,evaluator:'forged'});
 assert.equal(result.evaluator,admin.user.email);
 await assert.rejects(()=>service.submit(alice,'assignment',{assignment:'assignment-one',answer:'Replacement'}),e=>e.status===409);
 await assert.rejects(()=>service.grade(other,{id:submission.id,status:'Fail',score:0}),e=>e.status===404);
});
test('an instructor cannot grade another instructor’s course',async()=>{
 const [submission]=await service.submissions(alice,'assignment');
 const instructor={isAdmin:false,user:{email:'unassigned@test.invalid',role:'Instructor',tenant_id:'school-a'}};
 await assert.rejects(()=>service.grade(instructor,{id:submission.id,status:'Fail',score:0}),e=>e.status===403);
 assert.deepEqual(await service.submissions(instructor,'assignment'),[]);
});
test('deleting an assessment archives it while preserving grade history',async()=>{
 const result=await service.deleteAssessment(admin,'quiz','quiz-one');
 assert.equal(result.archived,true);
 assert.deepEqual(await service.assessments(alice,'quiz'),[]);
 assert.equal((await service.assessments(admin,'quiz',{includeArchived:'1'}))[0].status,'Archived');
 assert.equal((await service.submissions(alice,'quiz')).length,2);
 await assert.rejects(()=>service.submit(bob,'quiz',{quiz:'quiz-one',answers:[1,0]}),e=>e.status===410);
});
test('storage failures propagate instead of returning a successful save',async()=>{
 const broken=createService({...repository,transaction:()=>Promise.reject(new Error('Storage offline'))});
 await assert.rejects(()=>broken.saveAssessment(admin,'quiz',quiz),/Storage offline/);
});
test('invalid keys, options, scores and deadlines are rejected',()=>{
 assert.throws(()=>policy.validateAssessment('quiz',{...quiz,questions:[{question:'x',options:['a','b'],correct:3}]}));
 assert.throws(()=>policy.gradeQuiz(quiz,[99,0]));
 assert.throws(()=>policy.checkDeadline({due_date:'2000-01-01T00:00:00Z'}),e=>e.status===409);
});
test('native support migrations execute on a real embedded PostgreSQL engine',async()=>{
 const isolated=new PGlite();
 try {
  await isolated.exec(fs.readFileSync(path.join(__dirname,'../database/schema.sql'),'utf8'));
  await isolated.exec(fs.readFileSync(path.join(__dirname,'../database/native-support.sql'),'utf8'));
  const result=await isolated.query("SELECT vedika_cosine_similarity('[1,0]'::jsonb,'[1,0]'::jsonb) AS similarity");
  assert.equal(result.rows[0].similarity,1);
  await isolated.exec(fs.readFileSync(path.join(__dirname,'../database/native-support.sql'),'utf8'));
 } finally {await isolated.close();}
});
