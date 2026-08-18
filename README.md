# 🛡️ CrisisGuard AI — Intelligent Crisis Decision Support System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React + Tailwind](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-38bdf8.svg?logo=react)](https://react.dev)
[![API Gateway: Node.js](https://img.shields.io/badge/Gateway-Node.js%20%2B%20TypeScript-339933.svg?logo=node.js)](https://nodejs.org)
[![Database: Neon PostgreSQL](https://img.shields.io/badge/Database-Neon%20Serverless%20Postgres-00E599.svg?logo=postgresql)](https://neon.tech)
[![Reasoning: FastAPI + SWI--Prolog](https://img.shields.io/badge/Reasoning-FastAPI%20%2B%20Prolog%20CLP(FD)-orange.svg)](https://www.swi-prolog.org)

**CrisisGuard AI** is a safety-critical, explainable, rule-based decision support system designed to assist individuals, emergency responders, and communities during acute crises.

Instead of ungrounded generative predictions, CrisisGuard AI couples **deterministic first-order logical inference & Constraint Logic Programming (SWI-Prolog `clpfd` / `pyswip`)** with a modern **microservice full-stack (React + Tailwind CSS, Node.js API Gateway, Neon Serverless PostgreSQL, and FastAPI Reasoning Microservice)**.

---

## 🏗️ System Architecture

- **Frontend (`/frontend`)**: React + Tailwind CSS + Shadcn UI + Lucide + Web Audio CPR Metronome (110 BPM).
- **Backend App Gateway (`/backend-node`)**: Node.js + TypeScript + Express/Fastify + Drizzle ORM.
- **Database (`/database`)**: PostgreSQL on **Neon Serverless** with connection pooling and session telemetry.
- **Reasoning Service (`/reasoning-engine`)**: FastAPI + SWI-Prolog (`pyswip` + `clpfd`) with proof-tree Explainable AI (XAI).

---

## 📖 Master Engineering Blueprint

For the full architectural specification, database DDL schemas, Drizzle models, Prolog CLP(FD) rulebases, API contracts, safety invariant tests, and extension guidelines, refer to:

👉 **[skills.md](skills.md)**
