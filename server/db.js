const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase usually requires this for external connections
  },
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL (Supabase)'))
  .catch((err) => console.error('❌ DB connection error:', err));

module.exports = pool;
