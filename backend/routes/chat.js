const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth')
const { getUsers, getMessages, sendMessage, pollMessage, sseConnect, getUnreadCount, markMessagesRead } = require('../controllers/chat');

router.get('/users',              authenticate, getUsers);
router.get('/messages/:id',       authenticate, getMessages);
router.post('/messages/:id',      authenticate, sendMessage);
router.get('/poll',               authenticate, pollMessage);
router.get('/sse',                authenticate, sseConnect);
router.get('/unread-count',       authenticate, getUnreadCount);
router.put('/messages/:id/read',  authenticate, markMessagesRead);

module.exports = router;