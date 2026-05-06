# System Architecture
## HackerNews Story Tracker — MERN Stack

---

## 1. High-Level Architecture

```
┌─────────────────────┐        HTTP/JWT         ┌──────────────────────────┐
│   React Frontend    │ ◄──────────────────────► │   Express / Node.js API  │
│  (Vite + Context)   │                          │   (REST · JWT Middleware) │
└─────────────────────┘                          └────────────┬─────────────┘
                                                              │ Mongoose ODM
                                                 ┌────────────▼─────────────┐
                                                 │        MongoDB           │
                                                 │  users · stories         │
                                                 └──────────────────────────┘
                                                              ▲
                                                              │ upsert
                                                 ┌────────────┴─────────────┐
                                                 │    Web Scraper           │
                                                 │  Axios + Cheerio         │
                                                 │  (on-boot + POST trigger)│
                                                 └────────────┬─────────────┘
                                                              │ HTML fetch
                                                 ┌────────────▼─────────────┐
                                                 │  news.ycombinator.com    │
                                                 └──────────────────────────┘
```

---

## 2. Folder Structure

```
root/
├── backend/
│   ├── config/
│   │   └── db.js                  # Mongoose connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── storyController.js
│   │   └── scrapeController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verify
│   ├── models/
│   │   ├── User.js
│   │   └── Story.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── storyRoutes.js
│   │   └── scrapeRoutes.js
│   ├── services/
│   │   └── scraper.js             # Axios + Cheerio logic
│   ├── .env                       # gitignored
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance + interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── StoryCard.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Bookmarks.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 3. Data Models

### User

```js
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (bcrypt hashed),
  bookmarks: [ObjectId]  // refs to Story
}
```

### Story

```js
{
  _id: ObjectId,
  title: String,
  url: String,
  points: Number,
  author: String,
  postedAt: String,
  hnId: String (unique)  // HN item ID for upsert dedup
}
```

---

## 4. API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Create user, return JWT |
| POST | /api/auth/login | No | Validate, return JWT |
| POST | /api/scrape | No | Trigger scraper manually |
| GET | /api/stories | No | All stories, sorted by points desc |
| GET | /api/stories?page&limit | No | Paginated (bonus) |
| GET | /api/stories/:id | No | Single story |
| POST | /api/stories/:id/bookmark | Yes | Toggle bookmark |

---

## 5. Auth Flow

```
Client                        Server                    MongoDB
  │                              │                          │
  ├─POST /register ─────────────►│                          │
  │  { name, email, password }   │──hash password──────────►│
  │                              │◄─user saved──────────────│
  │◄─{ token } ─────────────────│                          │
  │                              │                          │
  ├─POST /login ────────────────►│                          │
  │  { email, password }         │──find user──────────────►│
  │                              │◄─user doc────────────────│
  │                              │──bcrypt.compare──         │
  │◄─{ token } ─────────────────│                          │
  │                              │                          │
  ├─POST /stories/:id/bookmark ─►│                          │
  │  Authorization: Bearer token │──verify JWT──            │
  │                              │──toggle bookmark────────►│
  │◄─{ bookmarked: true } ──────│                          │
```

---

## 6. Scraper Flow

```
Server starts
     │
     ▼
scraper.js runs automatically
     │
     ├─ axios.get('https://news.ycombinator.com')
     │
     ├─ cheerio.load(html)
     │
     ├─ parse top 10 .athing rows
     │   extract: title, url, points, author, postedAt, hnId
     │
     └─ Story.findOneAndUpdate({ hnId }, data, { upsert: true })
```

CSS selectors used:
- `.athing` — story row
- `.titleline > a` — title + url
- `.score` — points
- `.hnuser` — author
- `.age` — posted time

---

## 7. Frontend State Management

React Context API (`AuthContext`) holds:

```js
{
  user: null | { _id, name, email },
  token: null | String,
  login(token): void,
  logout(): void,
  isAuthenticated: Boolean
}
```

Axios instance reads `token` from `localStorage` via a request interceptor and attaches it to every `Authorization` header automatically.

---

## 8. Environment Variables

**Backend `.env`**
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000
```

---

## 9. Deployment (Bonus)

| Service | Purpose |
|---------|---------|
| Render | Backend (Node + Express) |
| MongoDB Atlas | Database (free M0 tier) |
| Vercel | Frontend (React/Vite) |