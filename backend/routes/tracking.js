const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/auth')
const { trackVisitor, getVisitors } = require('../controllers/tracking')

router.post('/track-visitor', trackVisitor)      
router.get('/visitor-logs',   authenticate, getVisitors) 
module.exports = router