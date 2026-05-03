require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const pool    = require('./db');

const itemsRoutes         = require('./routes/items');
const keywordsRoutes      = require('./routes/keywords');
const notificationsRoutes = require('./routes/notifications');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.use('/api/items',         itemsRoutes);
app.use('/api/keywords',      keywordsRoutes);
app.use('/api/notifications', notificationsRoutes);

const sseClients = new Set();

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  res.write(`event: connected\ndata: {"status":"ok"}\n\n`);
  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try { client.write(payload); } catch (_) { sseClients.delete(client); }
  });
}

app.locals.broadcastSSE = broadcastSSE;

app.get('/api', (req, res) => res.json({ message: 'Rentopia MPA API aktif', sse_clients: sseClients.size }));

setInterval(() => {
  if (sseClients.size > 0) {
    broadcastSSE('heartbeat', { time: new Date().toISOString(), clients: sseClients.size });
  }
}, 30000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
