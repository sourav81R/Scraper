# Project Plan & Task Breakdown
## HackerNews Story Tracker — MERN Stack (48h)

---

## Timeline Overview

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| 1. Project Setup | Repo, structure, env | 30 min |
| 2. Backend Core | DB, models, scraper | 1.5 h |
| 3. Auth API | Register, login, middleware | 1 h |
| 4. Story API | CRUD, bookmark toggle | 1 h |
| 5. Frontend Core | Vite setup, routing, context | 1 h |
| 6. Frontend Pages | Home, Login, Register, Bookmarks | 2 h |
| 7. Integration | Wire frontend to backend | 1 h |
| 8. Bonus | Pagination, deploy | 1.5 h |
| 9. Docs + cleanup | README, commit history | 30 min |

---

## Phase 1 — Project Setup

- [ ] Create GitHub repo with `main` branch
- [ ] Create `backend/` and `frontend/` folders
- [ ] `cd backend && npm init -y`
- [ ] Install backend deps: `express mongoose axios cheerio dotenv bcryptjs jsonwebtoken cors`
- [ ] Install dev deps: `nodemon`
- [ ] `cd frontend && npm create vite@latest . -- --template react`
- [ ] Install frontend deps: `axios react-router-dom`
- [ ] Create `backend/.env` and `backend/.env.example`
- [ ] Add `.env` and `node_modules` to `.gitignore`
- [ ] First meaningful commit: `chore: project scaffold and dependencies`

---

## Phase 2 — Backend Core

### Database connection (`backend/config/db.js`)
- [ ] Connect Mongoose to `MONGO_URI`
- [ ] Export `connectDB()` function
- [ ] Call in `server.js` before app listen

### Models
- [ ] `models/User.js` — `name`, `email`, `password`, `bookmarks: [{ type: ObjectId, ref: 'Story' }]`
- [ ] `models/Story.js` — `title`, `url`, `points`, `author`, `postedAt`, `hnId` (unique index)

### Scraper (`services/scraper.js`)
- [ ] `axios.get('https://news.ycombinator.com')`
- [ ] Load HTML with `cheerio`
- [ ] Iterate `.athing` rows, extract top 10
- [ ] Map each row to `{ title, url, points, author, postedAt, hnId }`
- [ ] Upsert each story: `Story.findOneAndUpdate({ hnId }, data, { upsert: true, new: true })`
- [ ] Export `runScraper()` function

### server.js
- [ ] `express()` app, cors, json middleware
- [ ] Mount routes
- [ ] `connectDB()` then `runScraper()` on start
- [ ] Listen on `PORT`

Commit: `feat: database models and web scraper`

---

## Phase 3 — Auth API

### `controllers/authController.js`
- [ ] `register`: validate body → check duplicate email → hash password (bcrypt, salt 10) → save user → sign JWT → return `{ token, user }`
- [ ] `login`: find user by email → compare password → sign JWT → return `{ token, user }`

### `middleware/authMiddleware.js`
- [ ] Extract `Authorization: Bearer <token>`
- [ ] `jwt.verify(token, JWT_SECRET)` → attach `req.user`
- [ ] Return 401 on failure

### `routes/authRoutes.js`
- [ ] `POST /api/auth/register` → authController.register
- [ ] `POST /api/auth/login` → authController.login

Commit: `feat: JWT authentication endpoints`

---

## Phase 4 — Story API

### `controllers/storyController.js`
- [ ] `getAllStories`: `Story.find().sort({ points: -1 })` (add pagination for bonus)
- [ ] `getStoryById`: `Story.findById(req.params.id)`
- [ ] `toggleBookmark`: find user → check if story in `bookmarks` → `$pull` or `$addToSet` → save → return `{ bookmarked }`

### `controllers/scrapeController.js`
- [ ] `triggerScrape`: call `runScraper()` → return count of saved stories

### `routes/storyRoutes.js`
- [ ] `GET /api/stories`
- [ ] `GET /api/stories/:id`
- [ ] `POST /api/stories/:id/bookmark` (protected with authMiddleware)

### `routes/scrapeRoutes.js`
- [ ] `POST /api/scrape`

Commit: `feat: story CRUD and bookmark API`

---

## Phase 5 — Frontend Core

