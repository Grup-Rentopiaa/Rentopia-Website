require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Auth routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// Tracking routes
const trackingRoutes = require('./routes/tracking')
app.use('/api/tracking', trackingRoutes)

// Homepage routes
const itemRoutes = require('./routes/item')
const keywordRoutes = require('./routes/keyword')
const notificationRoutes = require('./routes/notification')
app.use('/api/items', itemRoutes)
app.use('/api/keywords', keywordRoutes)
app.use('/api/notifications', notificationRoutes)

// SSE for real-time notifications
const sseClients = new Set()

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()
  res.write(`event: connected\ndata: {"status":"ok"}\n\n`)
  sseClients.add(res)
  req.on('close', () => sseClients.delete(res))
})

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  sseClients.forEach(client => {
    try { client.write(payload) } catch (_) { sseClients.delete(client) }
  })
}

app.locals.broadcastSSE = broadcastSSE

setInterval(() => {
  if (sseClients.size > 0) {
    broadcastSSE('heartbeat', { time: new Date().toISOString(), clients: sseClients.size })
  }
}, 30000)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})