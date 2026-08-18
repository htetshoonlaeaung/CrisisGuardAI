# 🛡️ CrisisGuard AI — Intelligent Crisis Decision Support System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React + Tailwind](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-38bdf8.svg?logo=react)](https://react.dev)
[![Backend: FastAPI (Python)](https://img.shields.io/badge/Backend-FastAPI%20(Python)-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Database: Neon PostgreSQL](https://img.shields.io/badge/Database-Neon%20Serverless%20Postgres-00E599.svg?logo=postgresql)](https://neon.tech)
[![Reasoning: SWI--Prolog + CLP(FD)](https://img.shields.io/badge/Engine-SWI--Prolog%20%2B%20CLP(FD)-orange.svg)](https://www.swi-prolog.org)

**CrisisGuard AI** is a safety-critical, explainable, rule-based decision support system designed to assist individuals, responders, and communities during acute emergency situations.

Instead of ungrounded generative predictions, CrisisGuard AI combines **deterministic first-order logical inference & Constraint Logic Programming (SWI-Prolog `clpfd` / `pyswip`)** within a single, unified **FastAPI backend** connected to **Neon Serverless PostgreSQL**, paired with a modern **React + Tailwind CSS** emergency interface.

---

## 🏗️ System Architecture

- **Frontend (`/frontend`)**: React + Tailwind CSS + Shadcn UI + Lucide + Web Audio CPR Metronome (110 BPM).
- **Backend (`/backend`)**: Single unified **FastAPI (Python 3.11+)** backend handling REST APIs, session management, and emergency shelter routing.
- **Database**: PostgreSQL on **Neon Serverless** via Async SQLAlchemy 2.0 and `asyncpg` with connection pooling.
- **Reasoning Engine**: Embedded **SWI-Prolog** via thread-safe `pyswip` and `clpfd` for constraint solving and proof-tree Explainable AI (XAI).

---

## 📖 Master Engineering Blueprint

For the full architectural specification, database DDL schemas, Async SQLAlchemy models, Prolog CLP(FD) rulebases, API contracts, safety invariant tests, and extension guidelines, refer to:

👉 **[skills.md](skills.md)**
