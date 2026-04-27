'use strict'
require('dotenv/config')
const express      = require('express')
const helmet       = require('helmet')
const cors         = require('cors')
const rateLimit    = require('express-rate-limit')

const listingRoutes    = require('./routes/listing.routes')
const rentalRoutes     = require('./routes/rental.routes')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }))
app.use(express.json({ limit: '2mb' }))

app.use('/api/listings',              listingRoutes)
app.use('/api/rentals',               rentalRoutes)
app.use('/api/users/:userId/listings', listingRoutes)
app.use('/api/users/:userId/rentals',  rentalRoutes)

app.use(errorHandler)

module.exports = app