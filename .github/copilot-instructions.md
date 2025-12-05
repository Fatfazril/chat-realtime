# copilot-instructions for chat-realtime

This project is a small Node/Express + Socket.IO + (planned) Redis + MongoDB chat server skeleton. It’s a work-in-progress; some directories are empty and the server entry `./src/server.js` referenced by package.json is not present.

Use these notes when authoring code, refactors, or completing features.

---

## Big picture (what an agent should know)
- Architecture: Client ↔ Socket.IO Server ↔ Redis Pub/Sub ↔ DB (MongoDB). REST API exists alongside the Socket.IO server for Auth + CRUD.
- Entry point: package.json points to `./src/server.js`. If it doesn't exist, create a CommonJS server that mounts Express and initializes Socket.IO, connects DB using `src/config/db.js`, and wires sockets.
- Data: Mongoose models live in `src/models/` (see `Message.js` and `User.js`). They use CommonJS exports `module.exports = mongoose.model(..)`.
- Redis is included in `package.json` but not wired yet. Expect Redis for Pub/Sub (socket scaling) if multiple processes are used.

---

## Important files and folders to reference
- `src/config/db.js` — DB connect function (calls `mongoose.connect(process.env.MONGO_URI)`).
- `src/models/Message.js` — Message schema fields: `sender`, `room`, `message`, `timestamp`.
- `src/models/User.js` — User schema fields: `username`, `password`.
- `src/sockets/` — (Empty) Expected Socket.IO events & handlers.
- `src/controllers/`, `src/routes/`, `src/middlewares/`, `src/utils/`, `src/validation/` — skeleton for REST endpoints, auth, validation & middleware. Use these directories as the canonical place for features.
- `package.json` — scripts use `node ./src/server.js` and `nodemon` (`npm run dev`). Use these for dev vs production runs.

---

## How to run / developer workflow
- Install: `npm ci` (or `npm i`).
- Dev run: `npm run dev` (nodemon).
- Production run: `npm start`.
- Env vars observed in code or packages: `MONGO_URI` is required by `src/config/db.js`. The project also depends on `redis`, `jsonwebtoken` and `bcryptjs` so expect env vars such as `REDIS_URL` and `JWT_SECRET` to be required by features that are not yet implemented.
- When adding features that require env vars, add `.env.example` documenting expected values: `MONGO_URI`, `JWT_SECRET`, `PORT`, `REDIS_URL`.

---

## Project-specific conventions and patterns
- Use CommonJS (`require`, `module.exports`). Do not migrate to ESM unless the repo Type is updated (package.json `type` is `commonjs`).
- Keep models in `src/models/`, controllers in `src/controllers/`, express routers in `src/routes/`, and Socket.IO handlers in `src/sockets/`.
- Use `src/config/db.js` for DB initialization (call `connectDB()` on server startup).
- For message storage, use `Message` model fields as in `src/models/Message.js`.
- Authentication is expected to use JWT, use `jsonwebtoken` for token sign/verify and `bcryptjs` for password hashing.

---

## Integration points & expectations for new code
- Socket.IO <-> DB integration: Socket handlers must persist messages into the `Message` model and publish events across instances through Redis (if configured).
- Redis Pub/Sub: Since `redis` dependency exists, follow adapter patterns such as `@socket.io/redis-adapter` to share events if the server runs multiple instances. If using `redis` v5, use the `@redis/client` for pub/sub.
- REST APIs should stay in `src/routes/` and be implemented using Express routers that call `src/controllers/`.
- Middlewares (e.g., JWT auth) should exist in `src/middlewares/` and be required into routes.

---

## Actionable advice for Copilot/AI changes (do this first when editing)
- Validate environment variables: Look at `src/config/db.js` for `MONGO_URI` and ensure code exits cleanly if required envs are missing.
- If you add server initialization (`src/server.js`), follow this pattern:
  - load `dotenv` early
  - require `src/config/db.js` and call connectDB()
  - initialize Express and Socket.IO, then mount `src/routes/` and `src/sockets/` handlers
  - graceful shutdown and logging for DB and socket disconnects
- Keep to CommonJS style and project structure. Use `module.exports` for modules.
- When introducing new endpoints, add unit tests or at least integration test scaffolding under a `test/` folder (not present currently). If adding tests, add `npm test` script.

---

## Local checks and quick review items
- If `src/server.js` is missing, verify `package.json` script; create server entrypoint accordingly.
- Verify `src/config/db.js` uses `process.env.MONGO_URI`. If you add other envs (e.g., `JWT_SECRET`, `REDIS_URL`), add `.env.example` and mention them in README.
- If you wire Redis for socket scaling, explicitly document it and add code for the appropriate adapter.

---

## Where to look for similar implementations
- `src/models/Message.js` and `src/models/User.js` are the best examples of current model conventions.
- Follow folder layout in `src/*` when adding features; place new code in the most natural folder (controllers → routes → middlewares).

---

If anything above is unclear or you want more project-specific details, tell me the exact feature or file you want to modify (e.g., create server, add socket handlers, or implement auth) and I’ll update this guidance or add code scaffolding accordingly.

---

`NOTE`: This repository looks like a skeleton with some missing core files (server, sockets, controllers). Be conservative when adding third-party libraries beyond the ones listed in package.json unless there is a clear benefit and you document the reason.