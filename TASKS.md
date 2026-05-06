# Tasks
## HackerNews Story Tracker — MERN Stack

---

## Backend

### Setup
- [ ] `npm init -y` in `backend/`
- [ ] Install: express mongoose axios cheerio dotenv bcryptjs jsonwebtoken cors nodemon
- [ ] Create `server.js` entry point
- [ ] Create `config/db.js` with `connectDB()`
- [ ] Create `.env` from `.env.example`

### Models
- [ ] `models/User.js` — name, email, password, bookmarks[]
- [ ] `models/Story.js` — hnId (unique), title, url, points, author, postedAt

### Scraper
- [ ] `services/scraper.js` — axios fetch → cheerio parse → top 10 → upsert
- [ ] Call `runScraper()` on server start inside `server.js`

### Auth
- [ ] `middleware/authMiddleware.js` — JWT verify, attach req.user
- [ ] `controllers/authController.js` — register (bcrypt hash + JWT) and login
- [ ] `routes/authRoutes.js` — POST /register, POST /login

### Stories
- [ ] `controllers/storyController.js` — getAllStories (paginated), getStoryById, toggleBookmark
- [ ] `controllers/scrapeController.js` — triggerScrape
- [ ] `routes/storyRoutes.js` — GET /, GET /:id, POST /:id/bookmark (protected)
- [ ] `routes/scrapeRoutes.js` — POST /api/scrape

### Verification
- [ ] Test all routes with Postman or Thunder Client
- [ ] Confirm scraper upserts (no duplicates on double-run)
- [ ] Confirm 401 on protected route without token

---

## Frontend

### Setup
- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install: axios react-router-dom
- [ ] Create `frontend/.env` with VITE_API_URL

### Core
- [ ] `src/api/axios.js` — axios instance + JWT interceptor
- [ ] `src/context/AuthContext.jsx` — user, token, login, logout, isAuthenticated
- [ ] `src/components/ProtectedRoute.jsx` — redirect if not authed

### Pages & Components
- [ ] `src/App.jsx` — routes for /, /login, /register, /bookmarks
- [ ] `src/components/Navbar.jsx` — brand, nav links, conditional auth buttons
- [ ] `src/pages/Home.jsx` — fetch stories, render cards
- [ ] `src/components/StoryCard.jsx` — title link, points, author, time, bookmark button
- [ ] `src/pages/Login.jsx` — form, call /api/auth/login, update context
- [ ] `src/pages/Register.jsx` — form, call /api/auth/register, update context
- [ ] `src/pages/Bookmarks.jsx` — protected page, filtered story list

### Verification
- [ ] Register → Login → View stories → Bookmark → View bookmarks → Logout
- [ ] Direct visit to /bookmarks while logged out → redirect to /login
- [ ] Refresh page → auth state persisted from localStorage

---

## Bonus
- [ ] Pagination: skip/limit in getAllStories controller
- [ ] Pagination UI in Home.jsx (page controls)
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Add live URL to README

---

## Final Checklist
- [ ] All `.env` values in `.env.example` with placeholders
- [ ] No secrets committed to Git
- [ ] README.md complete (setup, env vars, endpoints, live URL)
- [ ] 10+ meaningful commits in history
- [ ] No console.log debug statements in production code
- [ ] No commented-out code
- [ ] Loom video recorded (5–10 min walkthrough)