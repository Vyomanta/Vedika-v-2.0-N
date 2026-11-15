// Deterministic browser regression checks. External services and paid AI calls are mocked.
const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3401';
const output=path.join(__dirname,'../test-results');
const user={email:'student@test.invalid',username:'student@test.invalid',name:'Test Student',role:'Student'};
const token=[{alg:'HS256',typ:'JWT'},{user_id:user.email,email:user.email,role:'Student',tenant_id:'fixture',exp:Date.now()/1000+3600}].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.')+'.fixture';
const course={id:'physics-mechanics-fundamentals',title:'Physics: Mechanics & Energy',category:'Physics',description:'Fixture course',status:'Published',lessonsCount:1,instructor:'Fixture Teacher'};
const quiz={id:'fixture-quiz',title:'Browser quiz fixture',course:course.id,category:'Physics',courseTitle:course.title,max_attempts:3,passing_percentage:50,questions:[{question:'What is two plus two?',options:['3','4']}]};
const assignment={id:'fixture-assignment',title:'Browser assignment fixture',course:course.id,category:'Physics',courseTitle:course.title,type:'Text',question:'Explain addition.',min_char_count:20};

(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
 let diagnosticPage;
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.routeWebSocket(/.*/, socket => socket.close());
  const errors=[];const submissions={quiz:[],assignment:[]};
  await context.addInitScript(({user,token})=>{localStorage.setItem('frappe_user',JSON.stringify(user));localStorage.setItem('token',token);localStorage.setItem('jwt',token);localStorage.setItem('theme','dark');},{user,token});
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!==base){await route.abort();return;}
   if(!url.pathname.startsWith('/api/')){await route.continue();return;}
   let data;
   if(url.pathname==='/api/quizzes')data=[quiz];
   else if(url.pathname==='/api/assignments')data=[assignment];
   else if(url.pathname==='/api/courses')data={success:true,courses:[course]};
   else if(url.pathname.endsWith('/syllabus'))data={ok:true,modules:[{id:'fixture-module',title:'Addition',lessons:[{id:'fixture-lesson',title:'Adding numbers',vid:'rfscVS0vtbw',overview:'Learn addition.'}]}]};
   else if(url.pathname==='/api/quiz-submissions'){
    if(route.request().method()==='POST'){const body=route.request().postDataJSON().submission;const result={id:'fixture-result',quiz:body.quiz,member:user.email,score:1,score_out_of:1,percentage:100,passing_percentage:50,passed:true};submissions.quiz.push(result);data={status:'success',submission:result};}else data=submissions.quiz;
   }else if(url.pathname==='/api/assignment-submissions'){
    if(route.request().method()==='POST'){const body=route.request().postDataJSON().submission;const result={...body,id:'fixture-work',member:user.email,status:'Not Graded'};submissions.assignment.splice(0,submissions.assignment.length,result);data={status:'success',submission:result};}else data=submissions.assignment;
   }else if(url.pathname==='/api/progress')data={completed:{},allProgress:{}};
   else if(url.pathname==='/api/auth/jwt')data={token};
   else if(url.pathname==='/api/tutor/history')data={sessions:[]};
   else if(url.pathname==='/api/categories')data=['Physics'];
   else if(url.pathname.startsWith('/api/state/'))data=[];
   else if(url.pathname.startsWith('/api/resource/'))data={data:[]};
   else if(url.pathname.startsWith('/api/method/'))data={message:[]};
   else data={history:[],memories:[],documents:[],status:'available'};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
  });
  const page=await context.newPage();page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));
  diagnosticPage=page;
  page.on('pageerror',e=>console.error('Browser runtime:',e.message));
  page.on('dialog',dialog=>dialog.accept());
  await page.goto(base+'/quizzes');
  await page.locator('.box1-content').getByText('Physics',{exact:true}).first().click();
  await page.getByText(quiz.title,{exact:true}).waitFor();
  await page.screenshot({path:path.join(output,'quizzes-desktop.png')});
  await page.getByRole('button',{name:'Start',exact:true}).first().click();
  await page.getByText('What is two plus two?',{exact:true}).waitFor();
  await page.getByText('4',{exact:true}).click();
  await page.getByRole('button',{name:/Finish.*Submit/}).click();
  await page.getByText('100%',{exact:true}).waitFor();
  assert.equal(submissions.quiz.length,1);
  await page.goto(base+'/assignments');
  await page.locator('.box2-content').getByText('Physics',{exact:true}).first().click();
  await page.getByText(assignment.title,{exact:true}).waitFor();
  await page.getByRole('button',{name:'Solve',exact:true}).first().click();
  await page.locator('textarea').first().fill('Addition combines quantities into their total, for example two and two make four.');
  await page.getByRole('button',{name:'Submit Assignment',exact:true}).click();
  await page.getByText(/Assignment submitted successfully/).waitFor();
  assert.equal(submissions.assignment.length,1);
  await page.screenshot({path:path.join(output,'assignment-submitted.png')});
  for(const route of ['/general-tutor','/coding-tutor','/code-puzzle','/viva-interview','/courses','/progress','/resources','/vedika-labs/math','/vedika-labs/physics','/vedika-labs/chemistry','/vedika-labs/biology']){
   await page.goto(base+route);await page.waitForTimeout(700);assert.ok((await page.locator('body').innerText()).trim().length>20,`Empty feature: ${route}`);
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/quizzes');await page.locator('.box1-content').getByText('Physics',{exact:true}).first().click();await page.getByText(quiz.title,{exact:true}).waitFor();
  await page.screenshot({path:path.join(output,'quizzes-mobile.png')});
  assert.equal(errors.length,0,'Browser runtime errors:\n'+errors.join('\n'));
  console.log('Browser checks passed: quiz submission, assignment submission, 11 additional feature routes, and mobile rendering. External services were mocked.');
  await context.close();
 }catch(error){if(diagnosticPage){await diagnosticPage.screenshot({path:path.join(output,'failure.png')});console.error((await diagnosticPage.locator('body').innerText()).slice(0,2500));}throw error;}finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
