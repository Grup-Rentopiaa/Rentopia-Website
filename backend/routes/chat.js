const express = require('express');
const router = express.Router();
const { getUsers, getMessages, sendMessage, pollMessage, sseConnect, getUnreadCount, markMessagesRead } = require('../controllers/chat');

router.get('/users', getUsers);
router.get('/messages/:id', getMessages);
router.post('/messages/:id', sendMessage);
router.get('/poll', pollMessage);
router.get('/sse', sseConnect);
router.get('/unread-count', getUnreadCount);
router.put('/messages/:id/read', markMessagesRead);

module.exports = router;