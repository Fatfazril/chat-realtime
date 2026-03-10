require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { initSocket } = require('./sockets/index');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roomRoutes = require('./routes/room.routes');
const messageRoutes = require('./routes/message.routes');
const auth = require('./middlewares/auth');
const { getMessages } = require('./controllers/message.controller');

const app = express();
const server = http.createServer(app);

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- API Routes ---------------
app.get('/', (req, res) => {
    res.json({
        message: 'Chat Realtime API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            rooms: '/api/rooms',
            messages: '/api/messages'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Message history (nested under rooms)
app.get('/api/rooms/:roomId/messages', auth, getMessages);

// --------------- Error handler ---------------
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// --------------- Start server ---------------
const PORT = process.env.PORT || 3400;

const start = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect to Redis
        await connectRedis();

        // Initialize Socket.IO
        initSocket(server);

        server.listen(PORT, () => {
            console.log(`Server running on port http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    server.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down...');
    server.close();
    process.exit(0);
});

start();
