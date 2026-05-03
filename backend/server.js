require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

const trackingRoutes = require('./routes/trackingRoutes')
app.use('/api/tracking', trackingRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})