const express = require('express')
const router = express.Router()
const { getNotifications, readNotification } = require('../controllers/notification')

router.get('/', getNotifications)
router.patch('/:id/read', readNotification)

module.exports = router