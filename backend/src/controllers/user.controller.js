const User = require('../models/User');
const { parsePagination } = require('../utils/pagination');
const { getRedisClient } = require('../config/redis');

/**
 * GET /api/users
 * List users (paginated)
 */
const listUsers = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        const [users, total] = await Promise.all([
            User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments()
        ]);

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('List users error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /api/users/online
 * Get currently online users from Redis
 */
const getOnlineUsers = async (req, res) => {
    try {
        const redis = getRedisClient();
        const onlineUserIds = await redis.sMembers('online_users');

        if (onlineUserIds.length === 0) {
            return res.json({ users: [] });
        }

        const users = await User.find({
            _id: { $in: onlineUserIds }
        }).select('-password');

        res.json({ users });
    } catch (err) {
        console.error('Get online users error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /api/users/:id
 * Get single user profile
 */
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * PUT /api/users/:id
 * Update own profile (username, avatar)
 */
const updateUser = async (req, res) => {
    try {
        // Can only update own profile
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const { username, avatar } = req.body;
        const updates = {};

        if (username) {
            if (username.trim().length < 3 || username.trim().length > 30) {
                return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
            }
            // Check uniqueness
            const existing = await User.findOne({ username: username.trim(), _id: { $ne: req.user._id } });
            if (existing) {
                return res.status(409).json({ error: 'Username already taken' });
            }
            updates.username = username.trim();
        }

        if (avatar !== undefined) {
            updates.avatar = avatar;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select('-password');

        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { listUsers, getOnlineUsers, getUser, updateUser };
