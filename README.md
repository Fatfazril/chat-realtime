# 💬 Chat Realtime

A full-stack realtime chat application built with **Node.js**, **Express**, **Socket.IO**, **Redis**, **MongoDB**, and **React + Vite**.

## ✨ Features

- **Authentication** — Register, login, JWT access + refresh tokens, Redis token blacklist
- **User Management** — Profile CRUD, avatar, paginated user list
- **Chat Rooms** — Create, join, leave, delete rooms with owner permissions
- **Realtime Messaging** — Send/receive messages instantly via Socket.IO + Redis Pub/Sub
- **Message History** — Paginated message history per room
- **Typing Indicators** — See when someone is typing in a room
- **Read Receipts** — Track who has read each message
- **Online Presence** — Live online/offline status via Redis SET
- **Horizontal Scaling** — Redis Pub/Sub enables multi-instance deployment

## 📁 Project Structure

```
chat-realtime/
├── backend/                # Node.js + Express API + Socket.IO
│   ├── src/
│   │   ├── config/         # MongoDB & Redis connections
│   │   ├── controllers/    # Auth, User, Room, Message logic
│   │   ├── middlewares/    # JWT auth middleware
│   │   ├── models/         # Mongoose models (User, Room, Message)
│   │   ├── routes/         # Express route definitions
│   │   ├── sockets/        # Socket.IO handlers + Redis Pub/Sub
│   │   ├── utils/          # JWT helpers, pagination
│   │   ├── validation/     # Request validation
│   │   └── server.js       # Entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/               # React + Vite client
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite |
| **Backend** | Node.js, Express 5 |
| **Realtime** | Socket.IO 4 |
| **Database** | MongoDB (Mongoose 9) |
| **Cache/PubSub** | Redis 5 |
| **Auth** | JWT (jsonwebtoken), bcryptjs |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running on `localhost:27017`
- **Redis** running on `localhost:6379`

### Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

The API will be available at `http://localhost:3400`.

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 📡 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/register` | ✗ | Create user, returns JWT tokens |
| POST | `/login` | ✗ | Login, returns JWT tokens |
| POST | `/logout` | ✗ | Blacklist refresh token |
| POST | `/refresh` | ✗ | Issue new access token |
| GET | `/me` | ✓ | Get current user profile |

### Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List users (paginated) |
| GET | `/online` | Get online users |
| GET | `/:id` | Get user profile |
| PUT | `/:id` | Update own profile |

### Rooms (`/api/rooms`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List rooms (paginated) |
| POST | `/` | Create a room |
| GET | `/:id` | Get room details |
| PUT | `/:id` | Update room (owner only) |
| DELETE | `/:id` | Delete room (owner only) |
| POST | `/:id/join` | Join a room |
| POST | `/:id/leave` | Leave a room |
| GET | `/:id/members` | List room members |
| GET | `/:id/messages` | Get message history (paginated) |

### Messages (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/:id` | Edit own message |
| DELETE | `/:id` | Delete own message |

## 🔌 Socket.IO Events

Connect with JWT token:
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3400', {
  auth: { token: 'your_jwt_access_token' }
});
```

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `room:join` | `{ roomId }` | Join a chat room |
| `room:leave` | `{ roomId }` | Leave a chat room |
| `message:send` | `{ roomId, message }` | Send a message |
| `message:typing` | `{ roomId, isTyping }` | Typing indicator |
| `message:read` | `{ roomId, messageIds }` | Mark messages as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `room:joined` | `{ roomId, name }` | Confirm room joined |
| `room:left` | `{ roomId }` | Confirm room left |
| `message:sent` | message object | ACK message saved |
| `message:receive` | message object | New message in room |
| `user:typing` | `{ room, userId, username, isTyping }` | Typing status |
| `message:read` | `{ room, userId, messageIds }` | Read receipt |
| `user:online` | `{ userId, username }` | User came online |
| `user:offline` | `{ userId, username }` | User went offline |

## 🔐 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/chat-realtime
PORT=3400
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
REDIS_URL=redis://localhost:6379
```

## 📜 License

ISC
