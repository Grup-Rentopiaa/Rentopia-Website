const express = require('express')
const router = express.Router()
const { getNotifications, markAllRead, getUnreadCount } = require('../controllers/notification')


router.get('/:userId', getNotifications)


router.put('/:userId/read-all', markAllRead)


router.get('/:userId/unread-count', getUnreadCount)

module.exports = router