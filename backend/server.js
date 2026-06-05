require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const http = require('http')
const WebSocket = require('ws')
const { wsClients } = require('./utils/chatUtils')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(helmet())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', /^http:\/\/192\.168\./],
  credentials: true
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use(express.json({ limit: '10mb' }))

// ── Load semua routes ──
const userRoutes        = require('./routes/user')
const authRoutes        = require('./routes/auth')
const trackingRoutes    = require('./routes/tracking')
const itemRoutes        = require('./routes/item')
const keywordRoutes     = require('./routes/keyword')
const notificationRoutes = require('./routes/notification')
const chatRoutes        = require('./routes/chat')
const penawaranRoutes   = require('./routes/penawaran')
const listingRoutes     = require('./routes/listing')
const rentalRoutes      = require('./routes/rental')
const rentalFlowRoutes  = require('./routes/rentalFlow')
const adminRoutes       = require('./routes/admin')
const socialRoutes      = require('./routes/social')

// ── Route asli (internal) ──
app.use('/api/users',              userRoutes)
app.use('/api/auth',               authRoutes)
app.use('/api/tracking',           trackingRoutes)
app.use('/api/items',              itemRoutes)
app.use('/api/users/:userId/items', itemRoutes)
app.use('/api/keywords',           keywordRoutes)
app.use('/api/notifications',      notificationRoutes)
app.use('/api/chat',               chatRoutes)
app.use('/api/penawaran',          penawaranRoutes)
app.use('/api/listings',           listingRoutes)
app.use('/api/users/:userId/listings', listingRoutes)
app.use('/api/rentals',            rentalRoutes)
app.use('/api/users/:userId/rentals', rentalRoutes)
app.use('/api/rental',             rentalFlowRoutes)
app.use('/api/admin',              adminRoutes)
app.use('/api/search',             socialRoutes)
app.use('/api/profile',            socialRoutes)

// ── Virtual Directory / Path Aliasing ──
// URL publik yang menyembunyikan nama file dan struktur folder asli
app.use('/api/catalog',      itemRoutes)         // alias → routes/item.js
app.use('/api/account',      userRoutes)         // alias → routes/user.js
app.use('/api/messages',     chatRoutes)         // alias → routes/chat.js
app.use('/api/activity',     notificationRoutes) // alias → routes/notification.js
app.use('/api/marketplace',  rentalFlowRoutes)   // alias → routes/rentalFlow.js
app.use('/api/store',        listingRoutes)      // alias → routes/listing.js
app.use('/api/identity',     authRoutes)         // alias → routes/auth.js
app.use('/api/analytics',    trackingRoutes)     // alias → routes/tracking.js

const { getFollowingFeed } = require('./controllers/item')
app.get('/api/feed/following/:userId', getFollowingFeed)

// ── WebSocket ──
wss.on('connection', (ws, req) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const token = url.searchParams.get('token')
    if (token) {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      wsClients.set(decoded.userId, ws)
      console.log(`WS: User ${decoded.userId} connected`)
    }
  } catch (err) {
    console.error("WS CONNECTION ERROR:", err)
  }

  ws.on('close', () => {
    for (let [userId, client] of wsClients.entries()) {
      if (client === ws) {
        wsClients.delete(userId)
        break
      }
    }
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})