const { prisma } = require('../lib/prisma')

/**
 * Create a notification for a user.
 * @param {number} userId   - recipient
 * @param {string} type     - one of: like|return_reminder|rental_request|guarantee_submitted|item_received|item_returned|new_message|review_submitted
 * @param {string} message  - human-readable description
 * @param {number|null} relatedId - optional related entity id (item, agreement, etc.)
 * @param {number|null} itemId    - optional item id for backward compat
 */
async function createNotification(userId, type, message, relatedId = null, itemId = null) {
  try {
    return await prisma.notification.create({
      data: {
        user_id: userId,
        type,
        message,
        related_id: relatedId,
        item_id: itemId,
        is_read: false,
      },
    })
  } catch (err) {
    
    console.error('[notificationUtils] Failed to create notification:', err.message)
    return null
  }
}

module.exports = { createNotification }
