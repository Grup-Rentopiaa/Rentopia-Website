'use strict';
const crypto = require('crypto');
const { pool } = require('./db');
function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha256').toString('hex');
}

function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}
function generateToken() {
  return crypto.randomBytes(48).toString('hex'); 
}
async function createSession(userId) {
  const token     = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 
  await pool.query(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
    [token, userId, expiresAt]
  );
  return { token, expiresAt };
}
async function validateSession(token) {
  if (!token) return null;
  const result = await pool.query(
    `SELECT s.user_id, u.username, u.email, u.name, u.city, u.description,
            u.avatar_b64, u.followers, u.following
     FROM   sessions s
     JOIN   users    u ON u.id = s.user_id
     WHERE  s.token = $1 AND s.expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
}
async function destroySession(token) {
  await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
}
async function cleanExpiredSessions() {
  await pool.query('DELETE FROM sessions WHERE expires_at <= NOW()');
}
async function registerUser({ username, email, password }) {
  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO users (username, email)
       VALUES ($1, $2)
       RETURNING id, username, email`,
      [username, email]
    );
    const user = userResult.rows[0];
    await client.query(
      `INSERT INTO auth (user_id, password_hash, salt)
       VALUES ($1, $2, $3)`,
      [user.id, hash, salt]
    );
    await client.query('COMMIT');
    return user;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
async function loginUser({ username, password }) {
  const result = await pool.query(
    `SELECT u.id, u.username, u.email, a.password_hash, a.salt
     FROM   users u
     JOIN   auth  a ON a.user_id = u.id
     WHERE  u.username = $1`,
    [username]
  );
  const user = result.rows[0];
  if (!user) return null;
  const valid = verifyPassword(password, user.salt, user.password_hash);
  if (!valid) return null;
  return { id: user.id, username: user.username, email: user.email };
}
module.exports = {
  registerUser,
  loginUser,
  createSession,
  validateSession,
  destroySession,
  cleanExpiredSessions,
};