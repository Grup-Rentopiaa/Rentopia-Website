'use strict';
const { Pool } = require('pg');
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
});
async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        username    VARCHAR(64)  UNIQUE NOT NULL,
        email       VARCHAR(128) UNIQUE NOT NULL,
        name        VARCHAR(128),
        city        VARCHAR(64),
        description TEXT,
        avatar_b64  TEXT,
        followers   INTEGER NOT NULL DEFAULT 0,
        following   INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        password_hash VARCHAR(128) NOT NULL,
        salt          VARCHAR(64)  NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_user_id ON auth(user_id)
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        token      VARCHAR(128) PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON sessions(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        icon       VARCHAR(8)   NOT NULL DEFAULT '👜',
        title      VARCHAR(255) NOT NULL,
        price      VARCHAR(64)  NOT NULL,
        brand      VARCHAR(64)  NOT NULL,
        status     VARCHAR(16)  NOT NULL DEFAULT 'available'
                     CHECK (status IN ('available', 'rented')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id)`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS rentals (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        icon       VARCHAR(8)   NOT NULL DEFAULT '📦',
        title      VARCHAR(255) NOT NULL,
        price      VARCHAR(64)  NOT NULL,
        store      VARCHAR(128) NOT NULL,
        status     VARCHAR(16)  NOT NULL DEFAULT 'ongoing'
                     CHECK (status IN ('ongoing', 'done', 'urgent')),
        note       VARCHAR(128),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id)`);

    console.log('[DB] Schema ready. Tables: users, auth, sessions, listings, rentals');
  } finally {
    client.release();
  }
}
module.exports = { pool, initSchema };