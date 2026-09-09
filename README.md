# AARAKSH — Flash Flood Intelligence Platform

> **Smart India Hackathon 2026 — Problem SIH26192**  
> Theme: Disaster Management | Organization: Ministry of Home Affairs, NDRF  
> Team: **NeuroNauts**

---

## Overview

**AARAKSH** (आरक्ष — Protection) is an AI-powered, hyper-local Flash Flood Prediction and Early Warning System designed for hilly regions of India.

**Core Philosophy:** `DATA → INTELLIGENCE → RISK → PREDICTION → WARNING → ACTION`

**Tagline:** *Predict. Prepare. Protect.*

---

## Problem Statement

Hilly states in India (Uttarakhand, Sikkim, Himachal Pradesh, J&K, NE states) are highly vulnerable to flash floods and landslides with very short warning times. Existing early warning systems lack:
- **Hyper-local granularity** at village/ward level
- **Multi-source data integration** (rainfall + soil + terrain + historical)
- **Real-time sensor network** integration
- **AI-driven risk prediction** with explainability

---

## Architecture (Planned Full Stack)

```
┌─────────────────────────────────┐
│        AARAKSH FRONTEND         │  React 19 + TypeScript + Vite
│   (This Repository — Phase 1)   │  Tailwind CSS + MapLibre GL
└────────────────┬────────────────┘
                 │ REST API (Phase 2)
┌────────────────▼────────────────┐
│        FASTAPI BACKEND          │  Python FastAPI
│                                 │  PostgreSQL + PostGIS (Supabase)
└────────────────┬────────────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼───┐  ┌───▼────┐  ┌──▼──────┐
│ XGBoost│  │  IoT   │  │   GIS   │
│  ML    │  │ Gateway│  │ Engine  │
│ Engine │  │ (MQTT) │  │(GeoPan.)│
└────────┘  └────────┘  └─────────┘
```

---

## Tech Stack (Phase 1 — Frontend)

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State/Data | TanStack Query v5 |
| Maps | MapLibre GL JS |
| Charts | Recharts |
| Icons | Lucide React |
| Utilities | clsx + tailwind-merge + class-variance-authority |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
git clone <repo>
cd AARAKSH
npm install
npm run dev
```

The app runs at **http://localhost:5173/**

---

## Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **User** | `user@demo.aaraksh.in` | `demo1234` | Public app (/app/*) |
| **Authority** | `authority@demo.aaraksh.in` | `demo1234` | Admin panel (/admin/*) |
| **Admin** | `admin@demo.aaraksh.in` | `demo1234` | Full access |

> ⚠️ All credentials are for demo purposes only. No real authentication is implemented in Phase 1.

---

## Demo Scenarios

Switch from the Dashboard or Settings page:

| Scenario | Rainfall | Soil Moisture | Water Level | Risk |
|----------|----------|---------------|-------------|------|
| Normal Conditions | 24 mm/hr | 42% | 1.1 m | 🟢 LOW |
| Heavy Rainfall | 76 mm/hr | 69% | 2.1 m | 🟡 MODERATE |
| Rising Risk | 96 mm/hr | 81% | 2.8 m | 🟠 HIGH |
| Critical Conditions | 112 mm/hr | 91% | 3.4 m | 🔴 CRITICAL |

---

## Pages & Routes

### Public
| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/login` | Sign In |
| `/register` | Create Account |

### User App (`/app/*`)
| Route | Page |
|-------|------|
| `/app/dashboard` | Risk Dashboard |
| `/app/risk-map` | Interactive GIS Risk Map |
| `/app/predictions` | ML Prediction View |
| `/app/alerts` | Alert Feed |
| `/app/locations` | Location Manager |
| `/app/safety-centre` | Safety Guidance |
| `/app/reports` | Reports |
| `/app/profile` | Profile |
| `/app/settings` | Settings & Demo Control |

