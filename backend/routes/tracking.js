const express = require('express')
const router = express.Router()
const { trackVisitor, getVisitors } = require('../controllers/tracking')

router.post('/track-visitor', trackVisitor)
router.get('/visitor-logs', getVisitors)

module.exports = router