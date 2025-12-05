Chat Realtime + Auth + CRUD + Redis

Stack:
-Node.js + Express
-Socket.IO
-Redis (Pub/Sub)
-JWT auth
-MongoDB

Fitur:
-Realtime chat
-Room
-Online status
-Store messages
-History

arsitektur
Client ↔ Socket.IO Server ↔ Redis Pub/Sub ↔ DB (MongoDB)
                       |
                       └ REST API (Auth + CRUD)
