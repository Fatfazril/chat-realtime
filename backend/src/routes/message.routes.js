const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getMessages, editMessage, deleteMessage } = require('../controllers/message.controller');

// All message routes require authentication
router.use(auth);

// Message history is mounted under /api/rooms/:roomId/messages in server.js
// but edit/delete are under /api/messages/:id
router.put('/:id', editMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
