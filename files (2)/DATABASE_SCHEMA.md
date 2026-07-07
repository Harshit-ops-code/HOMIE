# 🗄️ Basera — Database Schema

MongoDB Atlas · Mongoose ODM

---

## Collections Overview

```
basera_db
├── users
├── cities
├── categories
├── listings
├── reviews
└── vendors
```

---

## 1. Users Collection

```js
// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 60,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // null if signed up via Google OAuth
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'vendor', 'admin'],
    default: 'user',
  },
  currentCity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    default: null,
  },
  locality: {
    type: String,
    trim: true,
    default: '',
  },
  savedListings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
  ],
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

**Example document:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "$2b$10$hashedpassword",
  "image": null,
  "role": "user",
  "currentCity": "64f1a2b3c4d5e6f7a8b9c0d2",
  "locality": "Koramangala",
  "savedListings": ["64f1a2b3c4d5e6f7a8b9c0d5"],
  "isEmailVerified": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Cities Collection

```js
// models/City.js
import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // e.g. "bengaluru", "new-delhi"
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  image: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  listingCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.City || mongoose.model('City', CitySchema);
```

**Example document:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "Bengaluru",
  "state": "Karnataka",
  "slug": "bengaluru",
  "coordinates": { "lat": 12.9716, "lng": 77.5946 },
  "image": "https://cdn.basera.in/cities/bengaluru.jpg",
  "isActive": true,
  "listingCount": 1240
}
```

---

## 3. Categories Collection

```js
// models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // e.g. "housing", "tiffin-mess", "home-services"
  },
  icon: {
    type: String,
    required: true,
    // emoji or icon name
  },
  description: {
    type: String,
    default: '',
  },
  subcategories: [
    {
      type: String, // e.g. ["PG", "Flat", "Hostel", "1BHK"]
    },
  ],
  color: {
    type: String,
    default: '#6366F1',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
```

**Example document:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "name": "Housing",
  "slug": "housing",
  "icon": "🏠",
  "description": "Find PGs, hostels, flats, and apartments",
  "subcategories": ["PG", "Hostel", "Flat", "1BHK", "2BHK", "Studio"],
  "color": "#6366F1",
  "isActive": true,
  "sortOrder": 1
}
```

---

## 4. Listings Collection (Core)

```js
// models/Listing.js
import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Listing name is required'],
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: String,
    default: '',
    // e.g. "PG", "Electrician", "Veg Mess"
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  locality: {
    type: String,
    required: true,
    // e.g. "Koramangala", "Indiranagar"
  },
  address: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  images: [
    {
      type: String, // Cloudinary URLs
    },
  ],
  contact: {
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  price: {
    value: { type: Number, default: null },
    maxValue: { type: Number, default: null },
    unit: {
      type: String,
      enum: ['per_month', 'per_visit', 'per_kg', 'per_meal', 'range', 'free', 'on_request'],
      default: 'on_request',
    },
    displayText: { type: String, default: '' }, // e.g. "₹5,500/mo" or "₹50–200"
  },
  amenities: [
    {
      type: String, // e.g. ["WiFi", "AC", "Attached Bathroom"]
    },
  ],
  timing: {
    open: { type: String, default: '' },   // e.g. "09:00"
    close: { type: String, default: '' },  // e.g. "22:00"
    days: { type: String, default: 'Mon–Sun' },
    is24Hours: { type: Boolean, default: false },
  },
  tags: [
    {
      type: String, // e.g. ["budget", "women-only", "vegetarian"]
    },
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  saveCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Indexes for fast queries
ListingSchema.index({ city: 1, category: 1 });
ListingSchema.index({ city: 1, 'rating.average': -1 });
ListingSchema.index({ name: 'text', description: 'text', locality: 'text' });
ListingSchema.index({ coordinates: '2dsphere' });

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
```

**Example document:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
  "name": "Stanza Living – Salt Lake Block B",
  "description": "Premium co-living PG with all amenities. WiFi, housekeeping, meals included.",
  "category": "64f1a2b3c4d5e6f7a8b9c0d3",
  "subcategory": "PG",
  "city": "64f1a2b3c4d5e6f7a8b9c0d2",
  "locality": "Salt Lake",
  "address": "Block B, Sector V, Salt Lake, Bengaluru",
  "coordinates": { "lat": 12.9352, "lng": 77.6245 },
  "images": ["https://res.cloudinary.com/basera/listing1-1.jpg"],
  "contact": {
    "phone": "+91-9876543210",
    "whatsapp": "+91-9876543210",
    "email": "saltlake@stanzaliving.com",
    "website": "https://stanzaliving.com"
  },
  "price": {
    "value": 8500,
    "maxValue": 12000,
    "unit": "per_month",
    "displayText": "₹8,500 – ₹12,000/mo"
  },
  "amenities": ["WiFi", "AC", "Meals", "Laundry", "Security"],
  "timing": { "open": "00:00", "close": "00:00", "days": "Mon–Sun", "is24Hours": true },
  "tags": ["co-living", "meals-included", "verified"],
  "isVerified": true,
  "isActive": true,
  "rating": { "average": 4.5, "count": 38 },
  "saveCount": 124,
  "viewCount": 890,
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

---

## 5. Reviews Collection

```js
// models/Review.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// One review per user per listing
ReviewSchema.index({ listing: 1, user: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
```

---

## 6. Vendors Collection

```js
// models/Vendor.js
import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
  ],
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
```

---

## Relationships Diagram

```
User ─────────────── savedListings ──────────────> Listing (many-to-many)
User ─────────────── currentCity ────────────────> City (many-to-one)
User ─────────────── Vendor (one-to-one)
Vendor ───────────── listings ───────────────────> Listing (one-to-many)
Vendor ───────────── city ───────────────────────> City
Vendor ───────────── category ───────────────────> Category
Listing ──────────── city ───────────────────────> City (many-to-one)
Listing ──────────── category ───────────────────> Category (many-to-one)
Listing ──────────── vendor ─────────────────────> User
Review ───────────── listing ────────────────────> Listing (many-to-one)
Review ───────────── user ───────────────────────> User (many-to-one)
```

---

## Indexes Summary

| Collection | Index | Purpose |
|---|---|---|
| users | `email` (unique) | Login lookup |
| listings | `city + category` | Category page filter |
| listings | `city + rating.average` | Sort by top rated |
| listings | `text (name, description, locality)` | Search |
| listings | `coordinates 2dsphere` | Nearby/map queries |
| reviews | `listing + user` (unique) | One review per user |

---

## Seeding the Database

```js
// scripts/seed.js
// Run with: npm run seed

import dbConnect from '../lib/mongodb.js';
import City from '../models/City.js';
import Category from '../models/Category.js';
import Listing from '../models/Listing.js';

const cities = [
  { name: 'Bengaluru', state: 'Karnataka', slug: 'bengaluru', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { name: 'Delhi', state: 'Delhi', slug: 'delhi', coordinates: { lat: 28.6139, lng: 77.2090 } },
  { name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad', coordinates: { lat: 17.3850, lng: 78.4867 } },
  { name: 'Pune', state: 'Maharashtra', slug: 'pune', coordinates: { lat: 18.5204, lng: 73.8567 } },
];

// ... insert categories and sample listings
```
