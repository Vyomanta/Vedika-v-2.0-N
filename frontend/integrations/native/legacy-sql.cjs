// SQL compatibility is isolated here; React and feature services never choose a dialect.
const db = require('../../shared/database/index.cjs');
function translate(sql) {
  let text = sql.replace(/\btest\./g, '').replace(/`([^`]+)`/g, '"$1"');
  text = text.replace(/ANY_VALUE\(([^)]+)\)/gi, 'MIN($1)');
  text = text.replace(/=\s*"(User|password|Administrator)"/g, "= '$1'");
  text = text.replace(/1\s*-\s*VEC_COSINE_DISTANCE\(embedding,\s*\?\)/gi, 'vedika_cosine_similarity(embedding, ?::jsonb)');
  if (/HAVING similarity/i.test(text)) {
    const [before, after] = text.split(/HAVING\s+/i);
    text = `SELECT * FROM (${before}) AS ranked_chunks WHERE ${after}`;
  }
  text = text.replace(/ON DUPLICATE KEY UPDATE([\s\S]*)$/i, (_, updates) => 'ON CONFLICT (id) DO UPDATE SET' + updates.replace(/VALUES\((\w+)\)/gi, 'EXCLUDED.$1'));
  return text;
}
async function query(sql, params, connection) {
  const result = await db.query(translate(sql), params, connection);
  return [Array.isArray(result) ? result : result, []];
}
async function getConnection() {
  // Transaction bridge retains mysql2's API for existing document and history routes.
  const client = await db.getPool().connect();
  return {
    query: (sql, params) => query(sql, params, client),
    beginTransaction: () => client.query('BEGIN'), commit: () => client.query('COMMIT'), rollback: () => client.query('ROLLBACK'), release: () => client.release(),
  };
}
module.exports = { translate, query, getConnection };
