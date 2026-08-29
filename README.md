# 🛡️ CrisisGuard AI — Intelligent Crisis Decision Support System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React + Tailwind](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-38bdf8.svg?logo=react)](https://react.dev)
[![Backend: FastAPI (Python)](https://img.shields.io/badge/Backend-FastAPI%20(Python)-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Database: Neon PostgreSQL](https://img.shields.io/badge/Database-Neon%20Serverless%20Postgres-00E599.svg?logo=postgresql)](https://neon.tech)
[![Reasoning: SWI--Prolog + CLP(FD)](https://img.shields.io/badge/Engine-SWI--Prolog%20%2B%20CLP(FD)-orange.svg)](https://www.swi-prolog.org)

**CrisisGuard AI** is a safety-critical, explainable, rule-based decision support system designed to assist individuals, emergency responders, and communities during acute emergency situations.

Instead of ungrounded generative predictions, CrisisGuard AI combines **deterministic first-order logical inference & Constraint Logic Programming (SWI-Prolog `clpfd` / `pyswip`)** with a **FastAPI (Python) / Express backend** connected to **PostgreSQL**, paired with a modern **React + Tailwind CSS** emergency user interface.

---

## 🏗️ System Architecture

- **Frontend (`/src`)**: React 18 + Tailwind CSS + Lucide Icons + Web Audio CPR Metronome (110 BPM) + Interactive Shelter Map + CLP(FD) Dispatch Visualization.
- **Backend (`/backend` & `/server.ts`)**: Modular **FastAPI (Python 3.11+)** and unified Node API layer handling REST endpoints, session management, and emergency shelter routing.
- **Database**: PostgreSQL on **Neon Serverless** via Async SQLAlchemy 2.0 and `asyncpg` with connection pooling.
- **Reasoning Engine**: Embedded **SWI-Prolog** via thread-safe `pyswip` and `clpfd` for constraint solving and proof-tree Explainable AI (XAI).

---

## ⚡ Core Capabilities

- **Deterministic Triage Evaluation**: Evaluates emergency facts against formal knowledge bases for Medical, Fire & Hazards, Natural Disasters, and Road Accidents.
- **Explainable AI (XAI) Proof Trees**: Interactive derivation traces displaying exact logical clauses, premises, and life-safety invariants.
- **Audio-Visual CPR Metronome (110 BPM)**: High-accuracy Web Audio API rhythmic pulse (100–120 BPM AHA standard) with haptic contraction/recoil visualizers.
- **CLP(FD) Resource Dispatch Scheduler**: Finite-domain constraint engine assigning specialized rescue units to emergency incidents without conflicts.
- **Haversine Geo-Shelter Routing**: Computes nearest verified emergency shelters, real-time capacities, and facility breakdowns.
- **Immutable Audit Trail**: Chronological, cryptographically timestamped inference traces for debriefing and medical oversight.
- **High-Contrast Amber / Red Alert System**: Designed for low-light rescue environments (`#FFAB00` Amber system with `#EF4444` Red Alert protection).

---

## 🚀 Quick Start

### Frontend & Web UI
```bash
npm install
npm run dev
```
Runs the application on `http://localhost:3000`.

### Python FastAPI Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 📁 Key Documentation

- **[STRUCTURE.md](./STRUCTURE.md)**: Architectural breakdown, component map, data flow, and directory layout.
- **[skills.md](./skills.md)**: Master engineering blueprint for rules, Prolog logic, and safety invariants.
- **[api.md](./api.md)**: REST API contract documentation.
- **[database.md](./database.md)**: Database schema and connection configurations.

---

## 📜 License
MIT License. Created for life-safety assistance and emergency response engineering.
