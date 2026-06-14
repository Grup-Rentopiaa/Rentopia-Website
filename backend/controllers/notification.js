const { prisma } = require('../lib/prisma')

const getNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    if (!userId) return res.status(400).json({ message: 'userId required' })

    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    })
    res.json(notifications)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const markAllRead = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    if (!userId) return res.status(400).json({ message: 'userId required' })

    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    })
    res.json({ message: 'Semua notifikasi ditandai sudah dibaca' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getUnreadCount = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const count = await prisma.notification.count({
      where: { user_id: userId, is_read: false },
    })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getNotifications, markAllRead, getUnreadCount }