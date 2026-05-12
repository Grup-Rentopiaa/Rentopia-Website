const { findAllNotifications, markNotificationAsRead } = require('../models/notification')

const getNotifications = async (req, res) => {
  const notifications = await findAllNotifications()
  res.status(200).json(notifications)
}

const readNotification = async (req, res) => {
  await markNotificationAsRead(req.params.id)
  res.status(200).json({ message: 'Notifikasi ditandai sudah dibaca' })
}

module.exports = { getNotifications, readNotification }