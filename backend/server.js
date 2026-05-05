require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

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
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})