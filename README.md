# 🌌 Cosmic Watch — Frontend

> **Next.js Dashboard for Real-Time Asteroid Monitoring & Risk Analysis**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

Interactive web interface for tracking near-Earth objects, analyzing asteroid risks, monitoring space weather, and exploring NASA's media library.

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 22
- pnpm (recommended)
- Backend API running (see [cosmicwatch-backend](https://github.com/satyabrata510/cosmicwatch-backend))

### Installation

```bash
# Clone
git clone <repo-url>
cd cosmicwatch-frontend

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WS_URL

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---

## ✨ Features

- **🪐 Asteroid Tracking** — Real-time NEO feed with risk classification
- **📊 Risk Dashboard** — AI-powered Torino & Palermo scale analysis
- **🔔 Smart Alerts** — Automated notifications for close approaches
- **⭐ Watchlist** — Track favorite asteroids with custom alerts
- **☀️ Space Weather** — Solar flares, CME, geomagnetic storms
- **🌍 Earth Imagery** — Live EPIC satellite views
- **📸 NASA Media** — Explore astronomy images & videos
- **💬 Live Chat** — WebSocket-powered community discussions
- **🔐 Role-Based Access** — User / Researcher / Admin permissions
- **🎨 Dark Theme** — Space-inspired glassmorphism UI

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.9
- **UI:** React 19 + Tailwind CSS 4
- **State:** Zustand
- **Animation:** Framer Motion
- **3D:** React Three Fiber + Three.js
- **Forms:** React Hook Form + Zod
- **Real-time:** Socket.IO Client
- **HTTP:** Axios
- **Testing:** Vitest + React Testing Library
- **Linting:** Biome

---

## 📁 Project Structure

```
app/
├── (auth)/         # Login & signup pages
├── (main)/         # Authenticated routes
│   ├── dashboard/  # Home dashboard
│   ├── neo/        # NEO tracking & details
│   ├── alerts/     # User notifications
│   ├── watchlist/  # Saved asteroids
│   ├── explore/    # NEO browse
│   ├── risk/       # Risk analysis
│   ├── space-weather/
│   ├── apod/       # Picture of the Day
│   ├── cneos/      # Close approaches
│   ├── chat/       # Live chat
│   └── admin/      # Admin panel
components/         # Reusable UI components
services/           # API client layer
stores/             # Zustand state management
lib/                # Utilities & config
public/             # Static assets
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

---

## 📄 License

ISC

---

**Designed and Developed by ROBOWIZARD 2.0**

