<div align="center">

# 🌿 Nirmala Nagara
### *Clean Bengaluru. Smarter Action.*

[![Live App](https://img.shields.io/badge/🚀%20Live%20App-danivijay.github.io-10b981?style=for-the-badge)](https://danivijay.github.io/nirmala-nagara)
[![GitHub](https://img.shields.io/badge/GitHub-nirmala--nagara-24292e?style=for-the-badge&logo=github)](https://github.com/danivijay/nirmala-nagara)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

> A civic technology platform that empowers Bengaluru residents to report roadside garbage, enables municipal authorities to dispatch the right cleanup vehicle, and lays the foundation for a **fully automated, AI-driven clean city system**.

</div>

---

## 🚨 The Problem

Bengaluru, India's Silicon Valley, generates over **5,000 tonnes of solid waste every single day**. Yet:

- 🗑️ Thousands of garbage dumps go **unreported** daily — people assume someone else will call it in
- 📞 Existing complaint channels (apps, helplines) collect **unstructured text** — no photo, no size estimate, no vehicle type needed
- 🚛 BBMP dispatches the **wrong vehicle** — a handcart goes to a construction debris site, a tipper truck to a small plastic bag pile
- 📊 Municipal supervisors have **no real-time visibility** into pending vs resolved reports across the city
- ⏳ Average complaint-to-cleanup time is **days**, not hours — letting one dump become many

The result: our streets, parks, and storm drains are choked with garbage that could be cleared in hours if reported and routed correctly.

---

## 💡 The Solution: Nirmala Nagara

Nirmala Nagara is a **structured civic reporting platform** that turns a vague "there's garbage here" complaint into a precise, actionable dispatch instruction.

```
Citizen sees garbage
        ↓
Opens Nirmala Nagara on phone
        ↓
Uploads photo + picks location
        ↓
AI classifies: size · category · severity · vehicle needed
        ↓
Citizen confirms and submits (10 seconds)
        ↓
Incident appears on Authority Dashboard instantly
        ↓
Right vehicle dispatched → Cleanup done → Marked resolved
```

No app download. No login. No form-filling. Just **photo → submit → done**.

---

## ✨ What's Built Today (MVP)

### 📱 Citizen Reporting — `/report`

| Feature | Detail |
|---|---|
| 📷 Photo upload | JPG, PNG, WebP from camera or gallery |
| 🎯 3 demo scenarios | Instant test without a real photo |
| 🗺️ Location picker | 24 Bengaluru localities |
| 🤖 Auto-classification | Size · Category · Severity · Vehicle |
| ✏️ Editable results | Citizen can correct before submitting |
| 💾 Instant persistence | Saved to localStorage — no backend needed |
| ✅ Success confirmation | With link to dashboard |

### 🖥️ Authority Dashboard — `/dashboard`

| Feature | Detail |
|---|---|
| 📊 Live stats | Total · Pending · Resolved counts |
| 🗂️ Incident grid | Photo · Location · Size · Severity · Vehicle |
| 🟡 Severity badges | Color-coded Low / Medium / High |
| ✅ Mark Resolved | One-click status update |
| 🔄 Persistent state | Survives page refresh via localStorage |

### Classification Logic

| Garbage Size | Severity | Recommended Vehicle |
|---|---|---|
| 🟢 Small | Low | 🛒 Handcart |
| 🟡 Medium | Medium | 🚐 Mini Pickup |
| 🔴 Large | High | 🚛 Tipper Truck |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER (SPA)                    │
│                                                     │
│   /report                       /dashboard          │
│  ┌──────────────────┐          ┌──────────────────┐ │
│  │  ReportPage.tsx  │          │ DashboardPage.tsx│ │
│  │                  │          │                  │ │
│  │  ① Upload image  │          │  Stats cards     │ │
│  │  ② Pick location │          │  Incident grid   │ │
│  │  ③ Analyze       │          │  Mark Resolved   │ │
│  │  ④ Submit        │          │                  │ │
│  └────────┬─────────┘          └────────┬─────────┘ │
│           │                             │            │
│           └──────── localStorage ───────┘            │
│                    (Incidents[])                     │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │              src/data.ts                     │   │
│  │  getIncidents · saveIncident · markResolved  │   │
│  │  analyzeUserImage · compressImage            │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

No backend · No database · No auth · Works offline
```

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React 19 + Vite 8 | Fast HMR, tiny production bundle |
| Language | TypeScript 7 | Type-safe across all data models |
| Styling | Tailwind CSS v4 | Utility-first, mobile-first responsive |
| Icons | Lucide React | Clean, consistent civic UI |
| Routing | React Router DOM v7 | SPA navigation with basename support |
| Persistence | Browser localStorage | Zero-backend MVP, works offline |
| Build/Deploy | Vite + gh-pages | One command to ship |
| Hosting | GitHub Pages | Free, fast, zero ops |

---

## 🚀 Running Locally

```bash
# 1. Clone
git clone https://github.com/danivijay/nirmala-nagara.git
cd nirmala-nagara

# 2. Install
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173/nirmala-nagara/

# 4. Production build
npm run build

# 5. Deploy to GitHub Pages
npm run deploy
```

---

## 🎯 Demo Walkthrough

1. Open **http://localhost:5173/nirmala-nagara/report**
2. Click the **"Construction Debris"** sample card — image loads instantly
3. Select **"Koramangala"** from the locality dropdown
4. Click **"Analyze Image"** — results appear: *Large / High / Tipper Truck*
5. Click **"Submit Report"** → success screen shown
6. Navigate to the **Dashboard** → incident card visible with Pending status
7. Click **"Mark Resolved"** → counters update live
8. Refresh the page → all data persists ✓

---

## 🔭 Vision: The Fully Automated Clean City

> *What you see today is 1% of what this platform is designed to become.*

Nirmala Nagara is built as a foundation for a **city-wide autonomous civic intelligence system**. Here's the roadmap:

---

### 🚗 Phase 2 — Autonomous Camera Surveillance

**Problem:** Most garbage dumps happen at night or in blind spots. Manual reporting misses 90% of incidents.

**Solution:** Mount low-cost cameras on BMTC buses, BBMP waste collection trucks, and traffic poles. As vehicles move through the city, they continuously stream footage into the Nirmala Nagara AI pipeline.

```
Bus camera → Frame extraction every 5s
           → Object detection (garbage detected? yes/no)
           → If yes: GPS stamp + photo → auto-report created
           → Dashboard alert fired → Nearest vehicle dispatched
```

- No human involvement needed
- City-wide coverage 24/7
- Each bus becomes a rolling inspection unit
- Illegal night-dumping finally caught on record

---

### 🧠 Phase 3 — Computer Vision AI Engine

Replace the demo-mode classification with a real trained model:

| Capability | Technology |
|---|---|
| Garbage detection | YOLOv8 / Gemini Vision / GPT-4o |
| Size estimation | Depth estimation from monocular camera |
| Waste category | Fine-tuned image classifier (12 classes) |
| Severity scoring | Multi-factor model (size + category + location history) |
| Auto-dispatch | Nearest available vehicle routing (OSRM/Google Maps API) |

---

### 🔢 Phase 4 — Vehicle Number Plate Recognition

**Problem:** Illegal dumping is rampant and goes unpunished. Perpetrators know there are no consequences.

**Solution:** When a camera captures a vehicle illegally dumping waste:

```
Dump detected → License plate extracted (OCR)
              → Cross-referenced with RTO database
              → Penalty notice auto-generated
              → Owner notified via registered mobile
              → Evidence package sent to traffic police
```

- Real deterrence — not just cleanup, but prevention
- Integrates with Karnataka's Parivahan/Vahan APIs
- Challan issued automatically, no manual review needed

---

### 🏛 Phase 5 — Multi-Department Civic Platform

Nirmala Nagara's reporting engine is **not limited to garbage**. The same photo-upload → AI-classify → dispatch workflow applies to every civic problem:

| Department | Problem Type | AI Detection | Dispatch To |
|---|---|---|---|
| **BBMP** | Garbage dumps | Waste object detection | Sanitation vehicle |
| **PWD** | Potholes | Road surface analysis | Road repair crew |
| **BWSSB** | Water pipe leakage | Wet surface + flow detection | Plumbing team |
| **BESCOM** | Fallen power lines | Wire detection + danger zone | Emergency electrical |
| **BBMP Parks** | Overgrown vegetation | Greenery overgrowth model | Horticulture team |
| **Traffic Police** | Illegal parking | Vehicle + zone detection | Tow truck |
| **BBMP Drains** | Storm drain blockage | Water stagnation detection | Drain clearing team |

**One platform. Every civic department. Every problem.**

---

### 📊 Phase 6 — City Intelligence Dashboard

A real-time **smart city command centre** for BBMP leadership:

```
┌─────────────────────────────────────────────────────────┐
│          NIRMALA NAGARA — CITY COMMAND CENTRE           │
├──────────────┬──────────────────────────────────────────┤
│ LIVE MAP     │  Ward 42 (Koramangala): 7 active reports │
│ Heat map of  │  Ward 18 (Whitefield): 12 active reports │
│ all active   │  Ward 91 (Hebbal): 3 active reports      │
│ incidents    ├──────────────────────────────────────────┤
│              │  FLEET TRACKER                           │
│ 🔴 High      │  Truck KA-01-B-1234 → Assigned Ward 42  │
│ 🟡 Medium    │  Handcart #22 → En route Indiranagar     │
│ 🟢 Low       │  Mini pickup #07 → Idle (Yeshwanthpur)  │
├──────────────┴──────────────────────────────────────────┤
│ TODAY: 342 reports · 289 resolved · 53 pending          │
│ AVG RESPONSE TIME: 1h 42m (↓ 23% from last week)       │
└─────────────────────────────────────────────────────────┘
```

- Ward-level performance benchmarking
- Sanitation worker efficiency tracking
- Monthly trend reports for BBMP council
- Citizen satisfaction scores (post-resolution SMS survey)
- Budget allocation insights based on incident density

---

### 🌐 Phase 7 — Open Civic API

Open the platform so **NGOs, RWAs, and other cities** can integrate:

```json
POST /api/v1/incidents
{
  "city": "bengaluru",
  "ward": 42,
  "coordinates": [12.9716, 77.5946],
  "image_url": "...",
  "reported_by": "citizen_app"
}
```

- Any third-party app (Resident Welfare Associations, Swachhata apps) can submit incidents
- Other Indian cities can self-host or use the cloud API
- Open dataset of resolved incidents for researchers and urban planners

---

## 🤝 Contributing

This is an open civic project. Contributions welcome:

- 🐛 Bug reports via GitHub Issues
- 🎨 UI/UX improvements
- 🤖 AI model integrations (Gemini Vision, GPT-4o, local YOLO)
- 🗺️ New city support
- 🌐 Kannada / other language translations

---

## 📄 License

MIT © 2026 Nirmala Nagara Contributors

---

<div align="center">

**Built with ❤️ for Bengaluru — and every city that deserves better.**

*Nirmala Nagara means "Clean City" in Kannada.*

</div>
