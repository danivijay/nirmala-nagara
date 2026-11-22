# 🌿 Nirmala Nagara

> **Clean Bengaluru. Smarter Action.**

A civic web application enabling Bengaluru residents to photograph and report roadside garbage, with AI-assisted classification and an authority dashboard for real-time incident management.

---

## 🚨 Problem Statement

Bengaluru generates thousands of tonnes of solid waste daily. Despite BBMP's collection infrastructure, roadside garbage dumping remains rampant — often going unreported or misrouted because reports don't carry enough structured information for dispatchers to allocate the right cleanup vehicle.

Citizens need a **zero-friction way to report garbage**. Authorities need **structured, actionable data** — not unstructured text complaints.

---

## 💡 Proposed Solution

Nirmala Nagara lets any citizen:
1. Upload a photograph of roadside garbage
2. Have it **automatically classified** (size, category, severity)
3. Receive a **vehicle recommendation** (handcart / mini pickup / tipper truck)
4. Submit a structured **incident report** in one tap

Municipal authorities get a **live dashboard** where they can view all pending reports and mark incidents resolved — keeping the city's cleanup pipeline transparent and accountable.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────┐
│                   Browser (SPA)                  │
│                                                  │
│  /report                      /dashboard         │
│  ┌────────────────┐           ┌───────────────┐  │
│  │ Citizen Report │           │  Authority    │  │
│  │ Page           │           │  Dashboard    │  │
│  │                │           │               │  │
│  │ 1. Upload img  │           │ • Stats cards │  │
│  │ 2. Classify    │           │ • Incident    │  │
│  │ 3. Pick locale │           │   cards       │  │
│  │ 4. Submit      │           │ • Mark        │  │
│  └───────┬────────┘           │   Resolved    │  │
│          │                    └───────┬───────┘  │
│          └──── localStorage ──────────┘          │
└──────────────────────────────────────────────────┘

No backend · No database · No auth required
```

---

## ✨ Features

### Citizen Reporting (`/report`)
- 📷 Upload JPG/PNG or choose a **sample demo scenario**
- 🗺️ Select Bengaluru locality from a dropdown (24 areas)
- 🤖 **Demo-mode AI analysis** for sample images with pre-classified results
- 🏷️ Manual classification for user-uploaded images (category + size)
- ✅ Editable analysis results before submission
- 💾 Saves incident to `localStorage` instantly
- 🎉 Success screen with quick navigation

### Authority Dashboard (`/dashboard`)
- 📊 Summary stats: Total / Pending / Resolved
- 🗂️ Incident cards with image, location, size, severity, vehicle
- ✅ **Mark Resolved** button — updates status immediately
- 🔄 Persists across page refreshes

### Classification Logic
| Size   | Severity | Vehicle        |
|--------|----------|----------------|
| Small  | Low      | Handcart       |
| Medium | Medium   | Mini pickup    |
| Large  | High     | Tipper truck   |

*Prototype recommendations — not official municipal guidelines.*

---

## 🛠 Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Framework    | React 19 + Vite 8                 |
| Language     | TypeScript 7                      |
| Styling      | Tailwind CSS v4                   |
| Icons        | Lucide React                      |
| Routing      | React Router DOM v7               |
| Persistence  | Browser localStorage              |
| Build        | Vite (production build ~290 KB)   |
| Deployment   | GitHub Pages / Vercel             |

---

## 🚀 Running Locally

```bash
# Clone
git clone https://github.com/danivijay/nirmala-nagara.git
cd nirmala-nagara

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
npm run preview
```

---

## 🌐 Live Application

**[https://danivijay.github.io/nirmala-nagara](https://danivijay.github.io/nirmala-nagara)**

---

## 🎯 Demo Walkthrough

1. **Open** the app → auto-redirected to `/report`
2. **Select a sample** scenario (e.g. "Construction Debris") to instantly load a pre-classified image
3. **Choose a locality** (e.g. Koramangala) from the dropdown
4. **Click "Analyze Image"** — results appear with size, severity, vehicle recommendation
5. **Click "Submit Report"** → success screen shown
6. **Open Dashboard** (`/dashboard`) → see your report with Pending status
7. **Click "Mark Resolved"** → status updates and stats counters change
8. **Refresh the page** → data persists via localStorage

---

## 🔭 Future Scope

- **Video upload & frame analysis** — detect illegal dumping events from CCTV footage
- **AI image recognition** — real-time garbage detection using vision models (GPT-4o, Gemini Vision)
- **Vehicle number-plate recognition** — identify illegal dumping vehicles
- **GPS/Map integration** — show incident heat-maps across BBMP wards
- **Municipal API integration** — push reports directly into BBMP's dispatch system
- **Multi-city support** — extend to other Indian metros
- **Push notifications** — alert nearby residents of active cleanup
- **Civic score / gamification** — reward frequent reporters

---

## 📄 License

MIT © 2026 Nirmala Nagara Contributors
