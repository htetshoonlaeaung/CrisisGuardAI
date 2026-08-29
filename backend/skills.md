# 🛡️ CrisisGuard AI — Skills & System Overview

> **Version:** 3.1.0  
> **Architecture:** Single FastAPI Backend + React Frontend  
> **Status:** Backend Phase 2 in progress → Frontend Phase 3 integrated  

---

## What Is CrisisGuard AI?

A **safety-critical, explainable decision support system** for emergency response. Uses deterministic Symbolic AI (SWI-Prolog) — not neural networks — to guarantee every recommendation is logically proven and fully traceable.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript + Tailwind CSS + Vite |
| **Backend API** | FastAPI (Python 3.11+) + Pydantic v2 |
| **Reasoning Engine** | SWI-Prolog via PySwip + CLP(FD) — embedded in-process |
| **Database** | PostgreSQL on Neon Serverless (Async SQLAlchemy 2.0 + asyncpg) |
| **Containerization** | Docker + Docker Compose |

---

## Architecture (One-Glance)

```
React Frontend (Port 3000) ──REST JSON──▶ FastAPI Backend (Port 8000)
                                            ├── API Endpoints (crisis, sessions, shelters, scheduler, health)
                                            ├── Service Layer (triage, shelter, dispatch)
                                            ├── Prolog Engine Bridge (thread-safe PySwip singleton)
                                            │     └── Knowledge Base (.pl files: medical, fire, disaster, road)
                                            └── Async DB Layer (SQLAlchemy → Neon PostgreSQL)
```

---

## Context Files (Detailed References)

All backend details are split into dedicated context files:

| File | Contents |
|------|----------|
| [**structure.md**](./structure.md) | Directory layout, clean architecture layers, data flow diagrams, frontend integration points |
| [**progress.md**](./progress.md) | Phase tracking, completion checklists, current sprint, bridge-to-frontend checklist |
| [**prolog.md**](./prolog.md) | Knowledge base rules, PySwip bridge, CLP(FD) scheduler, XAI proof trees, adding new domains |
| [**database.md**](./database.md) | PostgreSQL schema, ER diagram, ORM models, Neon config, migration setup, query patterns |
| [**api.md**](./api.md) | All REST endpoints, request/response examples, Pydantic schemas, TypeScript types, frontend integration guide |
| [**debugging.md**](./debugging.md) | Troubleshooting, common errors, dev setup, environment variables, log analysis, frontend connection debugging |

---

## Crisis Domains (4 Active)

| Domain | Prolog Module | Key Rules |
|--------|--------------|-----------|
| **Medical** | `medical_kb` | Cardiac arrest → CPR, Choking → Heimlich, Bleeding → Tourniquet, Stroke → FAST dispatch |
| **Fire Hazards** | `hazards_kb` | Electrical fire → CO2 (NEVER water), Grease fire → Metal lid (NEVER water), Gas leak |
| **Natural Disasters** | `disasters_kb` | Flood, Earthquake, Storm, Tsunami evaluation protocols |
| **Road Accidents** | `road_kb` | Crash triage, Vehicle extraction, Traffic control |

---

## Safety Invariants (Non-Negotiable)

These rules are **hardcoded in Prolog** and **verified by automated tests**:

- ❌ **NEVER** recommend water on an electrical fire
- ❌ **NEVER** recommend water on a grease/oil fire  
- ❌ **NEVER** recommend aspirin for suspected stroke (could be hemorrhagic)
- ✅ **ALWAYS** fallback to "call emergency services immediately" on any error
- ✅ **ALWAYS** provide `prohibited_actions[]` with every recommendation
- ✅ **ALWAYS** persist an immutable audit trail for every evaluation

---

## Key API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/v1/crisis/evaluate` | Submit facts → Prolog reasoning → action + severity |
| `POST` | `/api/v1/sessions/create` | Start new emergency session |
| `GET` | `/api/v1/sessions/{token}` | Get session with facts + audit history |
| `GET` | `/api/v1/shelters/nearby` | Find open shelters by location |
| `POST` | `/api/v1/scheduler/optimize` | CLP(FD) rescue team assignment |
| `GET` | `/api/v1/health` | Backend status |
| `GET` | `/api/v1/health/prolog` | Prolog engine status |

> Full request/response specs → [api.md](./api.md)

---

## Database (4 Tables)

| Table | Purpose |
|-------|---------|
| `emergency_sessions` | One per emergency interaction (UUID, domain, severity) |
| `session_facts` | Append-only key-value facts per session |
| `triage_audit_trails` | Immutable log of every Prolog evaluation (JSONB) |
| `emergency_shelters` | Geo-located shelters with capacity |

> Full schema + ER diagram → [database.md](./database.md)

---

## Frontend Plan & Integration

The React frontend connects to the backend through these components:

| Component | Backend Dependency |
|-----------|-------------------|
| `QuestionWizard.tsx` | `POST /crisis/evaluate` (iterative fact submission) |
| `ActionCard.tsx` | `severity` + `action_headline` from evaluate response |
| `ExplanationDrawer.tsx` | `reasons[]` from evaluate response |
| `ProhibitedActions.tsx` | `prohibited_actions[]` from evaluate response |
| `CPRMetronome.tsx` | Triggered when severity=critical + medical domain |
| `EmergencyDialer.tsx` | Static 1-tap 199/191/192 (no API call) |
| `useCrisisStore.ts` | Zustand store consuming evaluate responses |
| `api.ts` | Axios / Fetch client → `http://localhost:8000/api/v1` |

**Design System:** High-contrast emergency colors — `bg-red-600` (critical), `bg-amber-600` (high), `bg-yellow-500` (moderate), `bg-emerald-600` (stable). Single-handed accessibility. Bottom-anchored response chips.

---

## Implementation Roadmap

| Phase | Status | Key Deliverables |
|-------|--------|-----------------|
| **1. Knowledge Base** | ✅ Done | All `.pl` rule files + plunit tests |
| **2. FastAPI Backend** | 🔧 Current | API endpoints, services, DB models, Prolog bridge — *needs: Alembic, Neon connection, integration tests* |
| **3. React Frontend** | ⏳ Integrated | Dashboard, wizard, CPR metronome, voice guidance, Zustand, API client |
| **4. Safety & Deploy** | ❌ Later | Pytest guardrails, GitHub Actions, Docker Compose |

> Full phase breakdown → [progress.md](./progress.md)

---

## Quick Start

```bash
cd backend
pip install -r requirements.txt
# Set DATABASE_URL in .env
uvicorn app.main:app --reload --port 8000
# http://localhost:8000/docs
```

> Full setup + troubleshooting → [debugging.md](./debugging.md)

---

> **CrisisGuard AI Standard**: *Every recommendation is deterministically proven, fully explainable, safely audited, and designed to save lives.*