### Vite + Router setup (`src/main.jsx`)
- [ ] Wrap app in `<BrowserRouter>` and `<AuthProvider>`

### `src/api/axios.js`
- [ ] `axios.create({ baseURL: import.meta.env.VITE_API_URL })`
- [ ] Request interceptor: read token from localStorage → set `Authorization` header

### `src/context/AuthContext.jsx`
- [ ] State: `user`, `token`
- [ ] `login(token)`: decode JWT payload, store in state + localStorage
- [ ] `logout()`: clear state + localStorage
- [ ] `isAuthenticated`: derived boolean

### `src/components/ProtectedRoute.jsx`
- [ ] If not authenticated, redirect to `/login`

### `src/App.jsx` routes
- [ ] `/` → Home
- [ ] `/login` → Login
- [ ] `/register` → Register
- [ ] `/bookmarks` → Bookmarks (ProtectedRoute)

Commit: `feat: React routing and auth context`

---

## Phase 6 — Frontend Pages

### `src/pages/Home.jsx`
- [ ] On mount: `GET /api/stories`
- [ ] Render list of `<StoryCard>` components
- [ ] Show loading spinner while fetching

### `src/components/StoryCard.jsx`
- [ ] Props: `story`, `onBookmark`
- [ ] Display: title (link), points, author, postedAt
- [ ] Bookmark button: filled/outline based on bookmark state
- [ ] If not authed, clicking bookmark → redirect to login

### `src/pages/Login.jsx`
- [ ] Controlled form: email, password
- [ ] Call `POST /api/auth/login` → `login(token)` → redirect to `/`
- [ ] Display error message on failure

### `src/pages/Register.jsx`
- [ ] Controlled form: name, email, password
- [ ] Call `POST /api/auth/register` → `login(token)` → redirect to `/`

### `src/pages/Bookmarks.jsx`
- [ ] Fetch user's bookmarked stories (filter from stories where id in user bookmarks)
- [ ] Render same `<StoryCard>` list

### `src/components/Navbar.jsx`
- [ ] Show app name, links: Home, Bookmarks (if authed), Login/Register or Logout

Commit: `feat: all frontend pages and components`

---

## Phase 7 — Integration & Testing

- [ ] Test register → login → view stories → bookmark → view bookmarks flow
- [ ] Test scraper runs on boot and via POST /api/scrape
- [ ] Test unauthenticated access to /bookmarks redirects to login
- [ ] Test JWT expiry / invalid token returns 401
- [ ] Fix any CORS issues (ensure `cors()` is before routes)
- [ ] Ensure all `.env` values are in `.env.example` with placeholder values

Commit: `fix: integration corrections and CORS setup`

---

## Phase 8 — Bonus

### Pagination
- [ ] `getAllStories`: `const { page = 1, limit = 10 } = req.query`
- [ ] `.skip((page-1)*limit).limit(limit)`
- [ ] Return `{ stories, total, page, totalPages }` in response
- [ ] Frontend: add "Load more" or page controls

### Deployment
- [ ] Push to GitHub
- [ ] Deploy backend on Render (set env vars in dashboard)
- [ ] Deploy frontend on Vercel (set `VITE_API_URL` to Render URL)
- [ ] Test live URL end-to-end

Commit: `feat: pagination support`  
Commit: `chore: deployment config`

---

## Phase 9 — Docs & Final Cleanup

### README.md (must include)
- [ ] Project description and screenshot/gif
- [ ] Tech stack
- [ ] Local setup instructions (clone → install → env → run)
- [ ] All environment variables documented
- [ ] API endpoint table
- [ ] Live URL (if deployed)
- [ ] Loom video link

### Code cleanup
- [ ] Remove all `console.log` debug statements
- [ ] Remove commented-out code
- [ ] Ensure consistent error handling in all controllers

Commit: `docs: complete README and project documentation`

---

## Commit History Checklist (minimum ~10 commits)

```
chore: project scaffold and dependencies
feat: database models and web scraper
feat: JWT authentication endpoints
feat: story CRUD and bookmark API
feat: React routing and auth context
feat: all frontend pages and components
fix: integration corrections and CORS setup
feat: pagination support
chore: deployment config
docs: complete README and project documentation
```