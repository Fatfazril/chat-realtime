const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { register, login, logout, refresh, me } = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', auth, me);

module.exports = router;
