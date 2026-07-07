# 🏗️ Basera — Project Structure & Architecture

---

## Folder Structure

```
basera/
│
├── app/                              # Next.js 14 App Router (pages + API)
│   │
│   ├── (auth)/                       # Auth route group (no main layout)
│   │   ├── login/
│   │   │   └── page.jsx              # Login page
│   │   └── signup/
│   │       └── page.jsx              # Signup page
│   │
│   ├── (main)/                       # Main app route group (with navbar)
│   │   ├── layout.jsx                # Shared layout: Navbar + BottomNav
│   │   ├── page.jsx                  # Landing / redirect to onboarding
│   │   ├── onboard/
│   │   │   └── page.jsx              # City selection onboarding (first visit)
│   │   ├── [city]/
│   │   │   ├── page.jsx              # City home dashboard
│   │   │   └── [category]/
│   │   │       ├── page.jsx          # Category listings page
│   │   │       └── [id]/
│   │   │           └── page.jsx      # Single listing detail page
│   │   ├── saved/
│   │   │   └── page.jsx              # User's saved/bookmarked listings
│   │   └── profile/
│   │       └── page.jsx              # User profile & settings
│   │
│   ├── admin/                        # Admin panel (role-protected)
│   │   ├── layout.jsx                # Admin sidebar layout
│   │   ├── page.jsx                  # Dashboard with stats
│   │   ├── listings/
│   │   │   └── page.jsx              # Review & approve vendor listings
│   │   ├── vendors/
│   │   │   └── page.jsx              # Approve vendor applications
│   │   └── cities/
│   │       └── page.jsx              # Manage active cities
│   │
│   └── api/                          # Backend API routes
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.js          # NextAuth catch-all handler
│       ├── auth/
│       │   └── signup/
│       │       └── route.js          # Custom signup endpoint
│       ├── cities/
│       │   └── route.js              # GET all cities
│       ├── categories/
│       │   └── route.js              # GET all categories
│       ├── listings/
│       │   ├── route.js              # GET (filter) + POST (create)
│       │   ├── saved/
│       │   │   └── route.js          # GET user's saved listings
│       │   └── [id]/
│       │       ├── route.js          # GET one + PUT + DELETE
│       │       └── save/
│       │           └── route.js      # POST (save) + DELETE (unsave)
│       ├── reviews/
│       │   └── route.js              # GET (by listingId) + POST
│       ├── vendors/
│       │   └── route.js              # POST (register vendor)
│       └── upload/
│           └── route.js              # POST (Cloudinary image upload)
│
├── components/                       # Reusable React components
│   ├── ui/                           # Generic UI primitives
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   ├── StarRating.jsx
│   │   └── Toast.jsx
│   ├── layout/
│   │   ├── Navbar.jsx                # Top navigation bar
│   │   ├── BottomNav.jsx             # Mobile bottom tab bar
│   │   └── Footer.jsx
│   ├── listings/
│   │   ├── ListingCard.jsx           # Card shown in grid
│   │   ├── ListingGrid.jsx           # Grid + loading skeleton
│   │   ├── ListingFilters.jsx        # Filter sidebar/bar
│   │   ├── ListingMap.jsx            # Google Maps view
│   │   └── ListingDetail.jsx         # Full detail view
│   ├── reviews/
│   │   ├── ReviewList.jsx
│   │   └── ReviewForm.jsx
│   ├── categories/
│   │   └── CategoryGrid.jsx          # 2-col category grid
│   └── home/
│       ├── HeroBanner.jsx            # City + search hero
│       ├── CityChecklist.jsx         # New city checklist widget
│       └── QuickStats.jsx            # Stats bar (2.4K+ listings etc.)
│
├── lib/                              # Utility / config files
│   ├── mongodb.js                    # Mongoose connection (cached)
│   ├── auth.js                       # NextAuth config options
│   ├── cloudinary.js                 # Image upload helper
│   └── utils.js                      # formatPrice(), truncate(), etc.
│
├── models/                           # Mongoose data models
│   ├── User.js
│   ├── City.js
│   ├── Category.js
│   ├── Listing.js
│   ├── Review.js
│   └── Vendor.js
│
├── constants/                        # Static config data
│   ├── categories.js                 # Category definitions (name, icon, color, slug)
│   └── cities.js                     # Supported Indian cities list
│
├── hooks/                            # Custom React hooks
│   ├── useCity.js                    # Get/set user's selected city
│   ├── useListings.js                # Fetch + paginate listings
│   └── useSaved.js                   # Save/unsave + optimistic update
│
├── context/                          # React Context providers
│   └── CityContext.jsx               # Global city state
│
├── scripts/
│   └── seed.js                       # Database seeding script
│
├── public/
│   ├── logo.svg
│   ├── og-image.png                  # Open Graph image for sharing
│   └── icons/
│
├── styles/
│   └── globals.css
│
├── .env.local                        # ← never commit this
├── .env.example                      # Template (commit this)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Page Architecture

### User Flow

```
User visits basera.vercel.app
        │
        ▼
  First visit? ──Yes──► /onboard  (pick city)
        │
       No
        │
        ▼
   /(main)/[city]        ← City home dashboard
        │
   Click category
        │
        ▼
   /[city]/[category]    ← Listing grid with filters
        │
   Click a listing
        │
        ▼
   /[city]/[category]/[id]  ← Full listing detail + map + reviews
