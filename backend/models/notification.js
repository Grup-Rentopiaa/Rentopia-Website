const prisma = require('../db')

const findAllNotifications = async () => {
  return await prisma.notification.findMany({
    orderBy: { created_at: 'desc' },
    take: 20,
    include: {
      item: { select: { title: true, price_per_day: true } },
    },
  })
}

const markNotificationAsRead = async (id) => {
  return await prisma.notification.update({
    where: { id: parseInt(id) },
    data: { is_read: true },
  })
}

module.exports = { findAllNotifications, markNotificationAsRead }