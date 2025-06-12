const express = require('express');
const router = express.Router();
const { accessChat, fetchChats, createGroupChat, addToGroup, removeFromGroup, deleteGroupChat } = require('../controllers/chatController');
const protect = require('../middleware/protect');

router.post('/', protect, accessChat); 
router.get('/', protect, fetchChats);  
router.post('/group', protect, createGroupChat);
router.post('/group/add', protect, addToGroup);
router.post('/group/remove', protect, removeFromGroup);
router.post('/group/:id', protect, deleteGroupChat);

module.exports = router;