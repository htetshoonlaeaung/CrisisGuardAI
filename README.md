# 🛡️ CrisisGuard AI — Intelligent Life-Safety Decision Support System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express%20%2B%20Vite-000000.svg?logo=express)](https://expressjs.com/)
[![Logic Engine](https://img.shields.io/badge/Reasoning-SWI--Prolog%20Horn--Clause%20%2B%20CLP(FD)-FFAB00.svg)](https://www.swi-prolog.org/)

**CrisisGuard AI** is a deterministic, explainable, safety-critical decision support platform engineered for real-time emergency triage, CPR guidance, disaster response, and rescue dispatch optimization.

Unlike probabilistic Large Language Models prone to hallucinations during critical situations, CrisisGuard AI executes **deterministic Horn-clause logic, strict life-safety invariants, and CLP(FD) constraint solving** with transparent Explainable AI (XAI) proof trees and sub-millisecond evaluation latency.

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

### 1. Installation
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```
Runs the unified backend proxy and Vite frontend on `http://localhost:3000`.

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 📁 Key Documentation

- **[STRUCTURE.md](./STRUCTURE.md)**: Architectural breakdown, component map, data flow, and directory layout.
- **[skills.md](./skills.md)**: Complete developer skill blueprint for adding rules, extending domains, and safety invariant testing.

---

## 🤝 Contributing & Extending

1. **Adding a New Emergency Domain**:
   - Define domain rules in `src/server/ruleEngine.ts` using `registerDomainEvaluator()`.
   - Add preset facts in `src/data/quickFacts.ts`.
   - Update domain selection in `src/components/emergency/FactInputPanel.tsx`.

2. **Customizing the UI / Theme**:
   - Color variables are defined in `src/index.css` (`--accent-primary: #FFAB00`, `--alert-red: #EF4444`).
   - Theme toggle context is accessible via `useTheme()` in `src/context/ThemeContext.tsx`.

---

## 📜 License
MIT License. Created for life-safety assistance and educational crisis response engineering.
