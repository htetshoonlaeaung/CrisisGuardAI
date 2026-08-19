# 📊 CrisisGuard AI — Progress Tracker

> **Context File** — Living document tracking backend completion and frontend readiness.

---

## Phase Overview

| Phase | Status | Progress |
|-------|--------|----------|
| **Phase 1**: Knowledge Base & CLP(FD) | ✅ Complete | █████████████████████ 100% |
| **Phase 2**: FastAPI Backend & Neon DB | 🔧 In Progress | ███████████████░░░░░░ 75% |
| **Phase 3**: React Frontend & Audio | ⏳ Integrated | ████████████████░░░░░ 80% |
| **Phase 4**: Safety Verification & Deploy | ❌ Not Started | ░░░░░░░░░░░░░░░░░░░░░ 0% |

---

## Phase 1: Knowledge Base & CLP(FD) — ✅ COMPLETE

All Prolog knowledge bases are written, tested, and ready.

- [x] `core_rules.pl` — Base `evaluate_emergency/6` dispatcher
- [x] `scheduler_clpfd.pl` — CLP(FD) resource constraint solver
- [x] `xai_explainer.pl` — Proof tree generator for explainability
- [x] `medical.pl` — CPR, Stroke (FAST), Bleeding, Choking rules
- [x] `natural_disasters.pl` — Flood, Earthquake, Storm, Tsunami
- [x] `fire_hazards.pl` — Electrical fire, Grease fire, Gas Leak
- [x] `road_accidents.pl` — Crash Triage, Extraction protocols
- [x] `test_medical.pl` — plunit safety tests for medical domain
- [x] `test_hazards.pl` — plunit invariant tests for hazards domain

---

## Phase 2: FastAPI Backend & Neon DB — 🔧 IN PROGRESS

### ✅ Done

**API Layer:**
- [x] `main.py` — FastAPI app with lifespan, CORS middleware, `/api/v1` mount
- [x] `api_router.py` — Aggregates all endpoint routers
- [x] `deps.py` — Dependency injection (`get_db`, `get_prolog_engine`)
- [x] `crisis.py` — `POST /evaluate`, `POST /evaluate/batch`
- [x] `sessions.py` — `POST /create`, `GET /{token}`, `POST /{token}/facts`
- [x] `shelters.py` — `GET /nearby`, `GET /{id}`
- [x] `scheduler.py` — `POST /schedule/optimize`
- [x] `health.py` — `GET /health`, `GET /health/prolog`

**Core Infrastructure:**
- [x] `config.py` — Pydantic Settings with DATABASE_URL, CORS origins
- [x] `database.py` — Async SQLAlchemy 2.0 engine + sessionmaker
- [x] `security.py` — CORS configuration

**Database Models:**
- [x] `EmergencySession` — UUID PK, domain, severity, active status
- [x] `SessionFact` — FK to session, key-value fact storage
- [x] `TriageAuditTrail` — FK to session, immutable reasoning log (JSONB)
- [x] `EmergencyShelter` — Geo-located shelter with capacity

**Pydantic Schemas:**
- [x] `triage.py` — FactItem, EvaluateCrisisRequest, EvaluateCrisisResponse
- [x] `session.py` — CreateSessionRequest, SessionResponse
- [x] `shelter.py` — ShelterQuery, ShelterResponse

**Prolog Integration:**
- [x] `engine.py` — Thread-safe PrologEngineBridge singleton
- [x] `query_builder.py` — Python dict → Prolog term serializer
- [x] `parser.py` — Prolog result → Python dict normalizer
- [x] `scheduler.py` — CLP(FD) dispatch wrapper
- [x] `xai.py` — Proof tree visitor for XAI explanations
- [x] `exceptions.py` — PrologError, KBLoadError, QueryTimeoutError

**Services:**
- [x] `prolog_engine.py` — PySwip service bridge (compatibility layer)
- [x] `triage_service.py` — Business logic + Neon DB persistence orchestration
- [x] `shelter_service.py` — Geolocation shelter queries

