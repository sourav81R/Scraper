# Product Requirements Document
## HackerNews Story Tracker — MERN Stack Assignment

**Version:** 1.0  
**Date:** 2026-05-06  
**Owner:** Candidate Submission

---

## 1. Overview

A full-stack MERN web application that scrapes the top 10 stories from Hacker News, stores them in MongoDB, and exposes them via a REST API with JWT-based authentication. Users can register, log in, browse stories, and bookmark favourites.

---

## 2. Goals

- Demonstrate end-to-end MERN stack capability
- Show web scraping, REST API design, auth, and frontend state management
- Produce clean, scalable, reviewer-ready code

---

## 3. Users

**Unauthenticated visitor** — can view stories, cannot bookmark  
**Registered user** — can log in, bookmark/unbookmark stories, view bookmarks page

---

## 4. Functional Requirements

### 4.1 Web Scraper

| ID | Requirement |
|----|-------------|
| SC-1 | Scrape top 10 stories from `https://news.ycombinator.com` on server start |
| SC-2 | Expose `POST /api/scrape` to trigger a manual re-scrape |
| SC-3 | Extract: `title`, `url`, `points`, `author`, `postedAt` |
| SC-4 | Upsert stories in MongoDB (no duplicates on re-scrape) |

### 4.2 Authentication API

| ID | Requirement |
|----|-------------|
| AU-1 | `POST /api/auth/register` — accept `name`, `email`, `password`; hash password with bcrypt; return JWT |
| AU-2 | `POST /api/auth/login` — validate credentials; return JWT |
| AU-3 | JWT signed with `JWT_SECRET` from `.env`; expires in 7 days |
| AU-4 | Auth middleware validates `Authorization: Bearer <token>` header |

### 4.3 Story API

| ID | Requirement |
|----|-------------|
| ST-1 | `GET /api/stories` — return all stories sorted by `points` descending |
| ST-2 | `GET /api/stories?page=1&limit=10` — paginated response (bonus) |
| ST-3 | `GET /api/stories/:id` — return a single story by ID |
| ST-4 | `POST /api/stories/:id/bookmark` — toggle bookmark for authenticated user |
| ST-5 | Bookmark state is persisted per user in MongoDB |

### 4.4 Frontend (React)

| ID | Requirement |
|----|-------------|
| FE-1 | Stories list page showing title, points, author, posted time |
| FE-2 | Register page with form validation |
| FE-3 | Login page with form validation |
| FE-4 | Bookmark toggle button on each story card (visible to all, functional for auth users) |
| FE-5 | Protected `/bookmarks` page — redirects to login if unauthenticated |
| FE-6 | Auth state managed via React Context API |
| FE-7 | JWT stored in `localStorage`; sent with every API request via Axios interceptor |

---

## 5. Non-Functional Requirements

- All secrets in `.env` (never committed)
- Folder structure: `routes/`, `models/`, `controllers/`, `middleware/`
- No hardcoded values; no dead/commented code
- API returns consistent JSON: `{ success, data, message }`
- HTTP status codes used correctly (200, 201, 400, 401, 404, 500)

---

## 6. Out of Scope

- Email verification
- Password reset flow
- Real-time updates (WebSockets)
- Admin panel

---

## 7. Bonus (Optional)

- Pagination on `GET /api/stories`
- Live deployment on Render (backend) + Vercel (frontend)
- Loom walkthrough video (5–10 min)