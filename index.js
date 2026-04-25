'use strict';
const fs = require('fs');
if (fs.existsSync('.env')) {
  fs.readFileSync('.env', 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...val] = trimmed.split('=');
    process.env[key.trim()] = val.join('=').trim();
  });
}
const http   = require('http');
const path   = require('path');
const { initSchema } = require('./server/db');
const { dispatch }   = require('./server/router');
const { cleanExpiredSessions } = require('./server/auth');
const PORT    = process.env.PORT || 3000;
const PUBLIC  = path.join(__dirname, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};
function serveStatic(req, res) {
  let filePath = path.join(PUBLIC, req.url === '/' ? '/login.html' : req.url);
  // Sanitize path traversal
  if (!filePath.startsWith(PUBLIC)) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  });
}
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (url.startsWith('/api/')) {
    await dispatch(req, res);
  } else {
    serveStatic(req, res);
  }
});
setInterval(() => cleanExpiredSessions().catch(console.error), 60 * 60 * 1000);
async function start() {
  await initSchema();
  server.listen(PORT, () => {
    console.log(`\n🚀 Rentopia server running at http://localhost:${PORT}`);
    console.log(`   Open: http://localhost:${PORT}/login.html\n`);
  });
}
start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});