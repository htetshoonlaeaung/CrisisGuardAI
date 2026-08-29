# 🛡️ CrisisGuard AI — Skills & Engineering Blueprint

> **Version:** 3.1.0  
> **Tech Stack:** Python FastAPI • Neon PostgreSQL • SWI-Prolog + PySwip • React 18 • TypeScript • Tailwind CSS  
> **Status:** Integrated Frontend & Backend

---

## 1. System Overview

**CrisisGuard AI** is a safety-critical, explainable decision support system for emergency triage and disaster management. It uses deterministic Symbolic AI (SWI-Prolog Horn-clause rules and CLP(FD) constraint solving) to guarantee that every recommendation is logically proven, fully traceable, and sub-millisecond fast.

---

## 2. Core Engineering Principles

1. **Deterministic Logic Over Probabilistic Predictions**:
   - Critical life-safety actions must never hallucinate. Every triage recommendation is derived from deterministic rules and constraints.
2. **Explicit Safety Invariants & Prohibitions**:
   - Every emergency outcome explicitly outputs forbidden actions (e.g. *"NEVER pour water on electrical or grease fires"*).
3. **Explainable AI (XAI) Proof Trees**:
   - Decisions trace back to concrete observations and deduction steps.
4. **Sub-Millisecond Evaluation Latency**:
   - Logic evaluations execute with minimal overhead (< 5ms).

---

## 3. Architecture (One-Glance)

```
React Frontend (Port 3000) ──REST JSON──▶ FastAPI Backend (Port 8000)
                                            ├── API Endpoints (crisis, sessions, shelters, scheduler, health)
                                            ├── Service Layer (triage, shelter, dispatch)
                                            ├── Prolog Engine Bridge (thread-safe PySwip singleton)
                                            │     └── Knowledge Base (.pl files: medical, fire, disaster, road)
                                            └── Async DB Layer (SQLAlchemy → Neon PostgreSQL)
```

---

## 4. Emergency Domains & Evaluation Rules

| Domain | Key Invariants | Prohibitions | Severity Range |
|---|---|---|---|
| **Medical** | Airway, Breathing, Circulation (ABC) checks | Do NOT give oral fluids to unconscious | CRITICAL, HIGH, MODERATE, LOW |
| **Fire & Hazard** | Evacuation vs shelter-in-place based on toxic smoke/electrical | NEVER use water on Class C/K fires | EVACUATE_IMMEDIATE, HAZARD_CONTAINED |
| **Natural Disaster** | Structural integrity & high ground protocols | Avoid downed power lines, damaged bridges | SHELTER_IN_PLACE, RELOCATE_SAFE_ZONE |
| **Road & Traffic** | Scene safety, hazard lights, spinal immobilization | Do NOT move injured unless immediate fire risk | IMMOBILIZE_SCENE, CAUTION_CLEAR |

---

## 5. Testing & Verification

1. **Rule Invariant Verification**: All safety invariants are tested against deterministic scenarios.
2. **Frontend UI Checks**: `npm run lint` and `npm run build` verify all TypeScript types and components.
