const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const chatHandler = require('./handlers/chat.handler');
const presenceHandler = require('./handlers/presence.handler');
const { initRedisPubSub } = require('./redis.pubsub');

let io;

/**
 * Initialize Socket.IO with JWT authentication middleware.
 * @param {import('http').Server} server
 */
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // --- Auth middleware ---
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = verifyAccessToken(token);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new Error('User not found'));
            }

            // Attach user to socket
            socket.user = {
                id: user._id.toString(),
                username: user.username,
                avatar: user.avatar
            };

            next();
        } catch (err) {
            next(new Error('Invalid or expired token'));
        }
    });

    // --- Connection handler ---
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.user.username} (${socket.id})`);

        // Register handlers
        presenceHandler(io, socket);
        chatHandler(io, socket);

        // Error handler
        socket.on('error', (err) => {
            console.error(`Socket error for ${socket.user.username}:`, err);
        });
    });

    // Initialize Redis Pub/Sub
    initRedisPubSub(io).catch(err => {
        console.error('Failed to initialize Redis Pub/Sub:', err);
    });

    console.log('Socket.IO initialized');
    return io;
};

const getIO = () => io;

module.exports = { initSocket, getIO };
