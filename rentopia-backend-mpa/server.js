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

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await pool.query('ALTER TABLE items ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0');
    await pool.query('ALTER TABLE items ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0');
    console.log('Database schema verified (rating columns present)');

    const newImages = {
      'Kamera Sony Alpha A7III': '/images/kamera.jpg',
      'Drone DJI Mavic 3': '/images/drone.jpg',
      'Motor Honda Beat 2022': '/images/motor.jpg',
      'Laptop MacBook Pro M2': '/images/laptop.jpg',
      'Proyektor Epson EB-X41': '/images/proyektor.jpg',
      'Tenda Camping 4 Orang': '/images/tenda.jpg',
      'Set Gitar Akustik Yamaha F310': '/images/gitar.jpg',
      'PlayStation 5 + 2 Controller': '/images/ps5.jpg',
      'Baju Adat Jawa Pria': '/images/baju.jpg',
      'Stroller Bayi Joie': '/images/stroller.jpg',
      'Speaker Bluetooth JBL Xtreme 3': '/images/speaker.jpg',
      'Stand Up Paddleboard 10ft': '/images/paddleboard.jpg'
    };
    for (const [title, url] of Object.entries(newImages)) {
      await pool.query('UPDATE items SET image_url = $1 WHERE title = $2', [url, title]);
    }
  } catch (e) {
    console.error('Migration failed:', e.message);
  }
});
