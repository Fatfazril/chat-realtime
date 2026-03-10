const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    listRooms,
    createRoom,
    getRoom,
    updateRoom,
    deleteRoom,
    joinRoom,
    leaveRoom,
    getRoomMembers
} = require('../controllers/room.controller');

// All room routes require authentication
router.use(auth);

router.get('/', listRooms);
router.post('/', createRoom);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.post('/:id/join', joinRoom);
router.post('/:id/leave', leaveRoom);
router.get('/:id/members', getRoomMembers);

module.exports = router;
