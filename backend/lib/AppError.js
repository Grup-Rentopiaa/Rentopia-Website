'use strict'

class AppError extends Error {
  constructor(statusCode, message, code) {
    super(message)
    this.name       = 'AppError'
    this.statusCode = statusCode
    this.code       = code
  }

  static notFound(message = 'Not found') {
    return new AppError(404, message, 'NOT_FOUND')
  }

  static badRequest(message) {
    return new AppError(400, message, 'BAD_REQUEST')
  }

  static conflict(message) {
    return new AppError(409, message, 'CONFLICT')
  }
}

module.exports = { AppError }