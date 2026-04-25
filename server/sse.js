'use strict';

// ── SSE Client Registry ───────────────────────────────────────────
// Map<username, Set<res>> — satu user bisa punya beberapa tab/koneksi
const clients = new Map();

function addClient(username, res) {
  if (!clients.has(username)) clients.set(username, new Set());
  clients.get(username).add(res);
}

function removeClient(username, res) {
  const set = clients.get(username);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) clients.delete(username);
}

// Kirim event ke satu user tertentu (semua tab-nya)
function sendToUser(username, eventName, data) {
  const set = clients.get(username);
  if (!set || set.size === 0) return;
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try { res.write(payload); } catch { /* koneksi sudah mati */ }
  }
}

// Broadcast ke semua user yang sedang online
function broadcast(eventName, data) {
  for (const username of clients.keys()) {
    sendToUser(username, eventName, data);
  }
}

// Jumlah koneksi aktif (untuk debug)
function activeCount() {
  let n = 0;
  for (const set of clients.values()) n += set.size;
  return n;
}

module.exports = { addClient, removeClient, sendToUser, broadcast, activeCount };