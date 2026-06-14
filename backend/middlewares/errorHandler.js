'use strict'
const { ZodError } = require('zod')
const { AppError } = require('../lib/AppError')

function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const message = err.errors.map(e => e.message).join(', ')
    return res.status(400).json({ error: message, code: 'VALIDATION_ERROR' })
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code })
  }
  console.error('[Error]', err)
  res.status(500).json({ error: 'Internal server error.', code: 'INTERNAL_ERROR' })
}

module.exports = { errorHandler }