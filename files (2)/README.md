# 🏡 Basera — नए शहर का साथी

> **Your complete city relocation companion.**  
> One platform for housing, food, services, tiffin, gym, grocery & everything a person needs when moving to a new city.

---

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📌 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About

**Basera** solves a real-world problem: when a person moves to a new city, they spend weeks figuring out housing, food, local services, and daily essentials — across 10+ different apps and websites.

Basera combines everything into **one platform**:

- Find a PG, flat, or hostel
- Discover the best local restaurants, dhabas, and tiffin services
- Book home services — maid, cook, electrician, plumber, laundry
- Locate the nearest sabji mandi, dairy, and supermarket
- Explore gyms, parks, clubs, and places to visit

**Built as a full-stack portfolio project** demonstrating: REST API design, MongoDB modeling, authentication, Google Maps integration, and production deployment.

---

## ✨ Features

### User Features
- 🏙️ **City Onboarding** — Select your city and locality on first visit
- 🗂️ **12 Categories** — Housing, Food, Grocery, Sabji Mandi, Dairy, Services, Tiffin, Maid/Cook, Gym, Visit, Social, Transport
- 🔍 **Search & Filter** — Filter by category, price range, rating, verified status
- 🗺️ **Map View** — Google Maps integration showing nearby listings
- ❤️ **Save Listings** — Bookmark favourites for quick access
- ⭐ **Ratings & Reviews** — Leave and read reviews for any listing
- 📋 **New City Checklist** — Guided setup checklist for newcomers
- 👤 **Authentication** — Signup, Login, Google OAuth via NextAuth.js

### Vendor Features
- 📝 **Vendor Registration** — Service providers can submit their listing
- ✅ **Verified Badge** — Admin-approved vendors get a trust badge
- 📊 **Listing Dashboard** — Vendors can edit/manage their listings

### Admin Features
- 🛠️ **Admin Panel** — Approve/reject vendor listings
- 📈 **City Management** — Add or disable cities

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR + API routes in one framework |
| **Styling** | Tailwind CSS | Fast, responsive design |
| **Backend** | Next.js API Routes | No separate server needed |
| **Database** | MongoDB Atlas + Mongoose | Flexible schema for listings |
| **Auth** | NextAuth.js | Handles sessions, Google OAuth |
| **Maps** | Google Maps JavaScript API | Location-based discovery |
| **Image Storage** | Cloudinary | Free image CDN |
| **Deployment** | Vercel | One-click deploy, free tier |
| **Version Control** | GitHub | Code hosting + README |

---

## 📁 Project Structure

```
basera/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.jsx
│   │   └── signup/
│   │       └── page.jsx
│   ├── (main)/
│   │   ├── layout.jsx            # Main layout with navbar
│   │   ├── page.jsx              # Home page
│   │   ├── onboard/
│   │   │   └── page.jsx          # City selection onboarding
│   │   ├── [city]/
│   │   │   ├── page.jsx          # City dashboard
│   │   │   └── [category]/
│   │   │       ├── page.jsx      # Category listing page
│   │   │       └── [id]/
│   │   │           └── page.jsx  # Single listing detail
│   │   ├── saved/
│   │   │   └── page.jsx          # User saved listings
│   │   └── profile/
│   │       └── page.jsx          # User profile
│   ├── admin/
│   │   ├── layout.jsx
│   │   ├── page.jsx              # Admin dashboard
│   │   └── listings/
│   │       └── page.jsx          # Manage vendor listings
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.js      # NextAuth handler
│       ├── cities/
│       │   └── route.js
│       ├── categories/
│       │   └── route.js
│       ├── listings/
│       │   ├── route.js          # GET all, POST new
│       │   └── [id]/
│       │       ├── route.js      # GET one, PUT, DELETE
│       │       └── save/
│       │           └── route.js  # Save/unsave listing
│       ├── reviews/
│       │   └── route.js
│       └── vendors/
│           └── route.js
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── StarRating.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── BottomNav.jsx
│   │   └── Footer.jsx
│   ├── listings/
│   │   ├── ListingCard.jsx
│   │   ├── ListingGrid.jsx
│   │   ├── ListingFilters.jsx
│   │   └── ListingMap.jsx
│   ├── categories/
│   │   └── CategoryGrid.jsx
│   └── home/
│       ├── HeroBanner.jsx
│       ├── CityChecklist.jsx
│       └── QuickStats.jsx
│
├── lib/
│   ├── mongodb.js                # MongoDB connection utility
│   ├── auth.js                   # NextAuth config
│   ├── cloudinary.js             # Image upload utility
│   └── utils.js                  # Helper functions
│
├── models/
│   ├── User.js                   # Mongoose User model
│   ├── City.js                   # Mongoose City model
│   ├── Category.js               # Mongoose Category model
│   ├── Listing.js                # Mongoose Listing model
│   ├── Review.js                 # Mongoose Review model
│   └── Vendor.js                 # Mongoose Vendor model
│
├── constants/
│   ├── categories.js             # Category definitions & icons
│   └── cities.js                 # Supported cities list
│
├── hooks/
│   ├── useCity.js                # City context hook
│   ├── useListings.js            # Listings fetch hook
│   └── useSaved.js               # Saved listings hook
│
├── public/
│   ├── logo.svg
│   └── icons/
│
├── styles/
│   └── globals.css
│
├── .env.local                    # Local environment variables (gitignored)
├── .env.example                  # Template for env variables
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

```bash
node -v      # v18 or higher
npm -v       # v9 or higher
git --version
```

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/basera.git
cd basera
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local` (see [Environment Variables](#environment-variables) below).

### 4. Seed the database (optional but recommended)

```bash
npm run seed
```

This adds sample cities, categories, and 30 dummy listings so the app isn't empty on first run.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root with the following:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/basera

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional — for "Login with Google")
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for step-by-step instructions on getting each of these keys.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cities` | Get all active cities | No |
| GET | `/api/categories` | Get all categories | No |
| GET | `/api/listings` | Get listings (with filters) | No |
| GET | `/api/listings/:id` | Get single listing | No |
| POST | `/api/listings` | Create new listing | Vendor |
| PUT | `/api/listings/:id` | Update listing | Vendor/Admin |
| DELETE | `/api/listings/:id` | Delete listing | Admin |
| POST | `/api/listings/:id/save` | Save listing | User |
| DELETE | `/api/listings/:id/save` | Unsave listing | User |
| GET | `/api/reviews?listingId=` | Get reviews for listing | No |
| POST | `/api/reviews` | Post a review | User |
| POST | `/api/vendors` | Register as vendor | User |

> Full API documentation with request/response examples: [API_DOCS.md](./API_DOCS.md)

---

## 🗄️ Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for full Mongoose schema definitions and ER diagram.

**Collections:** `users` · `cities` · `categories` · `listings` · `reviews` · `vendors`

---

## 📸 Screenshots

| Onboarding | Home | Category | Listing Detail |
|---|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

---

## 🗺️ Roadmap

- [x] Core listing pages with categories
- [x] City-based filtering
- [x] User authentication
- [x] Save/bookmark feature
- [x] Google Maps integration
- [ ] Vendor self-registration portal
- [ ] SMS/Email notifications for new listings
- [ ] Mobile app (React Native)
- [ ] AI-powered relocation checklist
- [ ] Multi-language support (Hindi + English)

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © [Your Name](https://github.com/yourusername)
