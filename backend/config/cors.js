'use strict'
const cors = require('cors')

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    /^http:\/\/20\.5\./,
  ],
  credentials: true,
}

module.exports = cors(corsOptions)
