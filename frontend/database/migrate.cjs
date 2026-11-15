// Explicit, additive migration. Never runs from an API request or a build.
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), quiet: true });
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
const db = require('../shared/database/index.cjs');
const repo = require('../features/assessments/server/repository.cjs');

async function migrate() {
  if (db.backend() === 'neon') {
    await db.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    await db.query(fs.readFileSync(path.join(__dirname, 'native-support.sql'), 'utf8'));
  } else {
    const statements = fs.readFileSync(path.join(__dirname, 'frappe-support.sql'), 'utf8').split(';').map(s=>s.trim()).filter(Boolean);
    for (const statement of statements) await db.query(statement);
  }
  await db.query(`CREATE TABLE IF NOT EXISTS vedika_assessment_records (
    tenant_id VARCHAR(128) NOT NULL, kind VARCHAR(32) NOT NULL, id VARCHAR(128) NOT NULL,
    owner_id VARCHAR(255) NOT NULL DEFAULT '', parent_id VARCHAR(128) NOT NULL DEFAULT '',
    payload ${db.backend() === 'neon' ? 'TEXT' : 'MEDIUMTEXT'} NOT NULL, updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (tenant_id, kind, id)
  )`);
  if (db.backend() === 'neon') await db.query('CREATE INDEX IF NOT EXISTS idx_assessment_scope ON vedika_assessment_records(tenant_id,kind,owner_id,parent_id)');
  else {
    const rows=await db.query("SELECT index_name FROM information_schema.statistics WHERE table_schema=DATABASE() AND table_name='vedika_assessment_records' AND index_name='idx_assessment_scope'");
    if(!rows.length)await db.query('CREATE INDEX idx_assessment_scope ON vedika_assessment_records(tenant_id,kind,owner_id,parent_id)');
  }
  // Only seed author-created assessments, never fabricated student submissions.
  const tenant = process.env.DEFAULT_TENANT_ID || 'default';
  const saveInitial = async (kind,record) => db.transaction(async run => {
    await repo.insertMissing(run,tenant,kind,record);
  });
  for (const title of ['Physics','Maths','Chemistry','Biology','Python','Web Development']) await saveInitial('category',{id:title.toLowerCase(),title});
  const syllabuses = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/syllabuses.json'),'utf8'));
  for (const [id,syllabus] of Object.entries(syllabuses)) await saveInitial('syllabus',{...syllabus,id});
  if (db.backend() === 'neon') {
    const courses=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/courses.json'),'utf8'));
    for (const course of courses) await db.query('INSERT INTO courses (id,title,category,instructor_name,description,image_url,status,tenant_id) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT (id) DO NOTHING',[course.id,course.title,course.category||'General',course.instructor||'Instructor',course.description||'',course.image||'',course.status||'Published',tenant]);
  }
  // One-time import of existing organization state; never overwrite an initialized database record.
  if (!await repo.get(db.query,'global','platform-state','organizations')) {
    let state;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const {Redis}=require('@upstash/redis');
      const redis=new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN});
      const cached=await redis.get('vedika:multi_tenant_state');
      if(cached)state=typeof cached==='string'?JSON.parse(cached):cached;
    }
    if(!state){const legacy=path.join(__dirname,'../lib/organizations_data.json');state=fs.existsSync(legacy)?JSON.parse(fs.readFileSync(legacy,'utf8')):{organizations:[],admins:[],audit_logs:[]};}
    await repo.insertMissing(db.query,'global','platform-state',{...state,id:'organizations',_revision:0});
  }
  for (const [kind, file] of [['quiz', 'quizzes.json'], ['assignment', 'assignments.json']]) {
    const source = path.join(__dirname, '..', 'data', file);
    const records = fs.existsSync(source) ? JSON.parse(fs.readFileSync(source, 'utf8')) : [];
    for (const input of records) {
      const record = { ...input, id: input.id || input.name };
      if (!record.id) continue;
      await db.transaction(async run => {
        await repo.insertMissing(run, tenant, kind, record);
      });
    }
  }
  console.log('Application migration completed. Existing records were preserved; no student submissions were fabricated.');
}
module.exports={migrate};
if(require.main===module)migrate().catch(error => { console.error('Migration failed:', error.code || error.name); process.exitCode = 1; }).finally(db.close);
