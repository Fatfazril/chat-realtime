const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { validateRegister, validateLogin } = require('../validation/auth.validation');
const { getRedisClient } = require('../config/redis');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { valid, errors } = validateRegister(req.body);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        const { username, password, email } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        // Check if email already exists (if provided)
        if (email) {
            const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
            if (existingEmail) {
                return res.status(409).json({ error: 'Email already registered' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username: username.trim(),
            password: hashedPassword,
            email: email ? email.toLowerCase().trim() : undefined
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            user,
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { valid, errors } = validateLogin(req.body);
        if (!valid) {
            return res.status(400).json({ errors });
        }

        const { username, password } = req.body;

        // Find user (include password for comparison)
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Remove password from response
        const userObj = user.toJSON();

        res.json({
            message: 'Login successful',
            user: userObj,
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/auth/logout
 * Blacklist refresh token in Redis
 */
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Decode to get expiry, then blacklist for remaining TTL
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);

            if (ttl > 0) {
                const redis = getRedisClient();
                await redis.set(`blacklist:${refreshToken}`, '1', { EX: ttl });
            }
        } catch (err) {
            // Token already expired or invalid — no need to blacklist
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * POST /api/auth/refresh
 * Issue new access token from valid refresh token
 */
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Check if blacklisted
        const redis = getRedisClient();
        const blacklisted = await redis.get(`blacklist:${refreshToken}`);
        if (blacklisted) {
            return res.status(401).json({ error: 'Token has been revoked' });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Check user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Issue new access token
        const accessToken = generateAccessToken(user._id);

        res.json({ accessToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token expired. Please login again.' });
        }
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
};

/**
 * GET /api/auth/me
 * Return current authenticated user
 */
const me = async (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { register, login, logout, refresh, me };
