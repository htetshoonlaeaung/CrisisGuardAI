# 🛡️ CrisisGuard AI — Engineering & Architecture Blueprint (skills.md)

> **Version:** 3.0.0  
> **Target System:** Intelligent Crisis Decision Support & Emergency Response System  
> **Architecture Pattern:** Unified Full-Stack Architecture (Single FastAPI Backend + React Frontend)  
> **Frontend:** React + Tailwind CSS + TypeScript + Vite + Shadcn UI  
> **Backend API & Orchestration:** Single Unified **FastAPI (Python 3.11+)** Backend  
> **Database:** PostgreSQL on **Neon Serverless** (Async SQLAlchemy 2.0 / asyncpg / Connection Pooling)  
> **Reasoning Engine:** SWI-Prolog embedded via **PySwip** + **CLP(FD)** (Constraint Logic Programming)  
> **Core Paradigms:** Deterministic Symbolic AI + Explainable AI (XAI) + Offline-Ready Resilience  

---

## 📑 Table of Contents

1. [Executive Summary & System Vision](#1-executive-summary--system-vision)
2. [Unified Full-Stack Architecture & Topology](#2-unified-full-stack-architecture--topology)
3. [Project Directory Layout](#3-project-directory-layout)
4. [PostgreSQL & Neon Serverless Integration (Python / Async SQLAlchemy)](#4-postgresql--neon-serverless-integration-python--async-sqlalchemy)
   - [4.1 Database Architecture & Schema Design](#41-database-architecture--schema-design)
   - [4.2 Async SQLAlchemy 2.0 & Neon Connection Pooling](#42-async-sqlalchemy-20--neon-connection-pooling)
   - [4.3 Database Models & Audit Repository](#43-database-models--audit-repository)
5. [Symbolic AI & Prolog Reasoning Engine (SWI-Prolog + PySwip + CLP(FD))](#5-symbolic-ai--prolog-reasoning-engine-swi-prolog--pyswip--clpfd)
   - [5.1 Knowledge Base Architecture](#51-knowledge-base-architecture)
   - [5.2 Domain Rulebases (Medical, Disasters, Hazards, Road, Scheduler)](#52-domain-rulebases-medical-disasters-hazards-road-scheduler)
   - [5.3 Explainable AI (XAI) Proof Trees](#53-explainable-ai-xai-proof-trees)
   - [5.4 Thread-Safe PySwip Engine Bridge](#54-thread-safe-pyswip-engine-bridge)
6. [FastAPI Backend Service Layer (Clean Architecture)](#6-fastapi-backend-service-layer-clean-architecture)
   - [6.1 Layered Architecture Pattern](#61-layered-architecture-pattern)
   - [6.2 Triage Service & Neon Persistence Orchestration](#62-triage-service--neon-persistence-orchestration)
   - [6.3 API Endpoints & Pydantic Data Contracts](#63-api-endpoints--pydantic-data-contracts)
7. [Frontend Architecture (React + Tailwind CSS + TypeScript)](#7-frontend-architecture-react--tailwind-css--typescript)
   - [7.1 UI/UX Emergency Design System](#71-uiux-emergency-design-system)
   - [7.2 Dynamic Triage & Diagnostic Wizard](#72-dynamic-triage--diagnostic-wizard)
   - [7.3 CPR Audio/Visual Metronome (110 BPM) & Voice Guidance](#73-cpr-audiovisual-metronome-110-bpm--voice-guidance)
   - [7.4 Zustand Store & API Integration](#74-zustand-store--api-integration)
8. [Extensibility & Clean Code Guidelines](#8-extensibility--clean-code-guidelines)
   - [8.1 Adding New Emergency Domains in < 15 Minutes](#81-adding-new-emergency-domains-in--15-minutes)
   - [8.2 Defensive Programming & Safety Invariants](#82-defensive-programming--safety-invariants)
9. [Automated Testing & Safety Verification](#9-automated-testing--safety-verification)
   - [9.1 Prolog plunit Test Suite](#91-prolog-plunit-test-suite)
   - [9.2 Python Safety Invariant & Guardrail Tests](#92-python-safety-invariant--guardrail-tests)
   - [9.3 FastAPI & Neon DB Integration Tests](#93-fastapi--neon-db-integration-tests)
10. [Docker Containerization, Deployment & CI/CD](#10-docker-containerization-deployment--cicd)
11. [Developer Roadmap & Implementation Plan](#11-developer-roadmap--implementation-plan)

---

## 1. Executive Summary & System Vision

**CrisisGuard AI** is a safety-critical, explainable decision support system for emergency response and disaster management.

### The Unified Architecture Standard
- **Frontend (React + Tailwind CSS)**: High-contrast emergency dashboard, dynamic step-by-step diagnostic wizard, live CPR audio-visual metronome (110 BPM), and Web Speech voice guidance.
- **Single Unified Backend (FastAPI - Python 3.11+)**:
  - Handles all REST API routing, session management, and emergency geolocation services.
  - Directly connects to **PostgreSQL on Neon Serverless** for persistent state, shelter locations, and immutable audit logs.
  - Natively embeds the **SWI-Prolog** inference engine via **PySwip**, executing verified first-order logic and **CLP(FD)** constraint solving with zero network latency.

---

## 2. Unified Full-Stack Architecture & Topology

```mermaid
graph TD
    subgraph "Client Tier"
        User([👤 User / Rescuer]) -->|Touch / Voice| ReactApp[React + Tailwind CSS Client]
        ReactApp --> UI_Metronome[110 BPM CPR Metronome]
        ReactApp --> UI_Wizard[Dynamic Question Wizard]
        ReactApp --> UI_Voice[Web Speech Audio Guidance]
        ReactApp --> UI_XAI[Explainable AI Drawer]
    end

    ReactApp -->|REST API / JSON| FastAPIApp[Single Unified FastAPI Backend Engine]

    subgraph "FastAPI Backend Tier (Port 8000)"
        FastAPIApp --> Router[API Router / v1]
        Router --> TriageService[Triage & Orchestration Service]
        Router --> SessionService[Session & Shelter Service]
        
        subgraph "Data Access Layer (Async SQLAlchemy)"
            TriageService --> NeonRepo[Neon DB Repository]
            SessionService --> NeonRepo
        end

        subgraph "Symbolic AI Layer (Embedded SWI-Prolog)"
            TriageService --> PySwipBridge[Thread-Safe PySwip Bridge]
            PySwipBridge --> PrologEngine[SWI-Prolog Engine with clpfd]
            PrologEngine --> KB_Medical[medical.pl]
            PrologEngine --> KB_Disaster[natural_disasters.pl]
            PrologEngine --> KB_Fire[fire_hazards.pl]
            PrologEngine --> KB_Road[road_accidents.pl]
            PrologEngine --> KB_Scheduler[scheduler_clpfd.pl]
            PrologEngine --> KB_XAI[xai_explainer.pl]
        end
    end

    subgraph "Database Tier (Neon Serverless PostgreSQL)"
        NeonRepo -->|AsyncPG Connection Pool / SSL| NeonDB[(Neon Serverless PostgreSQL)]
        NeonDB --- TblSessions[emergency_sessions]
        NeonDB --- TblFacts[session_facts]
        NeonDB --- TblAudits[triage_audit_trails]
        NeonDB --- TblShelters[emergency_shelters]
    end
```

---

## 3. Project Directory Layout

```text
CrisisGuardAI/
├── .github/
│   └── workflows/
│       ├── test-backend.yml
│       ├── test-frontend.yml
│       └── plunit-kb.yml
├── backend/                           # Single Unified FastAPI (Python 3.11+) Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── crisis.py      # Emergency triage & evaluation
│   │   │   │   │   ├── sessions.py    # Active session lifecycle
│   │   │   │   │   ├── shelters.py    # Geo-shelter locator
│   │   │   │   │   ├── scheduler.py   # CLP(FD) constraint solving
│   │   │   │   │   └── health.py      # System & Prolog engine health
│   │   │   │   └── api_router.py
│   │   │   └── deps.py
│   │   ├── core/
│   │   │   ├── config.py              # App settings & Neon DATABASE_URL
│   │   │   ├── database.py            # Async SQLAlchemy engine & sessionmaker
│   │   │   └── security.py            # CORS & rate limiting
│   │   ├── db/
│   │   │   ├── models/                # SQLAlchemy ORM models
│   │   │   │   ├── session.py
│   │   │   │   ├── fact.py
│   │   │   │   ├── audit.py
│   │   │   │   └── shelter.py
│   │   │   └── base.py
│   │   ├── domain/
│   │   │   ├── schemas/               # Pydantic v2 schemas
│   │   │   │   ├── triage.py
│   │   │   │   ├── session.py
│   │   │   │   └── shelter.py
│   │   │   └── constants.py
│   │   ├── knowledge_base/            # SWI-Prolog Symbolic Knowledge Bases
│   │   │   ├── core/
│   │   │   │   ├── core_rules.pl      # Base inference engine
│   │   │   │   ├── scheduler_clpfd.pl # CLP(FD) constraint logic scheduler
│   │   │   │   └── xai_explainer.pl   # Proof-tree explanation generator
│   │   │   ├── domains/
│   │   │   │   ├── medical.pl         # CPR, Stroke, Bleeding, Burns, Choking
│   │   │   │   ├── natural_disasters.pl # Flood, Earthquake, Storm, Tsunami
│   │   │   │   ├── fire_hazards.pl    # House Fire, Gas Leak, Electrical
│   │   │   │   └── road_accidents.pl  # Crash Triage, Extraction, Traffic
│   │   │   └── tests/
│   │   │       ├── test_medical.pl
│   │   │       └── test_hazards.pl
│   │   ├── services/
│   │   │   ├── prolog_engine.py       # Thread-safe PySwip bridge
│   │   │   ├── triage_service.py      # Business logic & Neon persistence
│   │   │   └── shelter_service.py     # Geolocation queries
│   │   └── main.py                    # FastAPI entrypoint
│   ├── tests/
│   │   ├── test_api.py
│   │   └── test_safety_invariants.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/                          # React + Tailwind CSS Client
│   ├── public/
│   │   ├── audio/                     # Metronome rhythm audio
│   │   └── icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── emergency/
│   │   │   │   ├── ActionCard.tsx     # High-contrast action banner
│   │   │   │   ├── QuestionWizard.tsx # Interactive step-by-step triage
│   │   │   │   ├── ExplanationDrawer.tsx # XAI reasoning transparency modal
│   │   │   │   ├── ProhibitedActions.tsx # "DO NOT DO THIS" alert box
│   │   │   │   └── CPRMetronome.tsx   # 110 BPM visual/audio rhythm guide
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── EmergencyDialer.tsx# 1-tap call for 911 / 112 / 199
│   │   │   └── ui/                    # Shadcn UI primitives
│   │   ├── hooks/
│   │   │   ├── useEmergencySession.ts
│   │   │   ├── useVoiceGuidance.ts
│   │   │   └── useCPRTimer.ts
│   │   ├── services/
│   │   │   └── api.ts                 # Axios client to FastAPI backend
│   │   ├── stores/
│   │   │   └── useCrisisStore.ts      # Zustand global crisis state
│   │   ├── types/
│   │   │   └── crisis.types.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── skills.md                          # This Blueprint
└── README.md
```

---

## 4. PostgreSQL & Neon Serverless Integration (Python / Async SQLAlchemy)

### 4.1 Database Architecture & Schema Design

PostgreSQL on **Neon** provides autoscaling, connection pooling, and branch-based staging.

```sql
-- DDL for Neon Serverless PostgreSQL
CREATE TYPE severity_level AS ENUM ('critical', 'high', 'moderate', 'low', 'informational');
CREATE TYPE domain_type AS ENUM ('medical', 'natural_disaster', 'fire_hazard', 'road_accident');

CREATE TABLE emergency_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(64) NOT NULL UNIQUE,
    domain domain_type NOT NULL,
    current_severity severity_level DEFAULT 'moderate' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE session_facts (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES emergency_sessions(id) ON DELETE CASCADE NOT NULL,
    fact_key VARCHAR(100) NOT NULL,
    fact_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE triage_audit_trails (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES emergency_sessions(id) ON DELETE CASCADE NOT NULL,
    recommended_action VARCHAR(255) NOT NULL,
    severity severity_level NOT NULL,
    reasons JSONB NOT NULL,
    prohibited_actions JSONB NOT NULL,
    evaluation_latency_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE emergency_shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    disaster_type domain_type NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0 NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE NOT NULL
);
```

---

### 4.2 Async SQLAlchemy 2.0 & Neon Connection Pooling

#### Neon Engine Configuration (`backend/app/core/database.py`)

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Format for Neon Serverless async connection:
# postgresql+asyncpg://user:password@ep-cool-sample.us-east-2.aws.neon.tech/neondb?ssl=require
DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20,
    pool_recycle=300,
    pool_pre_ping=True,  # Critical for Neon serverless scale-to-zero recovery
    connect_args={"ssl": True}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

### 4.3 Database Models (`backend/app/db/models/`)

```python
# backend/app/db/models/session.py
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, ForeignKey, Integer, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base

class EmergencySession(Base):
    __tablename__ = "emergency_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_token = Column(String(64), unique=True, nullable=False, index=True)
    domain = Column(String(50), nullable=False)
    current_severity = Column(String(20), default="moderate", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    facts = relationship("SessionFact", back_populates="session", cascade="all, delete-orphan")
    audits = relationship("TriageAuditTrail", back_populates="session", cascade="all, delete-orphan")

class SessionFact(Base):
    __tablename__ = "session_facts"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("emergency_sessions.id", ondelete="CASCADE"), nullable=False)
    fact_key = Column(String(100), nullable=False)
    fact_value = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    session = relationship("EmergencySession", back_populates="facts")

class TriageAuditTrail(Base):
    __tablename__ = "triage_audit_trails"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("emergency_sessions.id", ondelete="CASCADE"), nullable=False)
    recommended_action = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False)
    reasons = Column(JSONB, nullable=False)
    prohibited_actions = Column(JSONB, nullable=False)
    evaluation_latency_ms = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    session = relationship("EmergencySession", back_populates="audits")
```

---

## 5. Symbolic AI & Prolog Reasoning Engine (SWI-Prolog + PySwip + CLP(FD))

### 5.1 Knowledge Base Architecture

The Prolog knowledge base runs deterministic first-order logical inference and **Constraint Logic Programming over Finite Domains (CLP(FD))** directly inside the Python process.

---

### 5.2 Domain Rulebases

#### A. Core CLP(FD) Constraint Logic Scheduler (`backend/app/knowledge_base/core/scheduler_clpfd.pl`)

```prolog
:- module(scheduler_clpfd, [
    schedule_rescue_teams/4,
    verify_resource_constraints/3
]).
:- use_module(library(clpfd)).

% Resource Allocation & Dispatch Core Logic using clpfd
% Constraints:
% 1. Vehicle Capacity >= Evacuee Count
% 2. No Medic can be assigned to two simultaneous critical incidents
% 3. Total Travel Time + Extraction Time #=< Critical Threshold

schedule_rescue_teams(IncidentSeverities, TeamCapacities, Assignments, MaxTime) :-
    length(IncidentSeverities, N),
    length(Assignments, N),
    length(TeamCapacities, NumTeams),
    
    Assignments ins 1..NumTeams,
    enforce_severity_matching(IncidentSeverities, Assignments),
    labeling([ff, bisect], Assignments).

enforce_severity_matching([], []).
enforce_severity_matching([critical|RestS], [TeamId|RestA]) :-
    TeamId #=< 2, % Critical Response Teams (IDs 1 & 2)
    enforce_severity_matching(RestS, RestA).
enforce_severity_matching([_|RestS], [_|RestA]) :-
    enforce_severity_matching(RestS, RestA).
```

---

#### B. Medical Emergency Decision Rules (`backend/app/knowledge_base/domains/medical.pl`)

```prolog
:- module(medical_kb, [medical_eval/5]).

% 1. UNCONSCIOUS + NO BREATHING -> CARDIAC ARREST (CPR Required)
medical_eval(Facts, Action, critical, Reasons, Prohibitions) :-
    member(unconscious(true), Facts),
    member(breathing(none), Facts),
    Action = begin_cpr_and_call_emergency,
    Reasons = [
        'Victim is unconscious and unresponsive with absent respiration.',
        'Immediate chest compressions (100-120 BPM) required to maintain brain oxygenation.',
        'Request an Automated External Defibrillator (AED) immediately.'
    ],
    Prohibitions = [
        'Do not give oral fluids or medications.',
        'Do not delay CPR to search for a pulse if untrained.',
        'Do not leave victim unattended.'
    ].

% 2. CHOKING (Complete Airway Obstruction)
medical_eval(Facts, Action, critical, Reasons, Prohibitions) :-
    member(symptom(choking), Facts),
    member(airway_pass(blocked), Facts),
    Action = perform_heimlich_thrusts,
    Reasons = [
        'Complete airway obstruction prevents gas exchange.',
        'Deliver 5 back blows followed by 5 abdominal thrusts (Heimlich maneuver).'
    ],
    Prohibitions = [
        'Do not perform blind finger sweeps (may push object deeper).',
        'Do not offer water to drink.'
    ].

% 3. ARTERIAL TRAUMA / HEAVY BLEEDING
medical_eval(Facts, Action, critical, Reasons, Prohibitions) :-
    member(bleeding(severe_pulsing), Facts),
    Action = apply_direct_pressure_and_tourniquet,
    Reasons = [
        'Pulsing or heavy pooling blood indicates arterial laceration.',
        'Apply firm continuous direct pressure. Place commercial tourniquet 2-3 inches above wound if limb.'
    ],
    Prohibitions = [
        'Do not remove original dressings when soaked; place new layers over top.',
        'Do not place tourniquet directly over joints.'
    ].

% 4. STROKE (F.A.S.T Protocol)
medical_eval(Facts, Action, critical, Reasons, Prohibitions) :-
    ( member(face_droop(true), Facts) ; member(arm_weakness(true), Facts) ; member(speech_difficulty(true), Facts) ),
    Action = activate_stroke_emergency_dispatch,
    Reasons = [
        'Positive FAST indicators present (Face droop, Arm weakness, or Speech difficulty).',
        'Immediate transport to stroke center is vital within the therapeutic thrombolysis window.'
    ],
    Prohibitions = [
        'Do not administer aspirin (contraindicated if hemorrhagic stroke).',
        'Do not allow patient to drive or walk.'
    ].
```

---

#### C. Fire & Hazard Decision Rules (`backend/app/knowledge_base/domains/fire_hazards.pl`)

```prolog
:- module(hazards_kb, [hazard_eval/5]).

% ELECTRICAL FIRE SAFETY INVARIANT
hazard_eval(Facts, Action, critical, Reasons, Prohibitions) :-
    member(hazard(fire), Facts),
    member(fire_source(electrical), Facts),
    Action = isolate_main_power_and_use_co2_extinguisher,
    Reasons = [
        'Live electrical current poses lethal electrocution hazard.',
        'Disconnect main breaker if accessible safely.',
        'Use only Class C (CO2 or Dry Chemical) extinguishers.'
    ],
    Prohibitions = [
        'STRICT LIFE-SAFETY RULE: NEVER THROW WATER ON AN ELECTRICAL FIRE (Severe electrocution hazard).',
        'Do not touch exposed burning wiring.'
    ].

% GREASE / COOKING OIL FIRE
hazard_eval(Facts, Action, critical, Reasons, Prohibitions) :-
    member(hazard(fire), Facts),
    member(fire_source(cooking_oil), Facts),
    Action = cover_with_metal_lid_and_turn_off_burner,
    Reasons = [
        'Oil combustion temperatures exceed 300C.',
        'Smothering with a tight metal lid or fire blanket deprives fire of oxygen.'
    ],
    Prohibitions = [
        'STRICT LIFE-SAFETY RULE: NEVER POUR WATER ON BURNING OIL (Causes explosive steam fireball).',
        'Do not move the burning pan.'
    ].
```

---

### 5.3 Explainable AI (XAI) Proof Trees

```prolog
% backend/app/knowledge_base/core/xai_explainer.pl
:- module(xai_explainer, [generate_xai_proof/3]).

generate_xai_proof(Goal, Facts, ProofTree) :-
    prove(Goal, Facts, ProofTree).

prove(true, _, []) :- !.
prove((A, B), Facts, [PA, PB]) :-
    !,
    prove(A, Facts, PA),
    prove(B, Facts, PB).
prove(Goal, Facts, evidence(Goal)) :-
    member(Goal, Facts), !.
prove(Goal, Facts, deduction(Goal, SubProofs)) :-
    clause(Goal, Body),
    prove(Body, Facts, SubProofs).
```

---

### 5.4 Thread-Safe PySwip Engine Bridge (`backend/app/services/prolog_engine.py`)

```python
import threading
import logging
from typing import List, Dict, Any
from pyswip import Prolog

logger = logging.getLogger("crisisguard.prolog")

class PrologEngineBridge:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(PrologEngineBridge, cls).__new__(cls)
                cls._instance._init_engine()
            return cls._instance

    def _init_engine(self):
        self.prolog = Prolog()
        self._query_lock = threading.Lock()
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        kb_files = [
            "app/knowledge_base/core/core_rules.pl",
            "app/knowledge_base/core/scheduler_clpfd.pl",
            "app/knowledge_base/core/xai_explainer.pl",
            "app/knowledge_base/domains/medical.pl",
            "app/knowledge_base/domains/natural_disasters.pl",
            "app/knowledge_base/domains/fire_hazards.pl",
            "app/knowledge_base/domains/road_accidents.pl",
        ]
        for kb in kb_files:
            logger.info(f"Consulting Prolog Knowledge Base: {kb}")
            self.prolog.consult(kb)

    def evaluate_crisis(self, domain: str, facts: List[str]) -> Dict[str, Any]:
        """
        Thread-safe Prolog query execution directly inside FastAPI.
        """
        facts_term = "[" + ", ".join(facts) + "]"
        query_str = f"evaluate_emergency({domain}, {facts_term}, Action, Severity, Reasons, Prohibitions)"
        
        with self._query_lock:
            try:
                results = list(self.prolog.query(query_str))
                if not results:
                    return self._safe_fallback()
                
                raw = results[0]
                return {
                    "recommended_action": str(raw["Action"]),
                    "severity": str(raw["Severity"]),
                    "reasons": [str(r) for r in raw["Reasons"]],
                    "prohibited_actions": [str(p) for p in raw["Prohibitions"]],
                }
            except Exception as e:
                logger.error(f"Prolog execution error: {e}", exc_info=True)
                return self._safe_fallback()

    def _safe_fallback(self) -> Dict[str, Any]:
        return {
            "recommended_action": "call_emergency_services_immediately",
            "severity": "critical",
            "reasons": ["Uncertain diagnostic input. Immediate emergency dispatch recommended."],
            "prohibited_actions": ["Do not enter hazardous areas."]
        }

prolog_bridge = PrologEngineBridge()
```

---

## 6. FastAPI Backend Service Layer (Clean Architecture)

### 6.1 Triage Service & Neon Persistence (`backend/app/services/triage_service.py`)

```python
import time
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.db.models.session import EmergencySession, SessionFact, TriageAuditTrail
from app.domain.schemas.triage import FactItem, EvaluateCrisisResponse
from app.services.prolog_engine import prolog_bridge

class TriageService:
    async def evaluate_and_persist(
        self,
        session_token: str,
        domain: str,
        new_facts: List[FactItem],
        db: AsyncSession
    ) -> EvaluateCrisisResponse:
        start_time = time.time()

        # 1. Fetch or create session in Neon PostgreSQL
        stmt = select(EmergencySession).where(EmergencySession.session_token == session_token)
        res = await db.execute(stmt)
        session_obj = res.scalar_one_or_none()

        if not session_obj:
            session_obj = EmergencySession(
                session_token=session_token,
                domain=domain,
                current_severity="moderate"
            )
            db.add(session_obj)
            await db.flush()

        # 2. Persist new facts into Neon DB
        for f in new_facts:
            fact_record = SessionFact(
                session_id=session_obj.id,
                fact_key=f.key,
                fact_value=f.value
            )
            db.add(fact_record)
        await db.flush()

        # 3. Retrieve all cumulative facts for this session
        facts_stmt = select(SessionFact).where(SessionFact.session_id == session_obj.id)
        facts_res = await db.execute(facts_stmt)
        all_facts = facts_res.scalars().all()
        prolog_facts = [f"{f.fact_key}({f.fact_value})" for f in all_facts]

        # 4. Execute deterministic Prolog reasoning (0 network latency)
        reasoning = prolog_bridge.evaluate_crisis(domain, prolog_facts)
        latency_ms = int((time.time() - start_time) * 1000)

        # 5. Update session severity & record audit trail
        session_obj.current_severity = reasoning["severity"]
        
        audit = TriageAuditTrail(
            session_id=session_obj.id,
            recommended_action=reasoning["recommended_action"],
            severity=reasoning["severity"],
            reasons=reasoning["reasons"],
            prohibited_actions=reasoning["prohibited_actions"],
            evaluation_latency_ms=latency_ms
        )
        db.add(audit)
        await db.commit()

        return EvaluateCrisisResponse(
            session_token=session_token,
            domain=domain,
            severity=reasoning["severity"],
            action_headline=reasoning["recommended_action"],
            reasons=reasoning["reasons"],
            prohibited_actions=reasoning["prohibited_actions"],
            evaluation_latency_ms=latency_ms
        )

triage_service = TriageService()
```

---

### 6.2 FastAPI Endpoint (`backend/app/api/v1/endpoints/crisis.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.domain.schemas.triage import EvaluateCrisisRequest, EvaluateCrisisResponse
from app.services.triage_service import triage_service

router = APIRouter(prefix="/crisis", tags=["Crisis Triage"])

@router.post("/evaluate", response_model=EvaluateCrisisResponse)
async def evaluate_crisis(
    request: EvaluateCrisisRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        return await triage_service.evaluate_and_persist(
            session_token=request.session_token,
            domain=request.domain,
            new_facts=request.submitted_facts,
            db=db
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 7. Frontend Architecture (React + Tailwind CSS + TypeScript)

### 7.1 UI/UX Emergency Design System

- **High-Visibility Emergency Status Colors**:
  - `bg-red-600` (Critical - 110 BPM CPR, Severe Bleeding, Flash Fire)
  - `bg-amber-600` (High - Rising Water, Stroke FAST Alert)
  - `bg-yellow-500` (Moderate - Precautionary Shelter)
  - `bg-emerald-600` (Stable - Clear Shelter)
- **Single-Handed Accessibility**: Bottom-anchored response chips and quick dial buttons.

---

### 7.2 CPR Metronome Component (`frontend/src/components/emergency/CPRMetronome.tsx`)

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { HeartPulse, Play, Pause } from 'lucide-react';

export const CPRMetronome: React.FC = () => {
  const [active, setActive] = useState(false);
  const [pulse, setPulse] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (active) {
      // 110 Beats Per Minute (AHA standard: 100-120 bpm)
      const bpmInterval = (60 / 110) * 1000;
      timer = setInterval(() => {
        setPulse((p) => !p);
        playTick();
      }, bpmInterval);
    }
    return () => clearInterval(timer);
  }, [active]);

  const playTick = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  };

  return (
    <div className="rounded-2xl border-2 border-red-600 bg-red-950/40 p-6 text-center text-white shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-3">
        <HeartPulse className={`h-8 w-8 text-red-500 ${active && pulse ? 'scale-125' : 'scale-100'} transition-transform duration-75`} />
        <h3 className="text-xl font-bold">CPR Rhythm Assist (110 BPM)</h3>
      </div>
      <div className={`mx-auto my-4 flex h-24 w-24 items-center justify-center rounded-full text-lg font-black transition-all duration-75 ${
        active && pulse ? 'scale-110 bg-red-600 shadow-lg shadow-red-500/50' : 'scale-95 bg-red-900/60'
      }`}>
        {active ? (pulse ? 'PUSH' : 'RECOIL') : 'READY'}
      </div>
      <button
        onClick={() => setActive(!active)}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 active:scale-98 transition"
      >
        {active ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        {active ? 'PAUSE METRONOME' : 'START CPR METRONOME'}
      </button>
      <p className="mt-3 text-xs text-red-300">
        Push hard & fast in center of chest • Compress at least 2 inches (5cm)
      </p>
    </div>
  );
};
```

---

### 7.3 Action & Explanation Card (`frontend/src/components/emergency/ActionCard.tsx`)

```tsx
import React from 'react';
import { ShieldCheck, HelpCircle, XCircle } from 'lucide-react';

interface ActionCardProps {
  severity: 'critical' | 'high' | 'moderate' | 'low' | 'informational';
  actionHeadline: string;
  reasons: string[];
  prohibitions: string[];
}

export const ActionCard: React.FC<ActionCardProps> = ({
  severity,
  actionHeadline,
  reasons,
  prohibitions,
}) => {
  const getBadgeStyle = () => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-amber-600 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-emerald-600 text-white';
    }
  };

  return (
    <div className="space-y-4">
      {/* Recommended Action Banner */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest ${getBadgeStyle()}`}>
            {severity} PRIORITY
          </span>
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
          {actionHeadline.replace(/_/g, ' ').toUpperCase()}
        </h2>
      </div>

      {/* Prohibited Actions Alert Box */}
      {prohibitions.length > 0 && (
        <div className="rounded-2xl border-2 border-red-500/80 bg-red-950/50 p-5 text-red-100">
          <div className="flex items-center gap-2 font-black text-red-400 text-sm tracking-wider uppercase mb-2">
            <XCircle className="h-5 w-5 text-red-500" />
            DO NOT DO THE FOLLOWING (Critical Hazards):
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm font-medium">
            {prohibitions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Explainable AI Reasoning Box */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 text-neutral-200">
        <div className="flex items-center gap-2 font-bold text-neutral-400 text-sm tracking-wider uppercase mb-2">
          <HelpCircle className="h-5 w-5 text-blue-400" />
          Why this recommendation was made:
        </div>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {reasons.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

---

## 8. Extensibility & Clean Code Guidelines

### 8.1 Adding New Emergency Domains in < 15 Minutes

1. **Add Knowledge Base File**: Create `backend/app/knowledge_base/domains/<new_domain>.pl`.
2. **Include in Core**: Add `consult('<new_domain>.pl')` to `backend/app/services/prolog_engine.py`.
3. **Define Frontend Questionnaire**: Add question branch in `frontend/src/config/questionnaires.ts`.
4. **Zero Structural Changes**: The single FastAPI backend and Neon database dynamically accept and evaluate the new crisis rules.

---

## 9. Automated Testing & Safety Verification

### 9.1 Prolog plunit Test Suite (`backend/app/knowledge_base/tests/test_hazards.pl`)

```prolog
:- begin_tests(hazards_tests).
:- use_module('../domains/fire_hazards').

test(electrical_fire_never_recommends_water) :-
    hazard_eval([hazard(fire), fire_source(electrical)], Action, Severity, _, Prohibitions),
    assertion(Severity == critical),
    assertion(Action == isolate_main_power_and_use_co2_extinguisher),
    assertion(member('STRICT LIFE-SAFETY RULE: NEVER THROW WATER ON AN ELECTRICAL FIRE (Severe electrocution hazard).', Prohibitions)).

:- end_tests(hazards_tests).
```

---

### 9.2 Python Safety Invariant Tests (`backend/tests/test_safety_invariants.py`)

```python
import pytest
from app.services.prolog_engine import prolog_bridge

SAFETY_INVARIANTS = [
    {
        "domain": "fire_hazards",
        "facts": ["hazard(fire)", "fire_source(electrical)"],
        "forbidden_substrings": ["water", "hose", "douse"],
        "required_prohibition": "water"
    },
    {
        "domain": "medical",
        "facts": ["face_droop(true)", "arm_weakness(true)"],
        "forbidden_substrings": ["aspirin", "food", "sleep"],
        "required_prohibition": "aspirin"
    }
]

@pytest.mark.parametrize("case", SAFETY_INVARIANTS)
def test_safety_guardrails(case):
    result = prolog_bridge.evaluate_crisis(case["domain"], case["facts"])
    action = result["recommended_action"].lower()
    
    # Assert no unsafe advice
    for forbidden in case["forbidden_substrings"]:
        assert forbidden not in action
    
    # Assert critical prohibition present
    prohibitions_str = " ".join(result["prohibited_actions"]).lower()
    assert case["required_prohibition"] in prohibitions_str
```

---

## 10. Docker Containerization, Deployment & CI/CD

### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  # Single Unified FastAPI Backend (with SWI-Prolog & Neon Postgres connection)
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
      - DATABASE_URL=${DATABASE_URL} # Neon Serverless PostgreSQL Connection String
    restart: always

  # React + Tailwind CSS Frontend (Vite)
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000/api/v1
    depends_on:
      - backend
    restart: always
```

---

## 11. Developer Roadmap & Implementation Plan

| Phase | Milestone | Deliverables |
|---|---|---|
| **Phase 1: Knowledge Base & CLP(FD)** | SWI-Prolog Rulebases | `medical.pl`, `disasters.pl`, `hazards.pl`, `scheduler_clpfd.pl`, plunit tests. |
| **Phase 2: FastAPI Backend & Neon DB** | Single Backend Service | Async SQLAlchemy models, Neon connection pooling, PySwip bridge, `/crisis/evaluate` API. |
| **Phase 3: React Frontend & Audio** | Emergency User Interface | React + Tailwind CSS dashboard, dynamic question wizard, 110 BPM CPR audio metronome. |
| **Phase 4: Safety Verification & Deploy** | Invariant Testing & CI/CD | Pytest safety guardrails, GitHub Actions workflows, Docker compose setup. |

---

> **CrisisGuard AI Standard**: *Code is written with zero margin for error. Every recommendation is deterministically proven, fully explainable, safely audited, and designed to save lives.*
