'use strict'
require('dotenv/config')
const express      = require('express')
const helmet       = require('helmet')
const cors         = require('cors')
const rateLimit    = require('express-rate-limit')

const userRoutes    = require('./routes/user')  
const listingRoutes    = require('./routes/listing')
const rentalRoutes     = require('./routes/rental')
const authRoutes       = require('./routes/auth')
const chatRoutes       = require('./routes/chat')
const penawaranRoutes  = require('./routes/penawaran')
const itemRoutes       = require('./routes/item')
const keywordRoutes    = require('./routes/keyword')
const notificationRoutes = require('./routes/notification')
const trackingRoutes   = require('./routes/tracking')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use(express.json({ limit: '2mb' }))

app.use('/api/users',                  userRoutes)       
app.use('/api/listings',              listingRoutes)
app.use('/api/rentals',               rentalRoutes)
app.use('/api/users/:userId/listings', listingRoutes)
app.use('/api/users/:userId/rentals',  rentalRoutes)
app.use('/api/auth',                  authRoutes)
app.use('/api/chat',                  chatRoutes)
app.use('/api/penawaran',             penawaranRoutes)
app.use('/api/items',                 itemRoutes)
app.use('/api/keywords',              keywordRoutes)
app.use('/api/notifications',         notificationRoutes)
app.use('/api/tracking',              trackingRoutes)

app.use(errorHandler)

module.exports = app