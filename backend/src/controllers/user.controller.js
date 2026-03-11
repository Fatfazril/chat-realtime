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

        // Don't return current user in the general list
        const query = { _id: { $ne: req.user._id } };

        const [users, total] = await Promise.all([
            User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(query)
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
 * GET /api/users/search
 * Search users by username
 */
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.json({ users: [] });
        }

        // Case-insensitive regex search for username, excluding self
        const users = await User.find({
            _id: { $ne: req.user._id },
            username: { $regex: q.trim(), $options: 'i' }
        }).select('username avatar isOnline');

        res.json({ users });
    } catch (err) {
        console.error('Search users error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /api/users/friends
 * Get user's friends and pending requests
 */
const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friends', 'username avatar isOnline')
            .populate('friendRequests.user', 'username avatar');

        res.json({
            friends: user.friends,
            friendRequests: user.friendRequests
        });
    } catch (err) {
        console.error('Get friends error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/users/friends/request
 * Send a friend request
 */
const sendFriendRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        if (targetUserId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot add yourself as a friend' });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = await User.findById(req.user._id);

        // Check if already friends
        if (currentUser.friends.includes(targetUserId)) {
            return res.status(400).json({ error: 'Already friends with this user' });
        }

        // Check if request already sent tracking the target user
        const existingRequest = targetUser.friendRequests.find(
            req => req.user.toString() === currentUser._id.toString() && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        // Add to target user's incoming requests
        targetUser.friendRequests.push({ user: currentUser._id, status: 'pending' });
        await targetUser.save();

        res.json({ message: 'Friend request sent' });
    } catch (err) {
        console.error('Send friend request error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/users/friends/accept
 * Accept a pending friend request
 */
const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId, accept } = req.body; // accept can be true/false

        const user = await User.findById(req.user._id);
        const request = user.friendRequests.id(requestId);

        if (!request || request.status !== 'pending') {
            return res.status(404).json({ error: 'Friend request not found or not pending' });
        }

        if (accept) {
            // Add to each other's friends array
            const senderId = request.user;
            
            user.friends.push(senderId);
            request.status = 'accepted';
            
            const sender = await User.findById(senderId);
            if (sender && !sender.friends.includes(user._id)) {
                sender.friends.push(user._id);
                await sender.save();
            }
        } else {
            request.status = 'rejected';
        }

        await user.save();

        // Remove the rejected/accepted requests from the array optionally instead of keeping history
        user.friendRequests.pull(requestId);
        await user.save();

        res.json({ message: accept ? 'Friend request accepted' : 'Friend request rejected' });
    } catch (err) {
        console.error('Accept friend request error:', err);
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

        const { username, avatar, email, statusMessage, presence } = req.body;
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

        if (email !== undefined) {
            // Check uniqueness if email is provided and not empty
            if (email.trim() !== '') {
                const existingEmail = await User.findOne({ email: email.trim(), _id: { $ne: req.user._id } });
                if (existingEmail) {
                    return res.status(409).json({ error: 'Email already taken' });
                }
            }
            updates.email = email.trim();
        }

        if (avatar !== undefined) {
            updates.avatar = avatar;
        }

        if (statusMessage !== undefined) {
            updates.statusMessage = statusMessage.trim().substring(0, 100);
        }

        if (presence && ['online', 'busy', 'offline'].includes(presence)) {
            updates.presence = presence;
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

module.exports = { 
    listUsers, 
    getOnlineUsers, 
    searchUsers,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getUser, 
    updateUser 
};
