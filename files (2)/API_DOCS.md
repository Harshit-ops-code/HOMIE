# 📡 Basera — API Documentation

Base URL (local): `http://localhost:3000/api`  
Base URL (prod): `https://basera.vercel.app/api`

All responses return JSON. Authenticated routes require a valid NextAuth session cookie.

---

## Table of Contents

- [Cities](#cities)
- [Categories](#categories)
- [Listings](#listings)
- [Reviews](#reviews)
- [Saved Listings](#saved-listings)
- [Vendors](#vendors)
- [Auth](#auth)
- [Error Codes](#error-codes)

---

## Cities

### GET `/api/cities`
Returns all active cities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Bengaluru",
      "state": "Karnataka",
      "slug": "bengaluru",
      "coordinates": { "lat": 12.9716, "lng": 77.5946 },
      "listingCount": 1240
    }
  ]
}
```

---

## Categories

### GET `/api/categories`
Returns all active categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Housing",
      "slug": "housing",
      "icon": "🏠",
      "subcategories": ["PG", "Flat", "Hostel", "1BHK"],
      "color": "#6366F1"
    }
  ]
}
```

---

## Listings

### GET `/api/listings`
Get listings with optional filters and pagination.

**Query Parameters:**

| Param | Type | Description | Example |
|---|---|---|---|
| `city` | string | City slug | `bengaluru` |
| `category` | string | Category slug | `housing` |
| `subcategory` | string | Subcategory | `PG` |
| `search` | string | Full-text search | `koramangala flat` |
| `minPrice` | number | Minimum price | `3000` |
| `maxPrice` | number | Maximum price | `10000` |
| `verified` | boolean | Verified only | `true` |
| `sortBy` | string | Sort field | `rating`, `price`, `newest` |
| `page` | number | Page number (default: 1) | `2` |
| `limit` | number | Items per page (default: 12) | `12` |

**Example request:**
```
GET /api/listings?city=bengaluru&category=housing&verified=true&sortBy=rating&page=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Stanza Living – Salt Lake",
      "subcategory": "PG",
      "locality": "Salt Lake",
      "address": "Block B, Sector V, Salt Lake, Bengaluru",
      "images": ["https://res.cloudinary.com/..."],
      "price": { "displayText": "₹8,500/mo", "value": 8500, "unit": "per_month" },
      "rating": { "average": 4.5, "count": 38 },
      "isVerified": true,
      "tags": ["co-living", "meals-included"],
      "city": { "name": "Bengaluru", "slug": "bengaluru" },
      "category": { "name": "Housing", "slug": "housing", "icon": "🏠" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 84,
    "totalPages": 7
  }
}
```

---

### GET `/api/listings/:id`
Get a single listing by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1...",
    "name": "Stanza Living – Salt Lake",
    "description": "Premium co-living PG with all amenities...",
    "subcategory": "PG",
    "locality": "Salt Lake",
    "address": "Block B, Sector V, Salt Lake, Bengaluru",
    "coordinates": { "lat": 12.9352, "lng": 77.6245 },
    "images": ["https://res.cloudinary.com/..."],
    "contact": {
      "phone": "+91-9876543210",
      "whatsapp": "+91-9876543210",
      "website": "https://stanzaliving.com"
    },
    "price": { "value": 8500, "maxValue": 12000, "displayText": "₹8,500–₹12,000/mo" },
    "amenities": ["WiFi", "AC", "Meals", "Laundry"],
    "timing": { "days": "Mon–Sun", "is24Hours": true },
    "tags": ["co-living", "verified"],
    "rating": { "average": 4.5, "count": 38 },
    "isVerified": true,
    "saveCount": 124,
    "viewCount": 890
  }
}
```

---

### POST `/api/listings`
Create a new listing. **Requires vendor auth.**

**Request body:**
```json
{
  "name": "My Tiffin Service",
  "description": "Fresh home-cooked North Indian meals...",
  "categorySlug": "tiffin-mess",
  "subcategory": "Tiffin",
  "citySlug": "bengaluru",
  "locality": "Indiranagar",
  "address": "123, 5th Cross, Indiranagar, Bengaluru",
  "coordinates": { "lat": 12.9784, "lng": 77.6408 },
  "price": {
    "value": 2500,
    "unit": "per_month",
    "displayText": "₹2,500/mo"
  },
  "contact": {
    "phone": "+91-9876543211",
    "whatsapp": "+91-9876543211"
  },
  "amenities": ["Veg", "Home Delivery", "Monthly Plan"],
  "tags": ["vegetarian", "home-cooked"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": { "_id": "64f2...", "name": "My Tiffin Service", ... }
}
```

---

### PUT `/api/listings/:id`
Update an existing listing. **Requires vendor (own listing) or admin auth.**

**Request body:** (any fields to update)
```json
{
  "price": { "value": 2800, "displayText": "₹2,800/mo" },
  "description": "Updated description..."
}
```

---

### DELETE `/api/listings/:id`
Delete a listing. **Requires admin auth.**

**Response:**
```json
{ "success": true, "message": "Listing deleted" }
```

---

## Reviews

### GET `/api/reviews`
Get reviews for a listing.

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `listingId` | string | Yes | Listing ID |
| `page` | number | No | Page number |
| `limit` | number | No | Items per page |

**Example:**
```
GET /api/reviews?listingId=64f1...&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f3...",
      "rating": 5,
      "comment": "Great PG, very clean and well maintained. Food is excellent!",
      "createdAt": "2024-01-20T08:00:00.000Z",
      "user": { "name": "Priya Verma", "image": null }
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 38
}
```

---

### POST `/api/reviews`
Post a review. **Requires user auth. One review per user per listing.**

**Request body:**
```json
{
  "listingId": "64f1...",
  "rating": 4,
  "comment": "Very good service, friendly staff."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review posted",
  "data": { "_id": "64f4...", "rating": 4, "comment": "..." }
}
```

---

## Saved Listings

### GET `/api/listings/saved`
Get the current user's saved listings. **Requires user auth.**

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1...",
      "name": "Stanza Living – Salt Lake",
      "price": { "displayText": "₹8,500/mo" },
      "rating": { "average": 4.5 },
      "category": { "name": "Housing", "icon": "🏠" },
      "city": { "name": "Bengaluru" }
    }
  ]
}
```

---

### POST `/api/listings/:id/save`
Save a listing. **Requires user auth.**

**Response:**
```json
{ "success": true, "message": "Listing saved", "isSaved": true }
```

---

### DELETE `/api/listings/:id/save`
Remove a listing from saved. **Requires user auth.**

**Response:**
```json
{ "success": true, "message": "Listing removed from saved", "isSaved": false }
```

---

## Vendors

### POST `/api/vendors`
Register as a vendor. **Requires user auth.**

**Request body:**
```json
{
  "businessName": "Ramesh Electric Works",
  "categorySlug": "home-services",
  "citySlug": "bengaluru",
  "phone": "+91-9876543212",
  "gstNumber": "29ABCDE1234F1Z5"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor application submitted. Approval takes 24–48 hours.",
  "data": { "_id": "64f5...", "status": "pending" }
}
```

---

## Auth

Basera uses **NextAuth.js**. The auth routes are handled automatically at `/api/auth/*`.

### POST `/api/auth/signin`
Sign in with credentials (email + password).

```json
{
  "email": "rahul@example.com",
  "password": "yourpassword"
}
```

### POST `/api/auth/signup` *(custom route)*
Register a new user.

**Request body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "StrongPass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created. Please log in."
}
```

### GET `/api/auth/session`
Returns the current session (built into NextAuth).

---

## Error Codes

All errors follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

| HTTP Status | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Missing or invalid request body fields |
| 401 | `UNAUTHORIZED` | Not logged in |
| 403 | `FORBIDDEN` | Logged in but insufficient role |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `ALREADY_EXISTS` | Duplicate (e.g. email, or already reviewed) |
| 500 | `SERVER_ERROR` | Unexpected server error |

---

## Route Implementation Pattern

All API routes follow this pattern:

```js
// app/api/listings/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const query = { isActive: true };
    // build query from params...

    const listings = await Listing
      .find(query)
      .populate('city', 'name slug')
      .populate('category', 'name slug icon')
      .sort({ 'rating.average': -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Listing.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
```
