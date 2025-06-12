const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/messageController');
const protect = require('../middleware/protect');

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);
router.post('/:messageId', protect, deleteMessage);

module.exports = router;
