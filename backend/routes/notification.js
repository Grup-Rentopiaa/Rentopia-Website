const express = require('express')
const router = express.Router()
const { authenticate } = require('../middlewares/auth')
const { getNotifications, markAllRead, getUnreadCount } = require('../controllers/notification')

router.get('/:userId',              authenticate, getNotifications)
router.put('/:userId/read-all',     authenticate, markAllRead)
router.get('/:userId/unread-count', authenticate, getUnreadCount)

module.exports = router