# Task Assignment for Ethara

Team task manager with projects, a kanban board, member management, and JWT + Google sign-in (optional).

## What’s Inside

- `client/`: React + Vite UI
- `server/`: Express API + Sequelize (MySQL)
- Root scripts orchestrate install/build/start for deployment

## Local Development

1. Install deps (root + client + server):

```bash
npm install
```

2. Configure the backend env:

Create `server/.env` (see `server/.env.example`):

```bash
DB_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
JWT_SECRET="replace_me_with_a_long_random_secret"
GOOGLE_CLIENT_ID="" # optional
PORT=5001
```

3. Configure the frontend env (optional):

Create `client/.env` (see `client/.env.example`):

```bash
VITE_API_URL="http://localhost:5001/api"
VITE_GOOGLE_CLIENT_ID="" # optional (shows Google button if set)
```

4. Run both apps:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:5001`

## Environment Variables

Backend (`server/`):

- `DB_URL` (recommended) or `MYSQL_URL` (Railway MySQL plugin) : MySQL connection string for Sequelize
- `DB_SOCKET_PATH` (optional): MySQL socket path (local setups)
- `JWT_SECRET`: used to sign JWT tokens
- `GOOGLE_CLIENT_ID` (optional): enables Google sign-in verification on server
- `PORT`: server port (Railway sets this automatically)
- `NODE_ENV`: set to `production` on Railway for single-service hosting

Frontend (`client/`):

- `VITE_API_URL`: defaults to `http://localhost:5001/api`; in single-service production set to `/api`
- `VITE_GOOGLE_CLIENT_ID` (optional): shows Google sign-in button in UI

## Railway Deployment (Recommended: Single Service)

This repo supports deploying as a single Railway service:
- Railway runs the Express server
- The server serves the built React app from `client/dist`

### 1) Create Railway Project

- Create a new project and connect this GitHub repo

### 2) Add a MySQL Database

- Add Railway’s MySQL plugin to the same project
- Railway will provide `MYSQL_URL` automatically

### 3) Set Service Variables (in Railway)

Set these environment variables on the service:

- `JWT_SECRET`: generate a long random value
- `NODE_ENV=production`
- `VITE_API_URL=/api` (so the built UI calls the same service)
- `GOOGLE_CLIENT_ID` (optional) and `VITE_GOOGLE_CLIENT_ID` (optional, same value)

Notes:
- The backend uses `DB_URL` or `MYSQL_URL`. On Railway, `MYSQL_URL` is the easiest.
- If you don’t configure Google sign-in, email/password auth still works.

### 4) Set Build/Start Commands

In Railway service settings:

- Build command: `npm run build`
- Start command: `npm start`

What these do:
- `npm install` runs automatically, then root `postinstall` installs `client/` + `server/` dependencies.
- `npm run build` builds the frontend into `client/dist`.
- `npm start` runs the backend (`server/index.js`) which serves the built UI and mounts `/api/*`.

### 5) Deploy

Once deployed:
- Open the Railway service URL
- UI loads from `/`
- API is available at `/api/*`

## Railway Deployment (Alternative: Two Services)

If you prefer separating frontend and backend:

- Backend service:
  - Root directory: `server`
  - Start command: `npm start`
  - Variables: `MYSQL_URL` (or `DB_URL`), `JWT_SECRET`, `GOOGLE_CLIENT_ID` (optional)
- Frontend service:
  - Root directory: `client`
  - Build command: `npm run build`
  - Variables at build time: `VITE_API_URL=https://<your-backend-service>/api`

## Notes / Caveats

- The server currently uses `sequelize.sync({ alter: true })` on startup when DB is available; that’s convenient for demos, but for production you’ll typically want migrations instead.