### Admin/Authority (`/admin/*`)
| Route | Page |
|-------|------|
| `/admin/dashboard` | Command Centre |
| `/admin/risk-monitoring` | Regional Risk Table |
| `/admin/live-sensors` | IoT Sensor Network |
| `/admin/locations` | Location Registry |
| `/admin/alerts` | Alert Management |
| `/admin/predictions` | Prediction View |
| `/admin/users` | User Management |
| `/admin/data-sources` | Data Sources Registry |
| `/admin/models` | ML Model Registry |
| `/admin/reports` | Reports |
| `/admin/audit-logs` | Audit Trail |
| `/admin/settings` | System Settings |

---

## Project Structure

```
src/
├── types/          → Domain TypeScript interfaces
├── lib/            → Constants, utilities, helpers
├── data/           → Demo mock datasets
├── contexts/       → Auth & Demo React contexts
├── services/       → Service layer (demo ↔ future API)
├── hooks/          → TanStack Query custom hooks
├── components/
│   ├── layout/     → AppShell, Sidebar, Header
│   └── ui/         → Reusable UI components
├── routes/         → Route definitions + guards
└── pages/
    ├── public/     → Landing page
    ├── auth/       → Login, Register
    ├── system/     → 404, Unauthorized
    ├── user/       → User-facing pages
    └── admin/      → Authority/Admin pages
```

---

## Key Design Decisions

### 1. Service Layer Abstraction
All data access goes through `src/services/`. Currently backed by mock data — each service has comments marking the future API endpoints for Phase 2 FastAPI integration.

### 2. Demo Context Pattern
`DemoContext` manages scenario switching globally. Any component can call `useDemoMode()` to get the current scenario and its simulated values. The simulation auto-cycles through scenarios every 5 seconds when enabled.

### 3. Role-Based Access
Three roles: `USER → AUTHORITY → ADMIN` (hierarchical). `ProtectedRoute` enforces access at the route level. The sidebar renders different navigation items per role.

### 4. Honest Prototype Labeling
- All risk data is labeled **"PROTOTYPE ESTIMATE ONLY"**
- ML model metrics show **"AWAITING VALIDATION"**
- Data sources show **"PENDING"** for unintegrated sources
- Demo mode banner is shown on all authenticated pages

---

## Risk Threshold System

> ⚠️ **These are prototype UI thresholds only. Not scientifically validated.**

| Risk Level | Score Range | Color |
|-----------|-------------|-------|
| 🟢 LOW | 0.00 – 0.29 | Green |
| 🟡 MODERATE | 0.30 – 0.59 | Yellow |
| 🟠 HIGH | 0.60 – 0.79 | Orange |
| 🔴 CRITICAL | 0.80 – 1.00 | Red |

Real thresholds must be calibrated using actual historical data and model evaluation.

---

## Development Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Frontend Foundation (this repo) | ✅ Complete |
| **Phase 2** | FastAPI Backend + Supabase Auth | 🔜 Planned |
| **Phase 3** | ML Model (XGBoost) Training + API | 🔜 Planned |
| **Phase 4** | IoT Sensor Gateway (MQTT) | 🔜 Planned |
| **Phase 5** | GIS Engine (PostGIS + GeoPandas) | 🔜 Planned |
| **Phase 6** | SMS/Push Notification Infrastructure | 🔜 Planned |

---

## Build

```bash
npm run build    # Production build
npm run dev      # Development server (localhost:5173)
npm run preview  # Preview production build
```

---

## Important Disclaimers

1. **This is a prototype.** No real sensor data, no real ML predictions.
2. **Demo data is simulated.** Risk scores are illustrative, not operational.
3. **No ML model is trained.** The XGBoost model is planned and not yet implemented.
4. **No real authentication.** The demo login is client-side only.
5. **Not for operational use.** Do not use for actual emergency response decisions.

---

## Team

**NeuroNauts** — Smart India Hackathon 2026  
Problem: SIH26192 — Flash Flood Prediction System for Hilly Regions  
Category: Software | Theme: Disaster Management  
Organization: Ministry of Home Affairs, NDRF DM Division

---

*AARAKSH v0.1.0-prototype — Phase 1 Frontend Foundation*
