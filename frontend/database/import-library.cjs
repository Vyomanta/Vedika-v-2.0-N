// One-way, additive import of the existing resource catalog into the native deployment.
const path=require('node:path');
require('dotenv').config({path:path.join(__dirname,'../.env.local')});
require('dotenv').config({path:path.join(__dirname,'../.env')});
const mysql=require('mysql2/promise');
const db=require('../shared/database/index.cjs');
let source;
(async()=>{
 if(db.backend()!=='neon')throw new Error('Run the catalog import in the Neon deployment only.');
 if(!process.env.DB_HOST||!process.env.DB_USER)throw new Error('Set the source catalog DB_HOST/DB_USER/DB_PASSWORD locally before importing.');
 source=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||4000),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_RESOURCES_NAME||'pdf_resources_db',ssl:process.env.DB_SSL==='false'?undefined:{rejectUnauthorized:true},connectTimeout:5000});
 let categories=0,resources=0;
 for(const [table,columns]of [['pdf_categories',['id','category','subcategory','created_at','updated_at']],['pdf_resources',['id','category_id','name','file_link','thumbnail','created_at','updated_at']]]){
  let offset=0;
  while(true){
   const [rows]=await source.query(`SELECT ${columns.join(',')} FROM ${table} ORDER BY id LIMIT 200 OFFSET ?`,[offset]);
   if(!rows.length)break;
   await db.transaction(async run=>{for(const row of rows)await run(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${columns.map(()=>'?').join(',')}) ON CONFLICT (id) DO NOTHING`,columns.map(key=>row[key]));});
   if(table==='pdf_categories')categories+=rows.length;else resources+=rows.length;
   offset+=rows.length;
  }
 }
 console.log(`Catalog import completed: ${categories} categories and ${resources} resources processed. Existing native rows were preserved.`);
})().catch(error=>{console.error('Catalog import failed:',error.code||error.name);process.exitCode=1;}).finally(async()=>{if(source)await source.end();await db.close();});