```

### Authentication Flow

```
Click "Login"
     │
     ▼
  /login  ──── Google OAuth ────► NextAuth callback ──► Home
     │
  Email/Pass
     │
     ▼
  POST /api/auth/signin
     │
  Success ──► Session cookie set ──► Home
  Failure ──► Error message
```

---

## Component Hierarchy

```
app/(main)/layout.jsx
├── Navbar
│   ├── Logo
│   ├── CitySelector
│   └── UserMenu (login/profile)
│
├── page content (changes per route)
│
└── BottomNav (mobile only)
    ├── Home tab
    ├── Explore tab
    ├── Saved tab
    └── Profile tab


app/(main)/[city]/[category]/page.jsx
├── ListingFilters
│   ├── SortDropdown
│   ├── PriceRange slider
│   ├── VerifiedToggle
│   └── SubcategoryPills
│
├── ViewToggle (Grid | Map)
│
├── ListingGrid
│   └── ListingCard (×12 per page)
│       ├── Image
│       ├── Badge (subcategory)
│       ├── Name + Verified tick
│       ├── Price
│       ├── StarRating
│       └── SaveButton (heart)
│
└── Pagination


app/(main)/[city]/[category]/[id]/page.jsx
├── ImageGallery
├── ListingHeader
│   ├── Name, Category, Verified
│   └── SaveButton
├── PriceBox
├── ContactBox (phone, WhatsApp, website)
├── ListingMap (Google Maps embed)
├── AmenitiesList
├── TimingInfo
└── ReviewSection
    ├── AverageRating
    ├── ReviewList
    └── ReviewForm (if logged in)
```

---

## Data Flow

```
Browser (React)
     │
     │  fetch('/api/listings?city=bengaluru&category=housing')
     │
     ▼
Next.js API Route (app/api/listings/route.js)
     │
     │  dbConnect() → Listing.find(query).populate(...)
     │
     ▼
MongoDB Atlas
     │
     │  returns documents
     ▼
API Route serializes → JSON response
     │
     ▼
React renders ListingGrid with data
```

---

## Key Design Decisions

**Why App Router (not Pages Router)?**
App Router is the modern Next.js standard. It enables server components, better layouts, and cleaner route grouping. Future-proof.

**Why MongoDB over PostgreSQL?**
Listings have variable fields — a gym listing needs different fields than a tiffin service. MongoDB's flexible schema handles this naturally without migrations.

**Why NextAuth over custom JWT?**
NextAuth handles the hard parts: session management, CSRF protection, OAuth callbacks, and token refresh. Saves significant development time.

**Why Vercel for deployment?**
Zero-config deployment for Next.js, free tier is generous, automatic preview URLs per Git branch, and environment variables UI is simple.

**Why Cloudinary for images?**
Free tier, automatic image optimization (WebP conversion, resizing), and CDN delivery. Much simpler than self-hosting images.
