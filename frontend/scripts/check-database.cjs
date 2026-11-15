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
 if(db.backend()==='frappe'){
  const mysql=require('mysql2/promise');
  const core=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||4000),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.FRAPPE_DB_NAME||`${process.env.DB_NAME||'test'}_frappe_core`,ssl:{rejectUnauthorized:true},connectTimeout:8000});
  try{for(const table of ['tabUser','tabDefaultValue','tabDocType','tabSingles'])await core.query('SELECT 1 FROM `'+table+'` LIMIT 0');}finally{await core.end();}
 }
 console.log(`${db.backend()} database connectivity and required migration tables verified (no user records read).`);
})().catch(e=>{console.error('Database readiness failed:',e.code||e.name);process.exitCode=1;}).finally(db.close);
