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

const userRoutes = require('./routes/user')
app.use('/api/users', userRoutes)

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const trackingRoutes = require('./routes/tracking')
app.use('/api/tracking', trackingRoutes)

const itemRoutes = require('./routes/item')
app.use('/api/items', itemRoutes)
app.use('/api/users/:userId/items', itemRoutes)

const keywordRoutes = require('./routes/keyword')
app.use('/api/keywords', keywordRoutes)

const notificationRoutes = require('./routes/notification')
app.use('/api/notifications', notificationRoutes)

const chatRoutes = require('./routes/chat')
app.use('/api/chat', chatRoutes)

const penawaranRoutes = require('./routes/penawaran')
app.use('/api/penawaran', penawaranRoutes)

const listingRoutes = require('./routes/listing')
app.use('/api/listings', listingRoutes)
app.use('/api/users/:userId/listings', listingRoutes)

const rentalRoutes = require('./routes/rental')
app.use('/api/rentals', rentalRoutes)
app.use('/api/users/:userId/rentals', rentalRoutes)

<<<<<<< HEAD
=======

>>>>>>> e5dd34eb502646a4fe0d045379e3e9af938be267
const rentalFlowRoutes = require('./routes/rentalFlow')
app.use('/api/rental', rentalFlowRoutes)

const adminRoutes = require('./routes/admin')
app.use('/api/admin', adminRoutes)

const socialRoutes = require('./routes/social')
app.use('/api/search', socialRoutes)    
app.use('/api/profile', socialRoutes)   
<<<<<<< HEAD
=======

>>>>>>> e5dd34eb502646a4fe0d045379e3e9af938be267

const { getFollowingFeed } = require('./controllers/item')
app.get('/api/feed/following/:userId', getFollowingFeed)


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
