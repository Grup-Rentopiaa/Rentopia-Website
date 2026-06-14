const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/auth')
const { getVisitorStats, exportVisitorCSV } = require('../controllers/admin')

router.get('/visitor-stats',  authenticate, getVisitorStats)  
router.get('/visitor-export', authenticate, exportVisitorCSV) 

module.exports = router