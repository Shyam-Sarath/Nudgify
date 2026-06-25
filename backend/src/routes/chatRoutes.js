const express = require('express');
const router = express.Router();
const { getConversations, getMessages, markAsRead } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/conversations', getConversations);
router.get('/:otherUserId', getMessages);
router.put('/:otherUserId/read', markAsRead);

module.exports = router;
