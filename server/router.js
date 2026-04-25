'use strict';
const { pool } = require('./db');
const auth     = require('./auth');
const sse      = require('./sse');
function parseJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end',  () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(
    raw.split(';')
       .map(s => s.trim().split('='))
       .filter(([k]) => k)
       .map(([k, ...v]) => [k.trim(), decodeURIComponent(v.join('=').trim())])
  );
}
function setCookieHeader(name, value, options = {}) {
  const maxAge  = options.maxAge  ?? 7 * 24 * 3600;   
  const sameSite= options.sameSite ?? 'Lax';
  const httpOnly= options.httpOnly !== false;
  const secure  = options.secure  ? '; Secure' : '';
  const http    = httpOnly ? '; HttpOnly' : '';
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=${sameSite}${http}${secure}`;
}
function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type':  'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}
function jsonWithCookie(res, status, data, cookieStr) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type':  'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Set-Cookie':    cookieStr,
  });
  res.end(body);
}
async function requireAuth(req, res) {
  const cookies = parseCookies(req);
  const token   = cookies['rentopia_token'];
  const user    = await auth.validateSession(token);
  if (!user) {
    json(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return user;
}
async function handleRegister(req, res) {
  const { username, email, password } = await parseJSON(req);
  if (!username || !email || !password)
    return json(res, 400, { error: 'Semua kolom wajib diisi.' });
  if (!/\S+@\S+\.\S+/.test(email))
    return json(res, 400, { error: 'Format email tidak valid.' });
  if (password.length < 6)
    return json(res, 400, { error: 'Password minimal 6 karakter.' });
  try {
    const user    = await auth.registerUser({ username, email, password });
    const session = await auth.createSession(user.id);
    const cookie  = setCookieHeader('rentopia_token', session.token, { maxAge: 7 * 24 * 3600 });
    jsonWithCookie(res, 201, { ok: true, username: user.username }, cookie);
  } catch (err) {
    if (err.code === '23505') { 
      const field = err.detail?.includes('username') ? 'Username' : 'Email';
      return json(res, 409, { error: `${field} sudah digunakan.` });
    }
    console.error(err);
    json(res, 500, { error: 'Server error.' });
  }
}
async function handleLogin(req, res) {
  const { username, password } = await parseJSON(req);
  if (!username || !password)
    return json(res, 400, { error: 'Isi username dan password.' });
  try {
    const user = await auth.loginUser({ username, password });
    if (!user) return json(res, 401, { error: 'Username atau password salah.' });
    const session = await auth.createSession(user.id);
    const cookie  = setCookieHeader('rentopia_token', session.token, { maxAge: 7 * 24 * 3600 });
    jsonWithCookie(res, 200, { ok: true, username: user.username }, cookie);
  } catch (err) {
    console.error(err);
    json(res, 500, { error: 'Server error.' });
  }
}
async function handleLogout(req, res) {
  const cookies = parseCookies(req);
  const token   = cookies['rentopia_token'];
  if (token) await auth.destroySession(token);
  const cleared = setCookieHeader('rentopia_token', '', { maxAge: 0 });
  jsonWithCookie(res, 200, { ok: true }, cleared);
}
async function handleMe(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  json(res, 200, {
    username:    user.username,
    email:       user.email,
    name:        user.name,
    city:        user.city,
    description: user.description,
    avatar_b64:  user.avatar_b64,
    followers:   user.followers,
    following:   user.following,
  });
}
async function handleUpdateProfile(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const { name, city, description, avatar_b64 } = await parseJSON(req);
  const fields  = [];
  const values  = [];
  let   idx     = 1;
  if (name        !== undefined) { fields.push(`name        = $${idx++}`); values.push(name        || null); }
  if (city        !== undefined) { fields.push(`city        = $${idx++}`); values.push(city        || null); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description || null); }
  if (avatar_b64  !== undefined) { fields.push(`avatar_b64  = $${idx++}`); values.push(avatar_b64  || null); }
  if (fields.length === 0) return json(res, 200, { ok: true }); // tidak ada yang berubah
  values.push(user.username);
  await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE username = $${idx}`,
    values
  );
  json(res, 200, { ok: true });
}
// GET /api/events  — SSE stream untuk realtime update
async function handleSSE(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;

  // Header SSE wajib
  res.writeHead(200, {
    'Content-Type':      'text/event-stream',
    'Cache-Control':     'no-cache',
    'Connection':        'keep-alive',
    'X-Accel-Buffering': 'no',           // matikan buffering nginx jika ada
  });

  // Kirim komentar agar koneksi tidak di-timeout browser
  res.write(': connected\n\n');

  // Daftarkan client
  sse.addClient(user.username, res);
  console.log(`[SSE] +1 client: ${user.username} (total aktif: ${sse.activeCount()})`);

  // Heartbeat setiap 25 detik agar koneksi tidak putus
  const heartbeat = setInterval(() => {
    try { res.write(': ping\n\n'); } catch { clearInterval(heartbeat); }
  }, 25_000);

  // Cleanup saat client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    sse.removeClient(user.username, res);
    console.log(`[SSE] -1 client: ${user.username} (total aktif: ${sse.activeCount()})`);
  });
}

