# 🏠 Basera & Homie ⚡
> **India's First Direct Relocation Engine — Settle in like a local.**

---

<p align="center">
  <img src="https://img.shields.io/badge/Framework-Next.js%2016-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-Groq%20%2F%20Claude-blueviolet?style=for-the-badge&logo=anthropic&logoColor=white" alt="AI integration" />
</p>

---

## 🌟 Overview

**Basera** is a state-of-the-art direct relocation platform designed to eliminate middle-men, avoid fake listings, and streamline moving to new cities in India. 

Unlike standard housing platforms, Basera provides **AI-powered listing validation**, **semantic search re-ranking**, a **real-time LLM-driven landlord negotiation simulator**, and **geospatial neighborhood analytics** to let you move with absolute confidence.

---

## ✨ Premium Features

### 🤖 LLM Landlord Negotiation Simulator
- Engage in interactive, real-time chats with simulated virtual landlord personas (Mrs. Kapoor, Mr. Iyer, etc.).
- Landlords have unique negotiation floors, deposit expectations, and dynamic patience bars (which deplete if you low-ball them!).

### 🗺️ Draw-to-Search Geospatial Map
- Draw free-form custom polygons on an interactive Leaflet map to capture listing Candidates inside transport corridors or specific blocks.
- Performs fast, custom point-in-polygon ray-casting in-memory matching.

### 🧠 Semantic AI Search & Re-Ranking
- Type natural queries like *"budget PG near Indiranagar with food"* and get LLM-sorted matches.
- Uses a hybrid lexical + LLM semantic re-ranking architecture to evaluate match quality.

### 📍 AI Neighborhood Scorer
- Analyzes local listings and rates neighborhood compatibility based on custom user personas (students, working professionals, families).
- Displays tailored pros/cons list for transit, meal availability, and local conveniences.

### 📝 AI Review Summarizer
- Extracts core feedback, pros, and cons from multiple listing reviews into a clean, actionable summary block.

---

## 🛠️ Project Structure

```bash
📂 HOMIE
├── 📂 basera          # Core Next.js App Router codebase
│   ├── 📂 app         # Routes, Layouts, and API endpoints
│   ├── 📂 components  # Beautiful React components & map widgets
│   ├── 📂 lib         # DB Connections, Auth, and LLM utilities
│   └── 📂 models      # Mongoose schemas (Listings, Reviews, Cities)
├── 📂 design          # Wireframes and asset guidelines
├── 📄 Hyderabad.json  # Raw data for city listing seed
└── 📄 README.md       # Root Documentation
```

---

## 🚀 Setup & Installation

### 1️⃣ Clone & Configure Environment
Navigate to the `basera` directory and copy the environment variables template:
```bash
cd basera
cp .env.example .env.local
```
Update your `.env.local` with your MongoDB connections and API keys:
```env
MONGODB_URI=mongodb://your_local_or_atlas_db
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Seed Mock Listings
Populate the database with verified local mock listings, cities, and categories:
```bash
npm run seed
```

### 4️⃣ Launch the Engine
```bash
npm run dev
```
Open **[localhost:3000](http://localhost:3000)** to explore!

---

## 🧪 Testing & Validation

Run ESLint to check code syntax standards:
```bash
npm run lint
```

Build Next.js production distribution bundle:
```bash
npm run build
```
