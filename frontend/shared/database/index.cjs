const { backend } = require('../../lib/backend.cjs');
let mysqlPool;
let postgresPool;

function configurationError() {
  const error = new Error('Database unavailable. Configure the selected backend and run npm run db:migrate.');
  error.status = 503;
  return error;
}

function getPool() {
  if (backend() === 'neon') {
    if (!process.env.DATABASE_URL) throw configurationError();
    if (!postgresPool) {
      const { Pool } = require('pg');
      // pg verifies the provider's TLS certificate. Never set rejectUnauthorized:false.
      const url = new URL(process.env.DATABASE_URL);
      const local = ['localhost','127.0.0.1','[::1]'].includes(url.hostname);
      url.searchParams.set('sslmode',local?'disable':'verify-full');
      postgresPool = new Pool({ connectionString: url.toString(), max: 5, connectionTimeoutMillis: 15000, idleTimeoutMillis: 30000, statement_timeout: 15000 });
    }
    return postgresPool;
  }
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) throw configurationError();
  if (!mysqlPool) {
    mysqlPool = require('mysql2/promise').createPool({
      host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 4000), user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'false' ? undefined : { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      connectionLimit: 5, connectTimeout: 15000, waitForConnections: true, queueLimit: 100,
    });
  }
  return mysqlPool;
}

function sqlParameters(sql) {
  let n = 0;
  return backend() === 'neon' ? sql.replace(/\?/g, () => `$${++n}`) : sql;
}

async function query(sql, params = [], connection) {
  const result = await (connection || getPool()).query(sqlParameters(sql), params);
  return backend() === 'neon' ? result.rows : result[0];
}

async function transaction(callback) {
  const pool = getPool();
  const connection = backend() === 'neon' ? await pool.connect() : await pool.getConnection();
  const run = (sql, params) => query(sql, params, connection);
  try {
    await connection.query('BEGIN');
    const result = await callback(run);
    await connection.query('COMMIT');
    return result;
  } catch (error) {
    await connection.query('ROLLBACK').catch(() => {});
    throw error;
  } finally { connection.release(); }
}

async function close() {
  if (mysqlPool) await mysqlPool.end();
  if (postgresPool) await postgresPool.end();
  mysqlPool = postgresPool = null;
}

module.exports = { query, transaction, close, backend, configurationError, getPool };
