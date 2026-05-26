const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('[DB] Eroare Pool PostgreSQL:', err.message);
});

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

module.exports = { pool, query };
