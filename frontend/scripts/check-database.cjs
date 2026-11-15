const path=require('node:path');
require('dotenv').config({path:path.join(__dirname,'../.env.local')});
require('dotenv').config({path:path.join(__dirname,'../.env')});
const db=require('../shared/database/index.cjs');
(async()=>{
 await db.query('SELECT 1 AS healthy');
 await db.query('SELECT id FROM vedika_assessment_records LIMIT 0');
 if(db.backend()==='neon'){
  await db.query('SELECT id,tenant_id FROM users LIMIT 0');
  await db.query('SELECT id,tenant_id FROM courses LIMIT 0');
  await db.query('SELECT id FROM "LMS Background Job Queue" LIMIT 0');
 }
 console.log(`${db.backend()} database connectivity and required migration tables verified (no user records read).`);
})().catch(e=>{console.error('Database readiness failed:',e.code||e.name);process.exitCode=1;}).finally(db.close);
