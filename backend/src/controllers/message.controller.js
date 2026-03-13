const Message = require('../models/Message');
const Room = require('../models/Room');
const { parsePagination } = require('../utils/pagination');
const { publishMessage } = require('../sockets/redis.pubsub');

/**
 * GET /api/rooms/:roomId/messages
 * Fetch paginated message history for a room (newest first)
 */
const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;

        // Verify room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Verify user is a member
        if (!room.members.some(m => m.toString() === req.user._id.toString())) {
            return res.status(403).json({ error: 'You must be a member of this room to view messages' });
        }

        const { page, limit, skip } = parsePagination(req.query);

        const [messages, total] = await Promise.all([
            Message.find({ room: roomId })
                .populate('sender', 'username avatar')
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit),
            Message.countDocuments({ room: roomId })
        ]);

        res.json({
            messages: messages.reverse(), // Return in chronological order
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid room ID' });
        }
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * PUT /api/messages/:id
 * Edit own message
 */
const editMessage = async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (!msg) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (msg.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only edit your own messages' });
        }

        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        msg.message = message.trim();
        msg.edited = true;
        await msg.save();

        const populated = await msg.populate('sender', 'username avatar');
        
        await publishMessage('chat:message_update', {
            room: msg.room,
            _id: msg._id,
            message: msg.message,
            edited: true
        });

        res.json({ message: 'Message updated', data: populated });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid message ID' });
        }
        console.error('Edit message error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * DELETE /api/messages/:id
 * Delete own message
 */
const deleteMessage = async (req, res) => {
    try {
        const msg = await Message.findById(req.params.id);
        if (!msg) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (msg.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only delete your own messages' });
        }

        await Message.findByIdAndDelete(req.params.id);

        await publishMessage('chat:message_delete', {
            room: msg.room,
            _id: msg._id
        });

        res.json({ message: 'Message deleted' });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid message ID' });
        }
        console.error('Delete message error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getMessages, editMessage, deleteMessage };
