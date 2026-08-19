# 🏛️ CrisisGuard AI — System Architecture & Structure

This document provides a clean structural map of the codebase to help contributors and teammates understand and extend the system quickly.

---

## 📂 Directory Layout

```text
├── server.ts                             # Unified Express + Vite development and production server
├── index.html                            # HTML entry point with Amber palette & error filters
├── vite.config.ts                        # Vite bundler configuration with Tailwind 4 integration
├── metadata.json                         # Platform applet metadata & permissions
├── README.md                             # Project overview & quickstart
├── STRUCTURE.md                          # Architecture & folder organization (this document)
├── skills.md                             # Engineering blueprint & logic extension guide
│
├── src/
│   ├── main.tsx                          # React DOM mounting & root initialization
│   ├── App.tsx                           # Root application layout, view switcher & state
│   ├── index.css                         # Global CSS tokens (Amber theme, skeuomorphic styles)
│   ├── types.ts                          # Shared TypeScript interfaces, types & enums
│   │
│   ├── context/
│   │   └── ThemeContext.tsx              # Dark / Light / Alert mode theme state provider
│   │
│   ├── services/
│   │   └── api.ts                        # Typed client-side REST API service wrapper
│   │
│   ├── utils/
│   │   ├── cn.ts                         # Tailwind class merge utility (clsx + tailwind-merge)
│   │   ├── severityColor.ts              # Severity badge styling & color tokens
│   │   └── humanizeAction.ts             # Snake_case to clean display text formatter
│   │
│   ├── data/
│   │   └── quickFacts.ts                 # Pre-configured crisis presets for instant testing
│   │
│   ├── server/                           # Backend services executed inside server.ts
│   │   ├── ruleEngine.ts                 # First-order logic Horn-clause engine & CLP(FD) solver
│   │   └── database.ts                   # In-memory session store, audit logger & shelter DB
│   │
│   └── components/
│       ├── ui/
│       │   └── HapticButton.tsx          # 3D tactile skeuomorphic button component
│       │
│       └── emergency/
│           ├── SessionStatusBar.tsx      # Top header with session token, latency & domain tag
│           ├── CollapsibleSidebar.tsx    # Left navigation taskbar with collapse/expand
│           ├── FactInputPanel.tsx        # Dynamic key-value fact assertion & domain picker
│           ├── QuickFactButtons.tsx      # Mobile & desktop tactile preset buttons
│           ├── ActionCard.tsx            # Primary triage directive card with red prohibitions
│           ├── SeverityBadge.tsx         # Color-coded triage severity badge
│           ├── CPRMetronome.tsx          # 110 BPM Web Audio synthesizer & visual heart pulse
│           ├── ExplanationDrawer.tsx     # XAI proof tree modal with interactive nodes
│           ├── ShelterMapView.tsx        # Geolocation shelter locator & Haversine distance
│           ├── DispatchScheduler.tsx     # CLP(FD) constraint solving fleet dispatcher
│           ├── AuditTrailPanel.tsx       # Searchable chronological inference audit trail
│           └── StatusScreen.tsx          # System health check & compiled rulebase monitor
```

---

## 🔄 Core Data & State Flow

```mermaid
graph TD
    User([User / First Responder]) -->|1. Assert Facts / Select Preset| FactInputPanel
    FactInputPanel -->|2. POST /api/v1/crisis/evaluate| APIService[src/services/api.ts]
    APIService -->|3. HTTP Request| ExpressServer[server.ts]
    ExpressServer -->|4. evaluate()| RuleEngine[src/server/ruleEngine.ts]
    ExpressServer -->|5. recordAudit()| Database[src/server/database.ts]
    RuleEngine -->|6. Severity, Actions, Proof Tree| ExpressServer
    ExpressServer -->|7. JSON Response| AppState[App.tsx State]
    AppState -->|8. Render Directive & Prohibitions| ActionCard
    AppState -->|9. Inspect Proof Logic| ExplanationDrawer
    AppState -->|10. Launch 110 BPM Rhythm| CPRMetronome
```

---

## 📡 REST API Specifications

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Verifies system health, engine status, and runtime latency. |
| `POST` | `/api/v1/crisis/evaluate` | Evaluates crisis facts against domain knowledge bases. Returns actions, prohibitions, and XAI proof trees. |
| `GET` | `/api/v1/sessions/:token` | Retrieves active session state and accumulated facts. |
| `GET` | `/api/v1/sessions/:token/audit` | Retrieves chronological evaluation history for a session. |
| `GET` | `/api/v1/audit/all` | Retrieves global immutable audit trail logs. |
| `GET` | `/api/v1/shelters/nearby` | Queries shelters within radius (km) using Haversine calculation. |
| `POST` | `/api/v1/scheduler/dispatch` | Solves rescue team assignments using CLP(FD) constraint logic. |

---

## 🎨 Color Tokens & Aesthetic Guidelines

- **Primary Accent (Amber/Gold)**:
  - Base: `#FFAB00` (`var(--accent-primary)`)
  - Glow / Hover: `#FFD000` (`var(--accent-glow)`)
  - Inset / Active: `#FF8F00` (`var(--accent-hover)`)
  - Subtle Tint: `rgba(255, 171, 0, 0.12)`
- **Alert & Critical Prohibitions (Red)**:
  - Primary Red: `#EF4444` (`var(--alert-red)`)
  - Red Surface: `rgba(239, 68, 68, 0.12)`
- **Dark Mode Backgrounds**:
  - Main Canvas: `#090909` (`var(--bg-canvas)`)
  - Surface Card: `#111111` (`var(--bg-surface)`)
  - Card Elevated: `#161616` (`var(--bg-elevated)`)
  - Border: `#2A2A2A` (`var(--border-subtle)`)
- **Light Mode Backgrounds**:
  - Canvas: `#F4F6F9`, Surface: `#FFFFFF`, Border: `#E4E4E7`

---

## 🧩 Adding New Features

1. **New UI View**:
   - Create your component in `src/components/emergency/MyView.tsx`.
   - Add the view identifier to `App.tsx`'s `activeView` state union (`'triage' | 'shelters' | 'scheduler' | 'audit' | 'status' | 'myview'`).
   - Add an icon and tab item to `src/components/emergency/CollapsibleSidebar.tsx`.

2. **New Emergency Rule or Domain**:
   - Register domain logic in `src/server/ruleEngine.ts` via `registerDomainEvaluator()`.
   - Add facts and quick presets to `src/data/quickFacts.ts`.
