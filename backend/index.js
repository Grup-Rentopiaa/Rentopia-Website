'use strict'
const app        = require('./app')
const { prisma } = require('./lib/prisma')

const PORT = parseInt(process.env.PORT || '3000')

async function start() {
  await prisma.$connect()
  console.log('[DB] Connected to PostgreSQL')

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`)
    console.log(`   GET  http://localhost:${PORT}/api/listings?userId=1`)
    console.log(`   POST http://localhost:${PORT}/api/users/1/listings\n`)
  })
}

start().catch(err => {
  console.error('Failed to start:', err)
  process.exit(1)
})