async function handleGetListings(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const result = await pool.query(
    'SELECT * FROM listings WHERE user_id = (SELECT id FROM users WHERE username=$1) ORDER BY created_at DESC',
    [user.username]
  );
  json(res, 200, result.rows);
}
async function handleCreateListing(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const { icon, title, price, brand, status } = await parseJSON(req);
  if (!title || !price || !brand)
    return json(res, 400, { error: 'icon, title, price, brand wajib diisi.' });
  const result = await pool.query(
    `INSERT INTO listings (user_id, icon, title, price, brand, status)
     VALUES ((SELECT id FROM users WHERE username=$1), $2, $3, $4, $5, $6)
     RETURNING *`,
    [user.username, icon || '👜', title, price, brand, status || 'available']
  );
  const newListing = result.rows[0];
  // Broadcast ke pemilik — semua tab langsung update
  sse.sendToUser(user.username, 'listing:created', newListing);
  json(res, 201, newListing);
}
async function handleUpdateListing(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const { icon, title, price, brand, status } = await parseJSON(req);
  const result = await pool.query(
    `UPDATE listings SET icon=$1, title=$2, price=$3, brand=$4, status=$5
     WHERE id=$6 AND user_id=(SELECT id FROM users WHERE username=$7)
     RETURNING *`,
    [icon, title, price, brand, status, id, user.username]
  );
  if (!result.rows.length) return json(res, 404, { error: 'Listing tidak ditemukan.' });
  const updatedListing = result.rows[0];
  sse.sendToUser(user.username, 'listing:updated', updatedListing);
  json(res, 200, updatedListing);
}
async function handleDeleteListing(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const result = await pool.query(
    `DELETE FROM listings WHERE id=$1 AND user_id=(SELECT id FROM users WHERE username=$2) RETURNING id`,
    [id, user.username]
  );
  if (!result.rows.length) return json(res, 404, { error: 'Listing tidak ditemukan.' });
  sse.sendToUser(user.username, 'listing:deleted', { id });
  json(res, 200, { ok: true, deleted: id });
}
async function handleGetRentals(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const result = await pool.query(
    'SELECT * FROM rentals WHERE user_id=(SELECT id FROM users WHERE username=$1) ORDER BY created_at DESC',
    [user.username]
  );
  json(res, 200, result.rows);
}
async function handleCreateRental(req, res) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const { icon, title, price, store, status, note } = await parseJSON(req);
  if (!title || !price || !store)
    return json(res, 400, { error: 'title, price, store wajib diisi.' });
  const result = await pool.query(
    `INSERT INTO rentals (user_id, icon, title, price, store, status, note)
     VALUES ((SELECT id FROM users WHERE username=$1), $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user.username, icon || '📦', title, price, store, status || 'ongoing', note || '']
  );
  const newRental = result.rows[0];
  sse.sendToUser(user.username, 'rental:created', newRental);
  json(res, 201, newRental);
}
async function handleUpdateRental(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const { icon, title, price, store, status, note } = await parseJSON(req);
  const result = await pool.query(
    `UPDATE rentals SET icon=$1, title=$2, price=$3, store=$4, status=$5, note=$6
     WHERE id=$7 AND user_id=(SELECT id FROM users WHERE username=$8)
     RETURNING *`,
    [icon, title, price, store, status, note, id, user.username]
  );
  if (!result.rows.length) return json(res, 404, { error: 'Rental tidak ditemukan.' });
  const updatedRental = result.rows[0];
  sse.sendToUser(user.username, 'rental:updated', updatedRental);
  json(res, 200, updatedRental);
}
async function handleDeleteRental(req, res, id) {
  const user = await requireAuth(req, res);
  if (!user) return;
  const result = await pool.query(
    `DELETE FROM rentals WHERE id=$1 AND user_id=(SELECT id FROM users WHERE username=$2) RETURNING id`,
    [id, user.username]
  );
  if (!result.rows.length) return json(res, 404, { error: 'Rental tidak ditemukan.' });
  sse.sendToUser(user.username, 'rental:deleted', { id });
  json(res, 200, { ok: true, deleted: id });
}
async function dispatch(req, res) {
  const method = req.method.toUpperCase();
  const url    = req.url.split('?')[0]; 
  res.setHeader('Access-Control-Allow-Origin',  req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  try {
    if (url === '/api/auth/register' && method === 'POST') return await handleRegister(req, res);
    if (url === '/api/auth/login'    && method === 'POST') return await handleLogin(req, res);
    if (url === '/api/auth/logout'   && method === 'POST') return await handleLogout(req, res);
    if (url === '/api/auth/me'       && method === 'GET')  return await handleMe(req, res);
    if (url === '/api/profile'       && method === 'PUT')  return await handleUpdateProfile(req, res);
    if (url === '/api/events'         && method === 'GET')  return await handleSSE(req, res);
    if (url === '/api/listings'      && method === 'GET')  return await handleGetListings(req, res);
    if (url === '/api/listings'      && method === 'POST') return await handleCreateListing(req, res);
    if (url === '/api/rentals'       && method === 'GET')  return await handleGetRentals(req, res);
    if (url === '/api/rentals'       && method === 'POST') return await handleCreateRental(req, res);
    const listingMatch = url.match(/^\/api\/listings\/(\d+)$/);
    if (listingMatch) {
      const id = parseInt(listingMatch[1]);
      if (method === 'PUT')    return await handleUpdateListing(req, res, id);
      if (method === 'DELETE') return await handleDeleteListing(req, res, id);
    }
    const rentalMatch = url.match(/^\/api\/rentals\/(\d+)$/);
    if (rentalMatch) {
      const id = parseInt(rentalMatch[1]);
      if (method === 'PUT')    return await handleUpdateRental(req, res, id);
      if (method === 'DELETE') return await handleDeleteRental(req, res, id);
    }
    json(res, 404, { error: 'Route not found.' });
  } catch (err) {
    console.error('[Router Error]', err);
    json(res, 500, { error: 'Internal server error.' });
  }
}
module.exports = { dispatch };