require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const WebSocket = require('ws')
const { wsClients } = require('./utils/chatUtils')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

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
                wsClients.delete(userId);
                break;
            }
        }
    })
})

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const trackingRoutes = require('./routes/tracking')
app.use('/api/tracking', trackingRoutes)

const itemRoutes = require('./routes/item')
app.use('/api/items', itemRoutes)

const keywordRoutes = require('./routes/keyword')
app.use('/api/keywords', keywordRoutes)

const notificationRoutes = require('./routes/notification')
app.use('/api/notifications', notificationRoutes)

const chatRoutes = require('./routes/chat')
app.use('/api/chat', chatRoutes)

const penawaranRoutes = require('./routes/penawaran')
app.use('/api/penawaran', penawaranRoutes)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})