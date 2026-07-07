# 📡 Basera — AI API Documentation

All API routes added specifically for AI/ML features.
Base path: `/api/ai/`

---

## Overview

| Method | Endpoint | Feature | Auth Required |
|---|---|---|---|
| POST | `/api/ai/chat` | Chat Assistant | No (better with session) |
| POST | `/api/ai/search` | NL Search Parser | No |
| POST | `/api/ai/summarize-reviews` | Review Summarizer | No |
| POST | `/api/ai/neighbourhood` | Neighbourhood Score | No |
| GET | `/api/ai/recommendations` | Smart Recommendations | No |
| POST | `/api/ai/tag-image` | Auto Image Tagging | Vendor |

---

## POST `/api/ai/chat`

Sends a conversation to the AI assistant. Returns a response grounded in real Basera listing data.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What should I do first when I move to Bengaluru?" }
  ],
  "city": "bengaluru",
  "userProfile": {
    "occupation": "working_professional",
    "budget": 15000,
    "priorities": ["good food", "near metro"]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `messages` | array | Yes | Full conversation history. Each: `{role, content}` |
| `city` | string | Yes | City slug. Used to fetch relevant listings |
| `userProfile` | object | No | User profile for personalised answers |

**Response:**
```json
{
  "success": true,
  "message": "Start with finding your PG or flat first — that gives you a base for everything else. Once settled, get a local SIM and find a tiffin service nearby so you don't have to worry about cooking while unpacking. Want me to help you find housing in a specific area?",
  "listingsUsed": 3
}
```

**Notes:**
- Send the full `messages` array every time (no server-side memory between calls)
- `listingsUsed` tells you how many DB listings were injected as context
- Add a 600ms debounce on the frontend if sending on each keystroke

---

## POST `/api/ai/search`

Converts a natural language query into structured MongoDB-compatible filters.

**Request Body:**
```json
{
  "query": "cheap veg tiffin near metro under 2000",
  "city": "bengaluru"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | The user's natural language search input |
| `city` | string | Yes | Current city for context |

**Response:**
```json
{
  "success": true,
  "filters": {
    "category": "tiffin-mess",
    "subcategory": "Tiffin",
    "locality": null,
    "city": "bengaluru",
    "minPrice": null,
    "maxPrice": 2000,
    "tags": ["vegetarian", "budget"],
    "sortBy": "price",
    "keyword": null
  }
}
```

**Fallback (if AI fails):**
```json
{
  "success": true,
  "filters": {
    "keyword": "cheap veg tiffin near metro under 2000"
  }
}
```

**Usage on frontend:**
```js
// After receiving filters, call the main listings API
const params = new URLSearchParams();
Object.entries(filters).forEach(([key, val]) => {
  if (val !== null && val !== undefined) {
    params.set(key, Array.isArray(val) ? val.join(',') : val);
  }
});
const listings = await fetch(`/api/listings?${params.toString()}`);
```

---

## POST `/api/ai/summarize-reviews`

Generates a 2–3 sentence AI summary of all reviews for a listing.
Caches the result in the listing document to avoid repeated API calls.

**Request Body:**
```json
{
  "listingId": "64f1a2b3c4d5e6f7a8b9c0d5",
  "reviews": [
    { "rating": 5, "comment": "Excellent food quality and very clean rooms." },
    { "rating": 4, "comment": "Good PG, WiFi is a bit slow sometimes." },
    { "rating": 5, "comment": "Staff is very helpful and responsive." },
    { "rating": 3, "comment": "Noisy on weekends, otherwise fine." },
    { "rating": 4, "comment": "Worth the price, nice location near metro." }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `listingId` | string | Yes | Used to cache the summary in MongoDB |
| `reviews` | array | Yes | Each: `{ rating: number, comment: string }` |

**Response (success):**
```json
{
  "success": true,
  "summary": "Most users praise the food quality and cleanliness, with staff responsiveness frequently highlighted. The metro proximity is considered a major plus at this price point. A few reviews mention slow WiFi and weekend noise as minor drawbacks."
}
```

**Response (not enough reviews):**
```json
{
  "success": false,
  "error": "Not enough reviews to summarize (minimum 5)"
}
```

**Cache logic:**
On the listing detail page, check `listing.aiSummary` first.
Only call this API if `aiSummary` is null or older than 7 days.

```js
const needsSummary = !listing.aiSummary ||
  (new Date() - new Date(listing.aiSummaryGeneratedAt)) > 7 * 24 * 60 * 60 * 1000;

if (needsSummary && reviews.length >= 5) {
  // call /api/ai/summarize-reviews
}
```

---

## POST `/api/ai/neighbourhood`

Scores a locality/neighbourhood for a specific user based on their profile and needs.

**Request Body:**
```json
{
  "userProfile": {
    "occupation": "working_professional",
    "budget": 12000,
    "priorities": ["good food", "quiet area", "near metro"],
    "commuteTo": "Whitefield",
    "preferences": "veg-only"
  },
  "locality": "Koramangala",
  "cityName": "Bengaluru",
  "listingData": {
    "housingCount": 24,
    "avgHousingPrice": 9500,
    "tiffinCount": 8,
    "gymCount": 5,
    "nearMetro": true
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `userProfile` | object | Yes | User's occupation, budget, priorities |
| `locality` | string | Yes | The area to score |
| `cityName` | string | Yes | Full city name |
| `listingData` | object | No | Summary of what's available in that locality |

**Response:**
```json
{
  "success": true,
  "score": 82,
  "reason": "Strong food scene and metro access suits your work-from-office lifestyle well",
  "pros": ["Multiple veg tiffin options", "Metro station nearby", "Vibrant yet residential"],
  "cons": ["Slightly above your budget", "Far from Whitefield"]
}
```

**Frontend usage — show as badge on ListingCard:**
```jsx
{score && (
  <div className={`text-xs font-bold px-2 py-1 rounded-full ${
    score >= 80 ? 'bg-green-100 text-green-700' :
    score >= 60 ? 'bg-yellow-100 text-yellow-700' :
    'bg-red-100 text-red-700'
  }`}>
    {score}% match ✨
  </div>
)}
```

---

## GET `/api/ai/recommendations`

Returns listings that are frequently saved together with a given listing.
Uses MongoDB co-save aggregation — no external AI API.

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `listingId` | string | Yes | The listing to find recommendations for |
| `limit` | number | No | Max results (default: 4) |

**Example:**
```
GET /api/ai/recommendations?listingId=64f1...&limit=4
```

**Response (collaborative — enough data):**
```json
{
  "success": true,
  "type": "collaborative",
  "data": [
    {
      "_id": "64f2...",
      "name": "Didi's Kitchen",
      "price": { "displayText": "₹2,500/mo" },
      "rating": { "average": 4.8 },
      "category": { "name": "Tiffin & Mess", "icon": "🍱" }
    },
    {
      "_id": "64f3...",
      "name": "Gold's Gym – Indiranagar",
      "price": { "displayText": "₹2,500/mo" },
      "rating": { "average": 4.7 },
      "category": { "name": "Gym & Fitness", "icon": "💪" }
    }
  ]
}
```

**Response (fallback — not enough save data):**
```json
{
  "success": true,
  "type": "top_rated",
  "data": [ ... top rated listings in other categories ]
}
```

**Frontend — show as "You might also need" strip:**
```jsx
<div>
  <h3>People who saved this also set up:</h3>
  <div className="flex gap-3 overflow-x-auto">
    {recommendations.map(rec => <MiniListingCard key={rec._id} listing={rec} />)}
  </div>
</div>
```

---

## POST `/api/ai/tag-image`

Analyzes an uploaded listing image using Google Vision API and returns detected amenity tags.
Only available to verified vendors.

**Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/basera/image/upload/v123/listing_photo.jpg"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `imageUrl` | string | Yes | Cloudinary URL of the uploaded image |

**Response:**
```json
{
  "success": true,
  "detectedAmenities": ["AC", "Furnished Bed", "Bathroom", "WiFi"],
  "rawLabels": ["Air conditioning", "Bed frame", "Bathroom", "Wireless network", "Furniture", "Room"]
}
```

**Response (image analysis failed):**
```json
{
  "success": false,
  "error": "Image analysis failed"
}
```

**Frontend usage — pre-fill amenity checkboxes:**
```jsx
const handleImageUpload = async (file) => {
  // 1. Upload to Cloudinary first
  const imageUrl = await uploadToCloudinary(file);
  
  // 2. Send to Vision API
  const res = await fetch('/api/ai/tag-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  });
  const { detectedAmenities } = await res.json();
  
  // 3. Pre-check amenity boxes
  setSelectedAmenities(prev => [...new Set([...prev, ...detectedAmenities])]);
};
```

---

## Error Handling (All AI Routes)

All AI routes return errors in this format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

| Scenario | Status | Error |
|---|---|---|
| AI API key missing | 500 | "AI service not configured" |
| AI API call failed | 500 | "AI service unavailable" |
| Invalid JSON from AI | 500 | "Could not parse AI response" |
| Bad request body | 400 | "Missing required field: query" |
| Rate limit hit | 429 | "Too many requests, try again shortly" |

**Important:** Every AI feature must work WITHOUT the AI when it fails.
Always have a fallback — keyword search, cached data, or hidden element.
Never show a broken page because Claude was slow.
