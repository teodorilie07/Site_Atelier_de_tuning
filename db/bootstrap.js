const { pool, query } = require('./connection');
const fs = require('fs');
const path = require('path');

/**
 * Verifica daca DB e inițializat. Daca nu, ruleaza init.sql + seed.sql.
 * Idempotent — se poate rula la fiecare pornire.
 */
async function ensureSchema() {
  try {
    // Check if produse table exists
    const check = await query(`SELECT to_regclass('public.produse') AS exists`);
    if (check.rows[0].exists) {
      const countRes = await query('SELECT COUNT(*)::int AS c FROM produse');
      if (countRes.rows[0].c > 0) {
        console.log(`[DB] Schema OK, ${countRes.rows[0].c} produse existente.`);
        return;
      }
    }
    console.log('[DB] Inițializez schema + seed...');
    // Recreate: run init and seed
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    // Filter out CREATE ROLE / DATABASE lines (already done)
    // Execute only DDL after "-- Enum categorie"
    const idx = initSql.indexOf('-- Enum categorie');
    const ddl = idx >= 0 ? initSql.slice(idx) : initSql;
    await pool.query(ddl);

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await pool.query(seedSql);
    console.log('[DB] Schema + seed OK.');
  } catch (err) {
    console.error('[DB] ensureSchema esec:', err.message);
    throw err;
  }
}

module.exports = { ensureSchema };
