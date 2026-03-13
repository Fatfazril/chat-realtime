const { getRedisPub, getRedisSub } = require('../config/redis');

let pub;
let sub;

/**
 * Initialize Redis Pub/Sub for cross-instance socket messaging.
 * @param {import('socket.io').Server} io
 */
const initRedisPubSub = async (io) => {
    pub = getRedisPub();
    sub = getRedisSub();

    // Subscribe to chat channel
    await sub.subscribe('chat:message', (rawMessage) => {
        try {
            const data = JSON.parse(rawMessage);
            // Broadcast to the room on this server instance
            io.to(data.room).emit('message:receive', data);
        } catch (err) {
            console.error('Redis sub parse error:', err);
        }
    });

    await sub.subscribe('chat:typing', (rawMessage) => {
        try {
            const data = JSON.parse(rawMessage);
            io.to(data.room).emit('user:typing', data);
        } catch (err) {
            console.error('Redis sub parse error:', err);
        }
    });

    await sub.subscribe('chat:read', (rawMessage) => {
        try {
            const data = JSON.parse(rawMessage);
            io.to(data.room).emit('message:read', data);
        } catch (err) {
            console.error('Redis sub parse error:', err);
        }
    });

    await sub.subscribe('chat:message_update', (rawMessage) => {
        try {
            const data = JSON.parse(rawMessage);
            io.to(data.room).emit('message:update', data);
        } catch (err) {
            console.error('Redis sub parse error:', err);
        }
    });

    await sub.subscribe('chat:message_delete', (rawMessage) => {
        try {
            const data = JSON.parse(rawMessage);
            io.to(data.room).emit('message:delete', data);
        } catch (err) {
            console.error('Redis sub parse error:', err);
        }
    });

    console.log('Redis Pub/Sub initialized');
};

/**
 * Publish a message to Redis (will be broadcast to all server instances).
 */
const publishMessage = async (channel, data) => {
    await pub.publish(channel, JSON.stringify(data));
};

module.exports = { initRedisPubSub, publishMessage };
