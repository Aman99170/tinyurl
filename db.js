const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // For some hosts you may need ssl: { rejectUnauthorized: false }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
