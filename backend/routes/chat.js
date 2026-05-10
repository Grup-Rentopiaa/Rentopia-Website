const express = require('express');
const router = express.Router();
const { getUsers, getMessages, sendMessage, pollMessage, sseConnect } = require('../controllers/chat');

router.get('/users', getUsers);
router.get('/messages/:id', getMessages);
router.post('/messages/:id', sendMessage);
router.get('/poll', pollMessage);
router.get('/sse', sseConnect);

module.exports = router;
