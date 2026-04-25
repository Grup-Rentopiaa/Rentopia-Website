const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'RENTOPIA',
    password: process.env.DB_PASSWORD || 'BISMILLAH',
    port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
    console.log('🐘 Database PostgreSQL Rentopia Berhasil Terhubung!');
});

module.exports = pool;