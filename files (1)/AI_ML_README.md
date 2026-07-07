# 🤖 Basera — AI/ML Documentation

Everything about how Artificial Intelligence is integrated into Basera.

---

## Table of Contents

- [Overview](#overview)
- [AI Features Summary](#ai-features-summary)
- [Architecture](#architecture)
- [APIs Used](#apis-used)
- [Project Structure (AI Layer)](#project-structure-ai-layer)
- [Environment Variables](#environment-variables)
- [Feature Docs](#feature-docs)
- [Resume Impact](#resume-impact)

---

## Overview

Basera uses AI to solve real user problems — not as a gimmick, but as genuine utility. Every feature listed here solves a specific friction point that a person moving to a new city faces.

The AI layer sits **on top of** the existing Next.js + MongoDB stack. It does not replace anything — it enhances it. The architecture is simple: user triggers an action → Next.js API route → AI API call → structured response → rendered in UI.

---

## AI Features Summary

| # | Feature | Problem It Solves | API Used | Difficulty |
|---|---|---|---|---|
| 1 | **AI Chat Assistant** | "I don't know where to start in a new city" | Anthropic Claude | Medium |
| 2 | **Natural Language Search** | "I can't find what I need with keyword search" | Anthropic Claude | Easy |
| 3 | **Review Summarizer** | "I don't have time to read 40 reviews" | Anthropic Claude | Easy |
| 4 | **Neighbourhood Match Score** | "I don't know which area suits my lifestyle" | Anthropic Claude | Medium |
| 5 | **Smart Recommendations** | "I don't know what else I should set up" | MongoDB Aggregation | Medium |
| 6 | **Auto Image Tagging** | "Vendors don't know what amenities to list" | Google Vision API | Hard |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER / BROWSER                        │
│   ChatWidget  │  SearchBar  │  ListingDetail  │  Profile │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP requests
                         ▼
┌─────────────────────────────────────────────────────────┐
│               NEXT.JS API ROUTES (AI Layer)              │
│                                                          │
│  /api/ai/chat              → Chat Assistant              │
│  /api/ai/search            → NL Search Parser            │
│  /api/ai/summarize-reviews → Review Summarizer           │
│  /api/ai/neighbourhood     → Neighbourhood Score         │
│  /api/ai/recommendations   → Smart Recommendations       │
│  /api/ai/tag-image         → Auto Image Tagging          │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
             ▼                          ▼
┌────────────────────┐      ┌──────────────────────────┐
│  ANTHROPIC CLAUDE  │      │     MONGODB ATLAS         │
│  claude-sonnet-4-6 │      │  (listings, reviews,      │
│                    │      │   users, cities)           │
│  - Chat            │      │                           │
│  - NL Search       │      │  Aggregation pipelines    │
│  - Summarize       │      │  for recommendations      │
│  - Neighbourhood   │      └──────────────────────────┘
└────────────────────┘
             │
             ▼
┌────────────────────┐
│  GOOGLE VISION API │
│  (Image Tagging)   │
└────────────────────┘
```

---

## APIs Used

### Anthropic Claude API
Used for: Chat, NL Search, Review Summarizer, Neighbourhood Match

```
Model:    claude-sonnet-4-6
Endpoint: https://api.anthropic.com/v1/messages
Cost:     ~$0.003 per 1K tokens (very cheap for this use case)
```

Why Claude over OpenAI? Better instruction-following, better JSON output, free $5 credit to start.

---

### Google Vision API
Used for: Auto Image Tagging

```
Endpoint: https://vision.googleapis.com/v1/images:annotate
Cost:     Free for first 1000 requests/month
Feature:  LABEL_DETECTION — returns labels like "AC", "Bed", "Kitchen"
```

---

### MongoDB Aggregation (No External API)
Used for: Smart Recommendations

```
No cost. Uses existing MongoDB Atlas.
Technique: Co-occurrence counting (collaborative filtering, simplified)
```

---

## Project Structure (AI Layer)

New files added to the existing Basera structure:

```
basera/
│
├── app/
│   └── api/
│       └── ai/                          ← NEW: all AI routes live here
│           ├── chat/
│           │   └── route.js             ← POST: AI chat assistant
│           ├── search/
│           │   └── route.js             ← POST: NL search → filters
│           ├── summarize-reviews/
│           │   └── route.js             ← POST: review summarizer
│           ├── neighbourhood/
│           │   └── route.js             ← POST: neighbourhood score
│           ├── recommendations/
│           │   └── route.js             ← GET: listing recommendations
│           └── tag-image/
│               └── route.js             ← POST: auto image tagging
│
├── components/
│   └── ai/                              ← NEW: AI UI components
│       ├── ChatWidget.jsx               ← Floating chat button + panel
│       ├── SearchBar.jsx                ← NL search input (replaces old search)
│       ├── ReviewSummary.jsx            ← Summary card above reviews
│       ├── NeighbourhoodScore.jsx       ← Score badge on listing card
│       └── RecommendationStrip.jsx     ← "You might also need" section
│
├── lib/
│   ├── anthropic.js                     ← NEW: Claude API client utility
│   └── vision.js                        ← NEW: Google Vision API utility
│
├── prompts/                             ← NEW: all AI system prompts
│   ├── chat.js                          ← Chat assistant system prompt
│   ├── search.js                        ← NL search extraction prompt
│   ├── summarize.js                     ← Review summarizer prompt
│   └── neighbourhood.js                 ← Neighbourhood scoring prompt
│
└── hooks/
    ├── useChat.js                       ← NEW: chat state management
    └── useNLSearch.js                   ← NEW: NL search hook
```

---

## Environment Variables

Add these to your existing `.env.local`:

```env
# ─── Anthropic Claude API ─────────────────────────────────
# Get from: https://console.anthropic.com → API Keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx

# ─── Google Vision API ────────────────────────────────────
# Same Google Cloud project as Maps API
# Enable: Cloud Vision API in Google Cloud Console
GOOGLE_VISION_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ123456

# ─── AI Feature Flags (set to "true" to enable) ───────────
NEXT_PUBLIC_AI_CHAT_ENABLED=true
NEXT_PUBLIC_AI_SEARCH_ENABLED=true
NEXT_PUBLIC_AI_SUMMARY_ENABLED=true
NEXT_PUBLIC_AI_NEIGHBOURHOOD_ENABLED=true
```

---

## Feature Docs

Each feature has its own detailed document:

- [AI_FEATURES.md](./AI_FEATURES.md) — What each feature does, how it works, code
- [AI_PROMPTS.md](./AI_PROMPTS.md) — All system prompts and templates
- [AI_API_DOCS.md](./AI_API_DOCS.md) — New API endpoints for all AI features
- [AI_SETUP.md](./AI_SETUP.md) — Getting API keys and setting up the AI layer

---

## Resume Impact

Adding AI to Basera upgrades it from a "CRUD app with maps" to a "AI-powered platform." Here's how to describe it:

```
Basera — AI-Powered City Relocation Platform
Tech: Next.js 14, MongoDB, Anthropic Claude API, Google Vision API, Tailwind

• Integrated Anthropic Claude API to power 4 AI features:
  natural language search, review summarization, neighbourhood
  scoring, and a context-aware relocation assistant chatbot

• Built NL search parser that converts free-text queries like
  "cheap veg tiffin near metro under 2000" into structured
  MongoDB filters using Claude's JSON extraction

• Implemented AI review summarizer reducing 40+ user reviews
  into a 2-sentence insight card using prompt engineering

• Designed context-aware chat assistant with full conversation
  history, injecting live listing data as retrieval context
```

That description shows: API integration, prompt engineering, structured outputs, RAG (Retrieval Augmented Generation) — all real ML/AI skills that companies hire for.
