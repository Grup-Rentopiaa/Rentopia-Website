const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'rentopia',
  user: 'postgres',
  password: '01234567', 
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error koneksi database:', err.message);
  } else {
    console.log('✅ Terhubung ke database PostgreSQL - rentopia');
    release();
  }
});

module.exports = pool;
