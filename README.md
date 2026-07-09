# Homie / Basera ⚡

Homie (implemented in the `basera` directory) is a Next.js-powered direct relocation engine designed to streamline home search and moving in India. It enables users to bypass brokers, connect directly with verified listings, utilize AI-driven neighborhood profiling, and simulate rent negotiations with virtual landlord personas.

---

## 📁 Repository Structure

- **[`basera/`](file:///d:/Homie/basera)**: The core Next.js application codebase.
- **`design/`**: UI/UX design specifications, visual guidelines, and wireframes.
- **`dataset_crawler-google-places_2026-07-08_07-18-35-587.json`**: Location data scraped for seeding.
- **`Hyderabad.json`**: Geolocation and local listings data for Hyderabad.

---

## 🚀 Key Features of Basera

- **Direct Relocation Engine**: Access direct, verified listings without broker interference.
- **AI-Assisted Search & Re-ranking**: Integrates LLM semantic search re-ranking using Groq/Anthropic to find the most relevant homes based on detailed queries.
- **Landlord Negotiation Simulator**: Interact with virtual landlords possessing unique personalities (firm, flexible, business-like) and negotiate rent in real-time.
- **Geospatial Map Search**: Filter listings using ray-casting point-in-polygon drawings directly on a Leaflet map.
- **Neighborhood Scorer**: Dynamic compatibility score showing locality advantages tailored to your user profile (transit preference, cooking choice, etc.).
- **AI Review Summarization**: Automatically highlights pros and cons from user reviews using advanced summarization.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **UI & Styling**: React, Tailwind CSS / Vanilla CSS, Leaflet Maps
- **Database**: MongoDB (Mongoose ODM)
- **AI/LLM**: Groq / Anthropic integrations
- **Authentication**: NextAuth.js
- **Media Storage**: Cloudinary

---

## 📦 Getting Started

Please see the setup instructions in the [Basera project directory](file:///d:/Homie/basera#getting-started) to run the application locally.

### Quick Commands (Inside `basera`):
```bash
cd basera
npm install
npm run seed  # Seed database with mock listings
npm run dev   # Start local Next.js dev server
```
