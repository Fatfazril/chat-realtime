const Room = require('../models/Room');
const { validateRoom } = require('../validation/room.validation');
const { parsePagination } = require('../utils/pagination');

/**
 * GET /api/rooms
 * List all rooms with member count
 */
const listRooms = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        const [rooms, total] = await Promise.all([
            Room.find({ isDirect: false })
                .populate('owner', 'username avatar')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Room.countDocuments({ isDirect: false })
        ]);

        // Add member count
        const roomsWithCount = rooms.map(room => ({
            ...room.toObject(),
            memberCount: room.members.length
        }));

        res.json({
            rooms: roomsWithCount,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (err) {
        console.error('List rooms error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /api/rooms/me
 * List all rooms the current user is a member of (including DMs)
 */
const getUserRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ members: req.user._id })
            .populate('owner', 'username avatar')
            .populate('members', 'username avatar isOnline')
            .sort({ updatedAt: -1 });

        // Add member count and identify if DM
        const roomsWithMeta = rooms.map(room => ({
            ...room.toObject(),
            memberCount: room.members.length
        }));

        res.json({ rooms: roomsWithMeta });
    } catch (err) {
        console.error('Get user rooms error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/rooms
 * Create a room — creator becomes owner + first member
 */
const createRoom = async (req, res) => {
    try {
        const { valid, errors } = validateRoom(req.body);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        const { name, description } = req.body;

        // Check unique name
        const existing = await Room.findOne({ name: name.trim() });
        if (existing) {
            return res.status(409).json({ error: 'Room name already exists' });
        }

        const room = await Room.create({
            name: name.trim(),
            description: description || '',
            owner: req.user._id,
            members: [req.user._id]
        });

        const populated = await room.populate('owner', 'username avatar');

        res.status(201).json({ message: 'Room created', room: populated });
    } catch (err) {
        console.error('Create room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /api/rooms/:id
 * Get room details with populated members
 */
const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('owner', 'username avatar isOnline')
            .populate('members', 'username avatar isOnline');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ room });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Invalid room ID' });
        }
        console.error('Get room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * PUT /api/rooms/:id
 * Update room (owner only)
 */
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Only the room owner can update this room' });
        }

        const { name, description } = req.body;

        if (name) {
            if (name.trim().length < 2 || name.trim().length > 50) {
                return res.status(400).json({ error: 'Room name must be between 2 and 50 characters' });
            }
            const existing = await Room.findOne({ name: name.trim(), _id: { $ne: room._id } });
            if (existing) {
                return res.status(409).json({ error: 'Room name already exists' });
            }
            room.name = name.trim();
        }

        if (description !== undefined) {
            room.description = description;
        }

        await room.save();

        const populated = await room.populate('owner', 'username avatar');
        res.json({ message: 'Room updated', room: populated });
    } catch (err) {
        console.error('Update room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * DELETE /api/rooms/:id
 * Delete room (owner only)
 */
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Only the room owner can delete this room' });
        }

        await Room.findByIdAndDelete(req.params.id);

        res.json({ message: 'Room deleted' });
    } catch (err) {
        console.error('Delete room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/rooms/:id/join
 * Join a room
 */
const joinRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if already a member
        if (room.members.some(m => m.toString() === req.user._id.toString())) {
            return res.status(400).json({ error: 'Already a member of this room' });
        }

        room.members.push(req.user._id);
        await room.save();

        res.json({ message: 'Joined room successfully' });
    } catch (err) {
        console.error('Join room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/rooms/:id/leave
 * Leave a room
 */
const leaveRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Owner cannot leave — must delete or transfer
        if (room.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ error: 'Owner cannot leave the room. Delete the room or transfer ownership.' });
        }

        const memberIndex = room.members.findIndex(m => m.toString() === req.user._id.toString());
        if (memberIndex === -1) {
            return res.status(400).json({ error: 'Not a member of this room' });
        }

        room.members.splice(memberIndex, 1);
        await room.save();

        res.json({ message: 'Left room successfully' });
    } catch (err) {
        console.error('Leave room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * GET /api/rooms/:id/members
 * List room members with online status
 */
const getRoomMembers = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('members', 'username avatar isOnline');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ members: room.members });
    } catch (err) {
        console.error('Get room members error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/rooms/dm
 * Get or create a 1-on-1 direct message room
 */
const getOrCreateDMRoom = async (req, res) => {
    try {
        const { targetUserId } = req.body;

        if (!targetUserId || targetUserId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Valid target user ID is required' });
        }

        // Find existing DM room between these two users
        let room = await Room.findOne({
            isDirect: true,
            members: { $all: [req.user._id, targetUserId], $size: 2 }
        }).populate('members', 'username avatar isOnline');

        if (room) {
            return res.json({ room, isNew: false });
        }

        // Create new DM room
        room = await Room.create({
            isDirect: true,
            owner: req.user._id,
            members: [req.user._id, targetUserId]
        });

        const populated = await room.populate('members', 'username avatar isOnline');

        res.status(201).json({ room: populated, isNew: true });
    } catch (err) {
        console.error('Get/Create DM Room error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    listRooms,
    getUserRooms,
    createRoom,
    getRoom,
    updateRoom,
    deleteRoom,
    joinRoom,
    leaveRoom,
    getRoomMembers,
    getOrCreateDMRoom
};
