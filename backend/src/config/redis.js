const { createClient } = require('redis');

let redisClient;
let redisPub;
let redisSub;

const connectRedis = async () => {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({ url });
    redisPub = createClient({ url });
    redisSub = createClient({ url });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisPub.on('error', (err) => console.error('Redis Pub Error:', err));
    redisSub.on('error', (err) => console.error('Redis Sub Error:', err));

    redisClient.on('connect', () => console.log('Redis client connected'));

    await Promise.all([
        redisClient.connect(),
        redisPub.connect(),
        redisSub.connect()
    ]);

    return { redisClient, redisPub, redisSub };
};

const getRedisClient = () => redisClient;
const getRedisPub = () => redisPub;
const getRedisSub = () => redisSub;

module.exports = {
    connectRedis,
    getRedisClient,
    getRedisPub,
    getRedisSub
};
