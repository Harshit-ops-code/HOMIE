# ⚙️ Basera — AI Setup Guide

Step-by-step instructions to integrate every AI feature into the project.

---

## Step 1 — Get Your Anthropic API Key

Anthropic Claude powers 4 out of 6 AI features in Basera.

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account
3. You get **$5 free credit** — enough for thousands of test calls
4. Go to **API Keys** → Click **Create Key**
5. Name it `basera-dev` → Copy the key

It looks like: `sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Add to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Cost estimate for development:**
- Chat message: ~$0.001 per exchange
- NL search parse: ~$0.0005 per query
- Review summary: ~$0.002 per 20 reviews
- Your $5 credit = roughly 2,000–5,000 test calls. More than enough.

---

## Step 2 — Get Google Vision API Key

Used only for the Auto Image Tagging feature.

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Open your existing Basera project (same one as Maps API)
3. Go to **APIs & Services** → **Library**
4. Search **"Cloud Vision API"** → Click **Enable**
5. Go to **Credentials** → your existing API key
6. Under **API restrictions**, add **Cloud Vision API** to the allowed list
7. Copy the same API key

Add to `.env.local`:
```env
GOOGLE_VISION_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ123456
```

**Cost:** Free for first 1,000 image requests/month. Perfect for a portfolio project.

---

## Step 3 — Install No New Packages

The AI layer uses only the **native `fetch` API** — no SDK needed.
Anthropic's API is a simple HTTP POST. No `npm install` required.

Verify your existing packages are installed:
```bash
npm list mongoose next-auth bcryptjs cloudinary
```

All good? Move to Step 4.

---

## Step 4 — Create the AI Utility File

```bash
touch lib/anthropic.js
touch lib/vision.js
```

```js
// lib/anthropic.js

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Call Claude API
 * @param {Array} messages - Conversation history [{role, content}]
 * @param {string} systemPrompt - System prompt string
 * @param {number} maxTokens - Max response tokens (default 1024)
 */
export async function callClaude(messages, systemPrompt, maxTokens = 1024) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Extract JSON from Claude's response (handles markdown code blocks)
 * @param {string} text - Raw text from Claude
 */
export function extractJSON(text) {
  // Remove markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  // Find JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found in Claude response');
  return JSON.parse(match[0]);
}
```

```js
// lib/vision.js

const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Detect labels in an image using Google Vision API
 * @param {string} imageUrl - Public URL of the image
 * @param {number} maxResults - Max labels to return
 */