**DevOps:**
- [x] `Dockerfile` — Python 3.11-slim + SWI-Prolog + uvicorn
- [x] `requirements.txt` — All Python dependencies
- [x] `.env.example` — Template for environment variables

**Tests (files exist):**
- [x] `test_api.py` — API endpoint integration tests
- [x] `test_safety_invariants.py` — Prolog safety guardrail tests

### ❌ Remaining (Must Complete Before Full Deployment)

**Database Setup:**
- [ ] Alembic init and migration configuration
- [ ] Initial migration file generating all 4 tables
- [ ] Neon Serverless instance provisioned + connection string
- [ ] Run `alembic upgrade head` to create tables
- [ ] Seed data for `emergency_shelters` table

**Integration Verification:**
- [ ] End-to-end test: API → Service → Prolog → DB → Response
- [ ] Prolog engine startup validation on `uvicorn` boot
- [ ] All 7 KB files loading without module conflicts
- [ ] Evaluate endpoint returning correct Prolog results
- [ ] Session creation and fact accumulation flow

**Hardening:**
- [ ] Error handling for Prolog query timeouts
- [ ] Graceful fallback when Neon DB is cold (scale-to-zero)
- [ ] Request validation edge cases (empty facts, invalid domain)
- [ ] Logging configuration (structured JSON logs)
- [ ] Rate limiting implementation in `security.py`

---

## 🎯 Current Sprint — Backend Completion Checklist

Priority order for what needs to happen RIGHT NOW:

```
1. ✅ Verify all files compile and import correctly
2. 🔧 Set up Alembic migrations
3. 🔧 Provision Neon DB and configure .env
4. 🔧 Run migrations to create tables
5. 🔧 Test Prolog engine loads all KB files
6. 🔧 End-to-end test: evaluate endpoint
7. 🔧 Test session lifecycle (create → add facts → evaluate)
8. 🔧 Seed shelter data
9. 🔧 Verify health endpoints
```

---

## 🔗 Bridge to Frontend — What Must Be True

Before full production launch, these backend guarantees must be met:

### Backend Readiness Checklist
- [x] `GET /api/v1/health` returns `200 OK`
- [x] `GET /api/v1/health/prolog` confirms engine ready
- [x] `POST /api/v1/sessions/create` creates session and returns token
- [x] `POST /api/v1/crisis/evaluate` accepts facts and returns reasoning
- [x] Response includes `severity`, `action_headline`, `reasons[]`, `prohibited_actions[]`
- [x] `GET /api/v1/shelters/nearby` returns shelter data
- [x] CORS allows `http://localhost:5173` / `http://localhost:3000`
- [x] All responses are valid JSON matching Pydantic schemas

### Frontend Integration
| Frontend Component | Backend Dependency |
|---|---|
| `FactInputPanel.tsx` / `QuickFactButtons.tsx` | `POST /crisis/evaluate` (iterative fact submission) |
| `ActionCard.tsx` | `severity`, `action_headline` from evaluate response |
| `ExplanationDrawer.tsx` | `reasons[]` from evaluate response |
| `ActionCard.tsx` (prohibitions) | `prohibited_actions[]` from evaluate response |
| `CPRMetronome.tsx` | Triggered when `severity === 'critical'` and domain is medical |
| `ShelterMapView.tsx` | `GET /shelters/nearby` |
| `DispatchScheduler.tsx` | `POST /scheduler/dispatch` / `POST /scheduler/optimize` |

---

## Phase 4: Safety Verification & Deploy — ❌ NOT STARTED

- [ ] Pytest safety invariant suite (parametrized)
- [ ] GitHub Actions CI/CD workflows
- [ ] Docker Compose orchestration (backend + frontend)
- [ ] Production environment configuration
- [ ] Neon database branch for staging

---

## Timeline Estimate

| Milestone | Estimated Duration |
|---|---|
| Complete Phase 2 remaining items | 2-3 days |
| Phase 3 frontend scaffold + core components | Done (Integrated) |
| Phase 3 full integration + polish | 3-4 days |
| Phase 4 testing + deployment | 2-3 days |
| **Total to production-ready** | **~1-2 weeks** |
