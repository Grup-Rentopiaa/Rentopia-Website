const express = require('express')
const router = express.Router()
const { getNotifications, markAllRead, getUnreadCount } = require('../controllers/notification')

// GET  /api/notifications/:userId        — get all notifications for user
router.get('/:userId', getNotifications)

// PUT  /api/notifications/:userId/read-all — mark all as read
router.put('/:userId/read-all', markAllRead)

// GET  /api/notifications/:userId/unread-count
router.get('/:userId/unread-count', getUnreadCount)

module.exports = router