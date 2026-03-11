const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { 
    listUsers, 
    getOnlineUsers, 
    searchUsers,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getUser, 
    updateUser 
} = require('../controllers/user.controller');

// All user routes require authentication
router.use(auth);

// Must be before /:id to avoid conflict
router.get('/online', getOnlineUsers);
router.get('/search', searchUsers);
router.get('/friends', getFriends);
router.post('/friends/request', sendFriendRequest);
router.post('/friends/accept', acceptFriendRequest);


router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;
