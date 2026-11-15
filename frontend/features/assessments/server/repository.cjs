const db = require('../../../shared/database/index.cjs');
const TABLE = 'vedika_assessment_records';

function decode(row) { return row ? JSON.parse(row.payload) : null; }

async function list(run, tenant, kind, { owner, parent } = {}) {
  let sql = `SELECT payload FROM ${TABLE} WHERE tenant_id = ? AND kind = ?`;
  const params = [tenant, kind];
  if (owner) { sql += ' AND owner_id = ?'; params.push(owner); }
  if (parent) { sql += ' AND parent_id = ?'; params.push(parent); }
  sql += ' ORDER BY updated_at DESC';
  return (await run(sql, params)).map(decode);
}

async function get(run, tenant, kind, id, lock = false) {
  const rows = await run(`SELECT payload FROM ${TABLE} WHERE tenant_id = ? AND kind = ? AND id = ?${lock ? ' FOR UPDATE' : ''}`, [tenant, kind, id]);
  return decode(rows[0]);
}

async function save(run, tenant, kind, record, { owner = '', parent = '' } = {}) {
  const values = [tenant, kind, record.id, owner.toLowerCase(), parent, JSON.stringify(record), new Date()];
  const base = `INSERT INTO ${TABLE} (tenant_id, kind, id, owner_id, parent_id, payload, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const conflict = db.backend() === 'neon'
    ? ' ON CONFLICT (tenant_id, kind, id) DO UPDATE SET owner_id = EXCLUDED.owner_id, parent_id = EXCLUDED.parent_id, payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at'
    : ' ON DUPLICATE KEY UPDATE owner_id = VALUES(owner_id), parent_id = VALUES(parent_id), payload = VALUES(payload), updated_at = VALUES(updated_at)';
  await run(base + conflict, values);
  return record;
}

async function remove(run, tenant, kind, id) {
  await run(`DELETE FROM ${TABLE} WHERE tenant_id = ? AND kind = ? AND id = ?`, [tenant, kind, id]);
}

async function insertMissing(run,tenant,kind,record) {
  const conflict=db.backend()==='neon'?' ON CONFLICT (tenant_id,kind,id) DO NOTHING':' ON DUPLICATE KEY UPDATE id=VALUES(id)';
  await run(`INSERT INTO ${TABLE} (tenant_id,kind,id,owner_id,parent_id,payload,updated_at) VALUES (?,?,?,?,?,?,?)`+conflict,[tenant,kind,record.id,'','',JSON.stringify(record),new Date()]);
}

async function teachingCourses(auth, run = db.query) {
  const rows = db.backend() === 'neon'
    ? await run('SELECT i.course_id FROM course_instructors i JOIN courses c ON c.id=i.course_id WHERE LOWER(i.instructor)=? AND c.tenant_id=?', [auth.user.email.toLowerCase(),auth.user.tenant_id])
    : await run('SELECT parent AS course_id FROM `tabCourse Instructor` WHERE LOWER(instructor)=?', [auth.user.email.toLowerCase()]);
  return rows.map(row=>String(row.course_id));
}
module.exports = { list, get, save, remove, insertMissing, teachingCourses, query: db.query, transaction: db.transaction };
