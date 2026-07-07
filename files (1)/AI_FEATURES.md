# 🧠 Basera — AI Features Specification

Detailed breakdown of every AI feature: what it does, how it works, and implementation code.

---

## Feature 1 — AI Chat Assistant

### What It Does (User View)
A floating chat button on every page. User opens it and asks anything:
- *"What should I do first when I move to Bengaluru next week?"*
- *"Find me a PG under ₹7000 in Koramangala with meals"*
- *"What are the best areas for working professionals in Mumbai?"*

The assistant answers using knowledge of Basera's listings, the selected city, and general relocation knowledge.

### How It Works (Technical)
1. User types a message in `ChatWidget.jsx`
2. Message + conversation history sent to `POST /api/ai/chat`
3. API route fetches top 5 relevant listings from MongoDB (search by keywords)
4. Listings injected into Claude's context as "available data"
5. Claude responds with helpful, city-specific advice
6. Response streamed back to the UI

This is **RAG — Retrieval Augmented Generation**. The AI answer is grounded in real Basera data, not hallucinated.

### Implementation

```js
// lib/anthropic.js
const callClaude = async (messages, systemPrompt, stream = false) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      stream,
    }),
  });
  return response;
};

export default callClaude;
```

```js
// app/api/ai/chat/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { CHAT_SYSTEM_PROMPT } from '@/prompts/chat';
import callClaude from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { messages, city, userProfile } = await request.json();

    // Get the last user message to search relevant listings
    const lastMessage = messages[messages.length - 1].content;

    await dbConnect();

    // RAG: fetch relevant listings based on the user's message
    const relevantListings = await Listing.find(
      {
        $text: { $search: lastMessage },
        city: city,
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(5)
      .populate('category', 'name')
      .lean();

    // Build context string from listings
    const listingContext = relevantListings.length > 0
      ? `\n\nRELEVANT LISTINGS FROM DATABASE:\n${relevantListings.map(l =>
          `- ${l.name} (${l.category?.name}) in ${l.locality}: ${l.price?.displayText} | Rating: ${l.rating?.average}/5`
        ).join('\n')}`
      : '';

    // Build system prompt with real data injected
    const systemPrompt = CHAT_SYSTEM_PROMPT(city, listingContext, userProfile);

    const response = await callClaude(messages, systemPrompt);
    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.content[0].text,
      listingsUsed: relevantListings.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI service unavailable' },
      { status: 500 }
    );
  }
}
```

