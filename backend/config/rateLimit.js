'use strict'
const rateLimit = require('express-rate-limit')

// Ketat untuk auth — cegah brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Terlalu banyak percobaan, coba lagi nanti' },
})

// Longgar untuk API umum
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  skip: (req) =>
    req.path.includes('/sse') ||
    req.path.includes('/tracking'),
})

module.exports = { authLimiter, apiLimiter }
