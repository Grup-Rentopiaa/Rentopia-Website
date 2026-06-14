const express = require('express')
const router = express.Router()
const { getVisitorStats, exportVisitorCSV } = require('../controllers/admin')

// Grafik pengunjung (untuk admin)
router.get('/visitor-stats', getVisitorStats)

// Export CSV (tanpa admin, publik)
router.get('/visitor-export', exportVisitorCSV)

module.exports = router