export async function detectLabels(imageUrl, maxResults = 20) {
  if (!process.env.GOOGLE_VISION_API_KEY) {
    throw new Error('GOOGLE_VISION_API_KEY is not set');
  }

  const response = await fetch(
    `${VISION_API_URL}?key=${process.env.GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'LABEL_DETECTION', maxResults },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
          ],
        }],
      }),
    }
  );

  if (!response.ok) throw new Error('Vision API request failed');

  const data = await response.json();
  const labels = data.responses[0]?.labelAnnotations || [];
  return labels.map(l => l.description);
}
```

---

## Step 5 — Create the Prompts Folder

```bash
mkdir prompts
touch prompts/chat.js prompts/search.js prompts/summarize.js prompts/neighbourhood.js
```

Copy the prompt code from [AI_PROMPTS.md](./AI_PROMPTS.md) into each file.

---

## Step 6 — Create AI API Routes

```bash
mkdir -p app/api/ai/chat
mkdir -p app/api/ai/search
mkdir -p app/api/ai/summarize-reviews
mkdir -p app/api/ai/neighbourhood
mkdir -p app/api/ai/recommendations
mkdir -p app/api/ai/tag-image

touch app/api/ai/chat/route.js
touch app/api/ai/search/route.js
touch app/api/ai/summarize-reviews/route.js
touch app/api/ai/neighbourhood/route.js
touch app/api/ai/recommendations/route.js
touch app/api/ai/tag-image/route.js
```

Copy the route code from [AI_FEATURES.md](./AI_FEATURES.md) into each route file.

---

## Step 7 — Create AI UI Components

```bash
mkdir components/ai
touch components/ai/ChatWidget.jsx
touch components/ai/SearchBar.jsx
touch components/ai/ReviewSummary.jsx
touch components/ai/NeighbourhoodScore.jsx
touch components/ai/RecommendationStrip.jsx
```

---

## Step 8 — Add Feature Flags to `.env.local`

Feature flags let you turn AI features on/off without redeployment:

```env
NEXT_PUBLIC_AI_CHAT_ENABLED=true
NEXT_PUBLIC_AI_SEARCH_ENABLED=true
NEXT_PUBLIC_AI_SUMMARY_ENABLED=true
NEXT_PUBLIC_AI_NEIGHBOURHOOD_ENABLED=false
```

Use them in components:
```js
const chatEnabled = process.env.NEXT_PUBLIC_AI_CHAT_ENABLED === 'true';
if (!chatEnabled) return null;
```

---

## Step 9 — Add AI Fields to Listing Model

The review summarizer caches its output in the listing document.
Add these fields to `models/Listing.js`:

```js
// Add inside ListingSchema:
aiSummary: {
  type: String,
  default: null,
},
aiSummaryGeneratedAt: {
  type: Date,
  default: null,
},
```

---

## Step 10 — Update `.env.example`

Add the new keys to `.env.example` so collaborators know what's needed:

```env
# ─── Anthropic Claude API ──────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# ─── Google Vision API ─────────────────────────────────────
GOOGLE_VISION_API_KEY=AIzaSy-your-key-here

# ─── AI Feature Flags ──────────────────────────────────────
NEXT_PUBLIC_AI_CHAT_ENABLED=true
NEXT_PUBLIC_AI_SEARCH_ENABLED=true
NEXT_PUBLIC_AI_SUMMARY_ENABLED=true
NEXT_PUBLIC_AI_NEIGHBOURHOOD_ENABLED=false
```

---

## Step 11 — Test Each Feature

### Test Chat Assistant
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What should I do first when moving to Bengaluru?"}],
    "city": "bengaluru"
  }'
```

Expected: `{ "success": true, "message": "..." }`

---

### Test NL Search
```bash
curl -X POST http://localhost:3000/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query": "cheap veg tiffin under 2000", "city": "bengaluru"}'
```

Expected: `{ "success": true, "filters": { "category": "tiffin-mess", "maxPrice": 2000, ... } }`

---

### Test Review Summarizer
```bash
curl -X POST http://localhost:3000/api/ai/summarize-reviews \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "test123",
    "reviews": [
      {"rating": 5, "comment": "Excellent food and clean rooms"},
      {"rating": 4, "comment": "Good PG, WiFi a bit slow"},
      {"rating": 5, "comment": "Very helpful staff"},
      {"rating": 3, "comment": "Noisy on weekends"},
      {"rating": 4, "comment": "Worth the price, near metro"}
    ]
  }'
```

Expected: `{ "success": true, "summary": "Most users praise..." }`

---

## Deployment — Vercel Environment Variables

When deploying to Vercel, add all AI env variables in the Vercel dashboard:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - `ANTHROPIC_API_KEY` → your key → All environments
   - `GOOGLE_VISION_API_KEY` → your key → All environments
   - `NEXT_PUBLIC_AI_CHAT_ENABLED` → `true` → All environments
   - etc.
3. Redeploy: `git push` triggers automatic redeploy

---

## Common AI Errors & Fixes

**`Error: ANTHROPIC_API_KEY is not set`**
→ Check `.env.local` exists in root, not inside `app/` or `src/`
→ Restart dev server after adding env variables: `Ctrl+C` then `npm run dev`

**`Anthropic API error: overloaded_error`**
→ Claude is busy (rare). Add retry logic or just show a fallback message.

**`No JSON found in Claude response`**
→ Claude didn't return JSON as instructed. Add more examples to the prompt.
→ Use `extractJSON()` utility which handles markdown code fences.

**`Vision API error: REQUEST_DENIED`**
→ Cloud Vision API not enabled in Google Cloud Console
→ Or your API key doesn't have Vision API in its allowed list

**`Vision API error: INVALID_ARGUMENT`**
→ The image URL is not publicly accessible
→ Make sure Cloudinary images are public (no auth required)
