const Message = require('../../models/Message');
const Room = require('../../models/Room');
const { publishMessage } = require('../redis.pubsub');

/**
 * Handle chat events: room join/leave, message send, typing, read receipts.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const chatHandler = (io, socket) => {
    const userId = socket.user.id;

    /**
     * room:join — Join a Socket.IO room
     * Payload: { roomId: string }
     */
    socket.on('room:join', async (data) => {
        try {
            const { roomId } = data;
            if (!roomId) return;

            const room = await Room.findById(roomId);
            if (!room) {
                return socket.emit('error', { message: 'Room not found' });
            }

            // Check membership
            if (!room.members.some(m => m.toString() === userId)) {
                return socket.emit('error', { message: 'You are not a member of this room' });
            }

            socket.join(roomId);
            socket.emit('room:joined', { roomId, name: room.name });

            // Notify room
            socket.to(roomId).emit('room:user_joined', {
                roomId,
                userId,
                username: socket.user.username
            });

            console.log(`${socket.user.username} joined room: ${room.name}`);
        } catch (err) {
            console.error('room:join error:', err);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    /**
     * room:leave — Leave a Socket.IO room
     * Payload: { roomId: string }
     */
    socket.on('room:leave', (data) => {
        const { roomId } = data;
        if (!roomId) return;

        socket.leave(roomId);
        socket.emit('room:left', { roomId });

        socket.to(roomId).emit('room:user_left', {
            roomId,
            userId,
            username: socket.user.username
        });

        console.log(`${socket.user.username} left room: ${roomId}`);
    });

    /**
     * message:send — Send a message to a room
     * Payload: { roomId: string, message: string }
     */
    socket.on('message:send', async (data) => {
        try {
            const { roomId, message } = data;
            if (!roomId || !message || message.trim().length === 0) {
                return socket.emit('error', { message: 'Room ID and message are required' });
            }

            // Verify membership
            const room = await Room.findById(roomId);
            if (!room || !room.members.some(m => m.toString() === userId)) {
                return socket.emit('error', { message: 'Not a member of this room' });
            }

            // Save to DB
            const newMessage = await Message.create({
                sender: userId,
                room: roomId,
                message: message.trim(),
                readBy: [userId] // Sender has read it
            });

            const populated = await newMessage.populate('sender', 'username avatar');

            const messageData = {
                _id: populated._id,
                sender: populated.sender,
                room: roomId,
                message: populated.message,
                readBy: populated.readBy,
                edited: populated.edited,
                timestamp: populated.timestamp
            };

            // Publish to Redis for cross-instance broadcast
            await publishMessage('chat:message', messageData);

            // ACK to sender
            socket.emit('message:sent', messageData);
        } catch (err) {
            console.error('message:send error:', err);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    /**
     * message:typing — Broadcast typing indicator to room
     * Payload: { roomId: string, isTyping: boolean }
     */
    socket.on('message:typing', async (data) => {
        try {
            const { roomId, isTyping } = data;
            if (!roomId) return;

            const typingData = {
                room: roomId,
                userId,
                username: socket.user.username,
                isTyping: !!isTyping
            };

            // Publish via Redis for cross-instance
            await publishMessage('chat:typing', typingData);
        } catch (err) {
            console.error('message:typing error:', err);
        }
    });

    /**
     * message:read — Mark messages as read
     * Payload: { roomId: string, messageIds: string[] }
     */
    socket.on('message:read', async (data) => {
        try {
            const { roomId, messageIds } = data;
            if (!roomId || !messageIds || !Array.isArray(messageIds)) return;

            // Update readBy for each message
            await Message.updateMany(
                {
                    _id: { $in: messageIds },
                    room: roomId,
                    readBy: { $ne: userId }
                },
                { $addToSet: { readBy: userId } }
            );

            const readData = {
                room: roomId,
                userId,
                username: socket.user.username,
                messageIds
            };

            // Publish via Redis
            await publishMessage('chat:read', readData);
        } catch (err) {
            console.error('message:read error:', err);
        }
    });
};

module.exports = chatHandler;
