const { getRedisClient } = require('../../config/redis');
const User = require('../../models/User');

/**
 * Handle user presence (online/offline) via Redis SET.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const presenceHandler = (io, socket) => {
    const userId = socket.user.id;

    // Mark user online on connect
    const markOnline = async () => {
        try {
            const redis = getRedisClient();
            await redis.sAdd('online_users', userId);
            await User.findByIdAndUpdate(userId, { isOnline: true });

            // Broadcast to all connected clients
            io.emit('user:online', {
                userId,
                username: socket.user.username
            });

            console.log(`User online: ${socket.user.username}`);
        } catch (err) {
            console.error('Mark online error:', err);
        }
    };

    // Mark user offline on disconnect
    const markOffline = async () => {
        try {
            const redis = getRedisClient();
            await redis.sRem('online_users', userId);
            await User.findByIdAndUpdate(userId, { isOnline: false });

            io.emit('user:offline', {
                userId,
                username: socket.user.username
            });

            console.log(`User offline: ${socket.user.username}`);
        } catch (err) {
            console.error('Mark offline error:', err);
        }
    };

    // Run on connect
    markOnline();

    // Register disconnect handler
    socket.on('disconnect', markOffline);
};

module.exports = presenceHandler;
