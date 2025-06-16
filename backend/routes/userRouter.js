const express = require('express');
const router = express.Router();
const {
    getProfile,
    getRequests,
    getFriends,
    searchUsers,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    getSentRequests,
    uploadProfilePic
} = require('../controllers/userController');

const protect = require('../middleware/protect');

router.get('/profile', protect, getProfile);
router.get('/requests', protect, getRequests);
router.get('/sent-requests', protect, getSentRequests);
router.get('/friends', protect, getFriends);
router.get('/search', protect, searchUsers);
router.post('/request/:id', protect, sendRequest);
router.post('/accept/:id', protect, acceptRequest);
router.post('/decline/:id', protect, declineRequest);
router.post('/remove-friend/:id', protect, removeFriend);
router.post('/upload-profile', protect, uploadProfilePic);

module.exports = router;