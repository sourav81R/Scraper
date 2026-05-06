# HackerNews Story Tracker

A MERN stack app that scrapes the top 10 Hacker News stories, stores them in MongoDB, exposes them through an Express API, and lets authenticated users bookmark stories from a React frontend.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Axios + Cheerio
- React + Vite
- React Router + Context API
- JWT authentication

## Project Structure

```text
backend/   Express API, MongoDB models, scraper, auth
frontend/  React client with routing, auth context, bookmarks UI
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
npm run dev
```

2. In a second terminal, install frontend dependencies:

```bash
cd frontend
npm install
npm run dev
```

3. Open the frontend URL shown by Vite, usually `http://localhost:5173`.

## Docker Setup

If you want a one-command local setup instead:

```bash
docker compose up --build
```

This starts:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:5000`

## Sample Environment Variables

Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hn-tracker
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=http://localhost:5173,https://scraper-hn.vercel.app
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Vite mode-based frontend env files included in this repo:

- `frontend/.env.development` points to `http://localhost:5000`
- `frontend/.env.production` points to `https://scraper-ii5g.onrender.com`

That means:

- local `npm run dev` uses your local backend
- production `npm run build` uses your live Render backend

Backend CORS allows both:

- local Vite frontend at `http://localhost:5173`
- live frontend at `https://scraper-hn.vercel.app`

For Render, set:

```env
CORS_ORIGINS=http://localhost:5173,https://scraper-hn.vercel.app
```

For Google sign-in on the backend, add Firebase Admin service account values to Render:

```env
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## API Endpoints

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a user and return a JWT |
| POST | `/api/auth/login` | Log in and return a JWT |
| POST | `/api/scrape` | Trigger a fresh Hacker News scrape |
| GET | `/api/stories` | Get paginated stories sorted by points |
| GET | `/api/stories/:id` | Get one story by MongoDB id |
| POST | `/api/stories/:id/bookmark` | Toggle bookmark for the authenticated user |

## Notes

- The backend runs the scraper automatically on server startup.
- Bookmark state is stored on the user document in MongoDB.
- Real `.env` files are ignored by git; `.env.example` files are included for sharing setup.
