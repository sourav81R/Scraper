# HN Tracker

HN Tracker is a full-stack MERN application that scrapes the top Hacker News stories, stores them in MongoDB, and presents them through a polished React frontend with authentication, bookmarks, filters, stats, and scrape status monitoring.

The current implementation goes beyond a basic scraper demo:

- It scrapes the top 10 Hacker News stories on startup, on demand, and on a cron schedule.
- It tracks scrape runs separately from stories so the UI can show health and last-sync status.
- It supports local email/password auth plus optional Google sign-in with Firebase.
- It exposes filtered, paginated story APIs and a protected bookmarks workflow.
- It ships with Docker, Vite, Tailwind CSS v4, Framer Motion, and deployment-oriented environment defaults.

## What The App Does

### Backend

- Connects to MongoDB with retry logic.
- Scrapes `https://news.ycombinator.com` with Axios + Cheerio.
- Upserts stories by `hnId` so repeated scrapes refresh the same records.
- Records each scrape in a `ScrapeRun` collection with trigger, duration, status, and error details.
- Exposes REST endpoints for auth, story browsing, stats, bookmarks, health, and scrape status.
- Applies Helmet, CORS, request validation, and rate limiting.

### Frontend

- Shows a dashboard-style landing page with featured stories and aggregate stats.
- Provides a protected story feed with search, domain filtering, sorting, pagination, and manual refresh.
- Lets authenticated users bookmark stories and manage a personal reading queue.
- Supports local auth and optional Google sign-in from the same UI.
- Uses animated transitions, toast notifications, optimistic bookmark updates, and request retry logic for transient GET failures.

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, Axios, Cheerio, Zod, JWT, bcryptjs, node-cron
- Frontend: React 18, Vite, React Router, Tailwind CSS v4, Framer Motion, Axios, Firebase Auth
- DevOps: Docker, Docker Compose

## Repository Layout

```text
backend/
  config/          env parsing, DB connection, Firebase token verification
  controllers/     auth, stories, scrape handlers
  middleware/      auth guard, validation, rate limiting, error handling
  models/          User, Story, ScrapeRun
  routes/          authRoutes, storyRoutes, scrapeRoutes
  scripts/         dev helper that frees the configured port before nodemon starts
  services/        Hacker News scraper
  validators/      Zod request schemas

frontend/
  src/api/         Axios client + API wrappers
  src/components/  reusable UI blocks
  src/context/     auth, stories, theme, toast state
  src/pages/       Home, Stories, Bookmarks, Login, Register, About
  src/providers/   top-level React providers

SYSTEM_ARCHITECTURE.md  high-level architecture notes
PRD.md                  product requirements
PLAN.md                 implementation plan
TASKS.md                delivery checklist
```

## Core Features

- Automated scraping on server startup and every 30 minutes by default
- Manual scrape trigger from both API and frontend
- Story search across title, author, and domain
- Sort modes for points, recent activity, comments, and title
- Domain filter with values generated from stored stories
- Protected bookmark toggle and bookmark listing
- Homepage stats for stories, bookmarks, domains, points, comments, and last scrape
- Health endpoint with database and scrape status
- Optional Google auth without storing Firebase service-account secrets in the backend

## Data Model Summary

### `Story`

Stored fields include:

- `hnId`, `title`, `url`, `domain`
- `points`, `commentsCount`, `author`, `postedAt`, `rank`
- `scrapedAt`, `lastSeenAt`

### `User`

Stored fields include:

- `name`, `email`
- `password` for local accounts
- `authProvider`, `firebaseUid`, `avatarUrl`
- `bookmarks`

### `ScrapeRun`

Stored fields include:

- `trigger` (`startup`, `manual`, `cron`)
- `status` (`running`, `success`, `failed`)
- `itemsProcessed`, `startedAt`, `finishedAt`, `durationMs`
- `message`, `error`

## Local Development

### Prerequisites

- Node.js 20+
- npm
- MongoDB connection string
- Optional: Firebase project for Google sign-in

### 1. Backend setup

Copy the example env file and update it:

```bash
cp backend/.env.example backend/.env
```

Required backend values:

- `MONGO_URI`
- `JWT_SECRET`

Optional but useful backend values:

- `PORT`
- `CORS_ORIGINS`
- `FIREBASE_PROJECT_ID`
- `SCRAPE_CRON`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `AUTH_RATE_LIMIT_MAX`

Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend setup

The repo includes `frontend/.env.example`, `frontend/.env.development`, and `frontend/.env.production`.

If you want a clean local env file, copy the example:

```bash
cp frontend/.env.example frontend/.env
```

Then install and start the frontend:

```bash
cd frontend
npm install
npm run dev
```

### 3. Important local port note

The backend example file defaults to `PORT=5000`, but the checked-in `frontend/.env.development` points `VITE_API_URL` to `http://localhost:5001`.

To avoid mismatches, do one of these:

1. Set `PORT=5001` in `backend/.env`.
2. Or change the frontend development API URL to `http://localhost:5000`.

Once both sides match, open the Vite app at `http://localhost:5173`.

## Docker

Run both apps with Docker Compose:

```bash
docker compose up --build
```

Compose expects the backend container to listen on port `5000`, so keep `PORT=5000` in `backend/.env` when using Docker unless you also update `docker-compose.yml`.

Default ports:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Variables

### Backend

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | No | `development` | Express environment |
| `PORT` | No | `5000` | Backend port |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | JWT signing secret, minimum 12 chars |
| `CORS_ORIGINS` | No | `http://localhost:5173,http://127.0.0.1:5173,https://scraper-hn.vercel.app` | Allowed frontend origins |
| `FIREBASE_PROJECT_ID` | No | - | Enables backend verification of Firebase ID tokens for Google sign-in |
| `SCRAPE_CRON` | No | `*/30 * * * *` | Cron schedule for automatic scraping |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX` | No | `200` | Global request cap per window |
| `AUTH_RATE_LIMIT_MAX` | No | `20` | Auth request cap per window |

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL for the backend API |
| `VITE_FIREBASE_API_KEY` | Only for Google sign-in | Firebase web config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Only for Google sign-in | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | Only for Google sign-in | Firebase web config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Only for Google sign-in | Firebase web config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Only for Google sign-in | Firebase web config |
| `VITE_FIREBASE_APP_ID` | Only for Google sign-in | Firebase web config |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | Enables Firebase Analytics if supported |

## npm Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the backend with the custom port-release helper and nodemon |
| `npm run dev:nodemon` | Starts nodemon directly |
| `npm start` | Starts the backend with Node |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the production bundle |

## API Reference

All success responses use a consistent shape with `success`, `message`, and `data`. Some endpoints also return `meta`.

### Health and scrape endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Returns service health, DB connection state, and latest scrape status |
| `GET` | `/api/scrape/status` | No | Returns the latest `ScrapeRun` document |
| `POST` | `/api/scrape` | No | Runs a manual scrape immediately |

### Auth endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/auth/google/status` | No | Tells the frontend whether Google sign-in is configured |
| `POST` | `/api/auth/register` | No | Creates a local account and returns a JWT |
| `POST` | `/api/auth/login` | No | Logs in a local account and returns a JWT |
| `POST` | `/api/auth/google` | No | Accepts a Firebase ID token and signs the user into the app |
| `GET` | `/api/auth/me` | Yes | Returns the current authenticated user |

### Story endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/stories/home` | No | Returns homepage featured stories and aggregate stats |
| `GET` | `/api/stories/stats/overview` | No | Returns aggregate story and bookmark stats |
| `GET` | `/api/stories/bookmarks` | Yes | Returns the signed-in user's bookmarked stories |
| `GET` | `/api/stories` | No | Returns paginated stories with filters and metadata |
| `GET` | `/api/stories/:id` | No | Returns one story by MongoDB id |
| `POST` | `/api/stories/:id/bookmark` | Yes | Adds or removes a bookmark for the current user |

### `GET /api/stories` query parameters

| Parameter | Default | Notes |
| --- | --- | --- |
| `page` | `1` | Positive integer |
| `limit` | `10` | Max `20` |
| `search` | `""` | Searches `title`, `author`, and `domain` |
| `domain` | `""` | Exact domain filter |
| `sortBy` | `points` | One of `points`, `recent`, `comments`, `title` |
| `order` | `desc` | `asc` or `desc` |

## Operational Notes

- The scraper only stores the top 10 stories from the Hacker News front page on each run.
- Stories are upserted by `hnId`, so repeated scrapes refresh existing items instead of duplicating them.
- Rate limiting is skipped in `development` mode.
- The frontend retries failed GET requests once for timeouts and `502`/`503`/`504` responses.
- Google sign-in requires Firebase web config in the frontend and `FIREBASE_PROJECT_ID` in the backend.
- The backend verifies Firebase tokens using Google's public certificates and does not currently require Firebase Admin private-key env vars.

## Related Project Docs

- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)
- [PRD.md](./PRD.md)
- [PLAN.md](./PLAN.md)
- [TASKS.md](./TASKS.md)

## Current Gaps

- There are no automated tests checked into this repository yet.
- Production URLs are referenced in the client defaults and env files, so update them if you deploy your own instance.