```jsx
// components/ai/ChatWidget.jsx
'use client';
import { useState, useRef, useEffect } from 'react';

export default function ChatWidget({ city }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm Basera AI 👋 Ask me anything about settling in ${city}!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, city }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
      >
        🤖
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <div className="font-bold">Basera AI</div>
              <div className="text-xs text-indigo-200">Your {city} guide</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-xl text-sm text-gray-500 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## Feature 2 — Natural Language Search

### What It Does (User View)
User types in plain language:
- *"cheap PG in Koramangala with food under 8000"*
- *"best rated gym near Indiranagar"*
- *"electrician available on Sunday in BTM"*

Instead of keyword matching, AI understands intent and converts it to smart filters automatically.

### How It Works (Technical)
1. User types query in `SearchBar.jsx`
2. After 600ms debounce, query sent to `POST /api/ai/search`
3. Claude extracts structured JSON from the natural language
4. Extracted filters used to call `GET /api/listings` with those params
5. Results shown instantly

### Implementation

```js
// app/api/ai/search/route.js
import { NextResponse } from 'next/server';
import { SEARCH_EXTRACTION_PROMPT } from '@/prompts/search';
import callClaude from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { query, city } = await request.json();

    const response = await callClaude(
      [{ role: 'user', content: `Extract search filters from: "${query}"` }],
      SEARCH_EXTRACTION_PROMPT(city)
    );

    const data = await response.json();
    const rawText = data.content[0].text;

    // Parse JSON from Claude's response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const filters = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, filters });
  } catch (error) {
    // Graceful fallback: treat as keyword search
    return NextResponse.json({
      success: true,
      filters: { keyword: query },
    });
  }
}
```

```jsx
// components/ai/SearchBar.jsx
'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ city }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, city }),
      });
      const { filters } = await res.json();

      // Build query string from extracted filters
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.locality) params.set('locality', filters.locality);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.tags) params.set('tags', filters.tags.join(','));
      if (filters.keyword) params.set('search', filters.keyword);

      router.push(`/${city}?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
      <span className="text-lg">🔍</span>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder="Try: cheap veg tiffin near metro under 2000..."
        className="flex-1 outline-none text-gray-700 text-sm"
      />
      {loading
        ? <span className="text-indigo-500 text-sm animate-pulse">Thinking...</span>
        : <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
          >
            Search
          </button>
      }
    </div>
  );
}
```

---

## Feature 3 — Review Summarizer

### What It Does (User View)
On the listing detail page, above the review list, a card shows:
> **AI Summary:** Most users praise the cleanliness and food quality. The ₹8,500/mo price is considered fair. Common complaints include noisy weekends and slow WiFi.

One read instead of 40 reviews. Saves significant time.

### How It Works (Technical)
1. Listing detail page loads all reviews from `/api/reviews?listingId=...`
2. If reviews ≥ 5, sends them to `POST /api/ai/summarize-reviews`
3. Claude reads all reviews and writes a 2–3 sentence summary
4. Summary cached in the listing document (field: `aiSummary`) to avoid repeat API calls

### Implementation

```js
// app/api/ai/summarize-reviews/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { SUMMARIZE_PROMPT } from '@/prompts/summarize';
import callClaude from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { listingId, reviews } = await request.json();

    if (!reviews || reviews.length < 5) {
      return NextResponse.json({
        success: false,
        error: 'Not enough reviews to summarize (minimum 5)',
      });
    }

    // Format reviews for the prompt
    const reviewText = reviews
      .map(r => `${r.rating}/5 stars: "${r.comment}"`)
      .join('\n');

    const response = await callClaude(
      [{ role: 'user', content: `Summarize these reviews:\n${reviewText}` }],
      SUMMARIZE_PROMPT
    );

    const data = await response.json();
    const summary = data.content[0].text.trim();

    // Cache the summary in MongoDB to avoid repeat API calls
    await dbConnect();
    await Listing.findByIdAndUpdate(listingId, {
      aiSummary: summary,
      aiSummaryGeneratedAt: new Date(),
    });

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Could not generate summary' },
      { status: 500 }
    );
  }
}
```

```jsx
// components/ai/ReviewSummary.jsx
'use client';
import { useState, useEffect } from 'react';

export default function ReviewSummary({ listingId, reviews, cachedSummary }) {
  const [summary, setSummary] = useState(cachedSummary || null);
  const [loading, setLoading] = useState(!cachedSummary && reviews.length >= 5);

  useEffect(() => {
    if (cachedSummary || reviews.length < 5) return;

    const generateSummary = async () => {
      try {
        const res = await fetch('/api/ai/summarize-reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId, reviews }),
        });
        const data = await res.json();
        if (data.success) setSummary(data.summary);
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, []);

  if (reviews.length < 5) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🤖</span>
        <span className="font-semibold text-indigo-800 text-sm">AI Review Summary</span>
        <span className="text-xs text-indigo-400 ml-auto">Based on {reviews.length} reviews</span>
      </div>
      {loading ? (
        <div className="h-4 bg-indigo-100 rounded animate-pulse w-3/4" />
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}
```

---

## Feature 4 — Neighbourhood Match Score

### What It Does (User View)
User fills a quick profile: *"I'm a working professional, budget ₹15k/mo, need good food options, prefer quiet area."*

Every locality/listing shows a **Match Score**: `92% match for you ✨`

This is unique — no other relocation app does this.

### How It Works (Technical)
1. User fills profile modal → saved to their user document + localStorage
2. When listing cards render, `POST /api/ai/neighbourhood` is called with user profile + locality data
3. Claude scores it 0–100 and gives a one-line reason
4. Score shown as a badge on the listing card

### Implementation

```js
// app/api/ai/neighbourhood/route.js
import { NextResponse } from 'next/server';
import { NEIGHBOURHOOD_PROMPT } from '@/prompts/neighbourhood';
import callClaude from '@/lib/anthropic';

export async function POST(request) {
  try {
    const { userProfile, locality, cityName, listingData } = await request.json();

    const response = await callClaude(
      [{
        role: 'user',
        content: `
          User Profile: ${JSON.stringify(userProfile)}
          Locality: ${locality}, ${cityName}
          Available in this locality: ${JSON.stringify(listingData)}
          
          Score this locality for this user (0-100) and give a one-line reason.
          Respond ONLY with JSON: { "score": 85, "reason": "Great food options, quiet residential area" }
        `
      }],
      NEIGHBOURHOOD_PROMPT
    );

    const data = await response.json();
    const rawText = data.content[0].text;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, score: null, reason: null });
  }
}
```

---

## Feature 5 — Smart Recommendations

### What It Does (User View)
On a listing detail page, a section shows:
> *"People who saved this PG also set up:"*
> 🍱 Didi's Kitchen (Tiffin) · 💪 Gold's Gym · 🧹 Meena Bai (Maid Service)

This guides the user through everything they need to set up — turning a one-time visit into a complete setup journey.

### How It Works (Technical)
Pure MongoDB aggregation — no external AI API needed. Track which listings users save together (co-save patterns).

```js
// app/api/ai/recommendations/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Listing from '@/models/Listing';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    await dbConnect();

    // Find all users who saved this listing
    const usersWhoSaved = await User.find(
      { savedListings: listingId },
      { savedListings: 1 }
    ).lean();

    if (usersWhoSaved.length < 3) {
      // Not enough data — return top-rated listings in other categories
      const topListings = await Listing.find({ isActive: true })
        .sort({ 'rating.average': -1 })
        .limit(4)
        .populate('category', 'name icon')
        .lean();

      return NextResponse.json({ success: true, data: topListings, type: 'top_rated' });
    }

    // Count co-saves: which other listings appear most with this one
    const coSaveCounts = {};
    for (const user of usersWhoSaved) {
      for (const savedId of user.savedListings) {
        const id = savedId.toString();
        if (id !== listingId) {
          coSaveCounts[id] = (coSaveCounts[id] || 0) + 1;
        }
      }
    }

    // Sort by frequency, take top 4
    const topCoSaved = Object.entries(coSaveCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([id]) => id);

    const recommendations = await Listing.find({ _id: { $in: topCoSaved } })
      .populate('category', 'name icon')
      .lean();

    return NextResponse.json({ success: true, data: recommendations, type: 'collaborative' });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}
```

---

## Feature 6 — Auto Image Tagging

### What It Does (User View)
When a vendor uploads a photo of their PG/service, the system automatically detects amenities and pre-fills the checkboxes: WiFi ✅, AC ✅, Bed ✅, Kitchen ✅.

Vendor doesn't have to manually tick anything. Reduces listing creation friction.

### How It Works (Technical)
1. Vendor uploads image to Cloudinary
2. Cloudinary URL sent to `POST /api/ai/tag-image`
3. Google Vision API analyzes the image
4. Returns labels (e.g., "Air conditioning", "Bed frame")
5. Labels mapped to Basera amenity names and returned to the form

### Implementation

```js
// lib/vision.js
export async function detectLabels(imageUrl) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: imageUrl } },
          features: [{ type: 'LABEL_DETECTION', maxResults: 20 }],
        }],
      }),
    }
  );
  const data = await response.json();
  return data.responses[0].labelAnnotations.map(l => l.description);
}
```

```js
// app/api/ai/tag-image/route.js
import { NextResponse } from 'next/server';
import { detectLabels } from '@/lib/vision';

// Map Google Vision labels → Basera amenity names
const LABEL_MAP = {
  'Air conditioning': 'AC',
  'WiFi': 'WiFi',
  'Wireless network': 'WiFi',
  'Bed frame': 'Furnished Bed',
  'Kitchen': 'Kitchen',
  'Refrigerator': 'Fridge',
  'Washing machine': 'Washing Machine',
  'Bathroom': 'Bathroom',
  'Parking': 'Parking',
  'Swimming pool': 'Swimming Pool',
  'Gym': 'Gym',
  'Security guard': 'Security',
};

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    const labels = await detectLabels(imageUrl);

    // Map to known amenities
    const detectedAmenities = labels
      .filter(label => LABEL_MAP[label])
      .map(label => LABEL_MAP[label]);

    return NextResponse.json({
      success: true,
      detectedAmenities,
      rawLabels: labels,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Image analysis failed' },
      { status: 500 }
    );
  }
}
```
