'use strict'
const jwt = require('jsonwebtoken')
const { AppError } = require('../lib/AppError')

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  const queryToken = req.query?.token

  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.split(' ')[1]
    : queryToken

  if (!token) {
    return next(new AppError('Token tidak ditemukan', 401, 'UNAUTHORIZED'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return next(new AppError('Token tidak valid', 401, 'UNAUTHORIZED'))
  }
}

module.exports = { authenticate }