# 🗺️ Basera — Build Plan

A week-by-week execution plan to build Basera from zero to deployed.

---

## Overview

| Week | Focus | Goal |
|---|---|---|
| 1 | Setup + Design | Project running, UI designed |
| 2 | Frontend | All pages built, responsive |
| 3 | Backend + Database | APIs working, data flowing |
| 4 | Auth + Maps | Login works, map integrated |
| 5 | Polish + Deploy | Live URL, README done |

---

## Week 1 — Project Setup & UI Design

**Goal:** Project runs locally, folder structure in place, design system decided.

### Tasks

- [ ] Run `create-next-app` and install all dependencies
- [ ] Set up MongoDB Atlas free cluster
- [ ] Create `.env.local` with all keys
- [ ] Set up folder structure (app/, components/, models/, lib/)
- [ ] Define the Tailwind theme (colors, fonts)
- [ ] Design the UI on paper or Figma (optional):
  - Onboarding screen
  - Home / city dashboard
  - Category listing page
  - Listing detail page
  - Login / Signup page
- [ ] Build basic UI components: Button, Card, Badge, Input, Spinner
- [ ] Build Navbar and BottomNav components
- [ ] Create constants: categories.js and cities.js

### Deliverable
App runs at `localhost:3000` and shows a placeholder home screen.

---

## Week 2 — Frontend Pages

**Goal:** All pages built with static/dummy data. Fully responsive.

### Tasks

- [ ] **Onboarding page** (`/onboard`)
  - City picker grid
  - Locality input
  - Redirects to city home on complete
  - Saves city to localStorage

- [ ] **City Home page** (`/[city]`)
  - Hero banner with search bar
  - Quick stats (listing count etc.)
  - CategoryGrid (12 categories)
  - New City Checklist widget

- [ ] **Category page** (`/[city]/[category]`)
  - ListingGrid with dummy data (hardcoded)
  - Filter bar (sort, price, verified toggle)
  - Subcategory pills
  - Toggle: Grid view / Map placeholder

- [ ] **Listing detail page** (`/[city]/[category]/[id]`)
  - Image gallery
  - Name, verified badge, category
  - Price, contact info
  - Amenities list
  - Map placeholder div
  - Reviews section placeholder

- [ ] **Login page** (`/login`)
- [ ] **Signup page** (`/signup`)
- [ ] **Saved page** (`/saved`) — shows bookmarked listings

- [ ] Make everything **mobile responsive** (test on 375px width)

### Deliverable
All pages navigable with dummy data. Looks like a real app.

---

## Week 3 — Backend & Database

**Goal:** Real data flows from MongoDB to the frontend.

### Tasks

- [ ] Create all Mongoose models:
  - User, City, Category, Listing, Review, Vendor

- [ ] Create `lib/mongodb.js` connection utility

- [ ] Build API routes:
  - `GET /api/cities`
  - `GET /api/categories`
  - `GET /api/listings` (with city, category, search, page filters)
  - `GET /api/listings/[id]`
  - `POST /api/listings` (create — auth required)
  - `GET /api/reviews?listingId=`
  - `POST /api/reviews`

- [ ] Write seed script (`scripts/seed.js`):
  - 5 cities
  - 12 categories
  - 30 dummy listings (spread across categories)
  - Run: `npm run seed`

- [ ] Replace dummy data in all pages with real API calls using `fetch()`

- [ ] Add loading skeletons while data fetches

- [ ] Add empty state UI when no listings found

### Deliverable
Real data from MongoDB shows on all pages.

---

## Week 4 — Authentication + Maps

**Goal:** Users can sign up/login. Map shows listings with pins.

### Tasks

- [ ] Set up NextAuth:
  - `lib/auth.js` config
  - `app/api/auth/[...nextauth]/route.js`

- [ ] Build signup API route (`POST /api/auth/signup`):
  - Hash password with bcrypt
  - Save user to MongoDB
  - Return success

- [ ] Connect login form to NextAuth `signIn()`

- [ ] Add Google OAuth provider (optional bonus)

- [ ] Protect routes:
  - `/saved` requires login
  - `POST /api/reviews` requires login
  - Admin routes require `role: 'admin'`

- [ ] Add session-aware UI:
  - Show user name in Navbar if logged in
  - Show login button if not

- [ ] Build Save/Bookmark feature:
  - `POST /api/listings/[id]/save`
  - `DELETE /api/listings/[id]/save`
  - Heart button with optimistic UI update

- [ ] Integrate Google Maps:
  - Install `@googlemaps/js-api-loader`
  - Show map on listing detail page (single pin)
  - Show map on category page (all pins)

- [ ] Set up Cloudinary image upload for listings

### Deliverable
Full auth flow works. Maps show on detail and category pages.

---

## Week 5 — Polish, Deploy & Document

**Goal:** Live URL on Vercel. README with screenshots. Resume-ready.

### Tasks

- [ ] **UI Polish:**
  - Fix all spacing/alignment issues
  - Ensure consistent use of colors and fonts
  - Add hover/focus states on interactive elements
  - Test on mobile (375px), tablet (768px), desktop (1280px)

- [ ] **Error Handling:**
  - 404 page (`not-found.jsx`)
  - Error boundary (`error.jsx`)
  - API error messages shown to user

- [ ] **Performance:**
  - Add `next/image` for all images (auto-optimize)
  - Add `loading="lazy"` on below-fold images

- [ ] **SEO:**
  - Add `metadata` export to each page
  - Dynamic title: "Housing in Bengaluru — Basera"

- [ ] **Deploy to Vercel:**
  - Push final code to GitHub
  - Import to Vercel, set env vars
  - Test the live URL thoroughly

- [ ] **Write README:**
  - Add live URL and GitHub link
  - Add screenshots of all main pages
  - Record a 1–2 min demo video (upload to YouTube, link in README)

- [ ] **Clean up code:**
  - Remove all console.log statements
  - Remove commented-out code
  - Make sure there are no hardcoded API keys

### Deliverable
✅ Live URL working  
✅ GitHub repo with clean README  
✅ Demo video  
✅ Resume updated with project

---

## Resume Bullet Points (Use These)

```
Basera — Full-Stack City Relocation Platform
Tech: Next.js 14, MongoDB, NextAuth.js, Google Maps API, Tailwind CSS, Vercel

• Built a full-stack web app helping users discover housing, food, services,
  and essentials when relocating to a new city

• Designed and implemented REST API with 12+ endpoints covering listings,
  auth, reviews, and bookmarks using Next.js API Routes + MongoDB

• Integrated Google Maps API for location-based listing discovery with
  real-time map pins and proximity filtering

• Implemented JWT-based authentication with NextAuth.js supporting both
  email/password and Google OAuth sign-in flows

• Deployed on Vercel with CI/CD via GitHub integration; app serves
  real data from 30+ seeded listings across 5 Indian cities

Live: https://basera-yourusername.vercel.app
GitHub: https://github.com/yourusername/basera
```

---

## Bonus Features (If You Have Time)

These are impressive additions but not required:

| Feature | Difficulty | Impact |
|---|---|---|
| Dark mode | Easy | Medium |
| Admin panel to approve listings | Medium | High |
| Vendor self-registration form | Medium | High |
| SMS notification (Twilio) | Hard | Medium |
| PWA (installable on mobile) | Medium | High |
| Hindi language toggle | Easy | High (unique!) |
| AI-generated relocation checklist | Hard | Very High |
