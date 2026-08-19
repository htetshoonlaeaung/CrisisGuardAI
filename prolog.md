# 🧠 CrisisGuard AI — Prolog & Symbolic AI Engine

> **Context File** — Prolog knowledge base, PySwip bridge, CLP(FD) constraint solver, and XAI explainability.  
> See also: [structure.md](file:///C:/Users/USER/Downloads/CrisisGuardAI/structure.md) · [api.md](file:///C:/Users/USER/Downloads/CrisisGuardAI/api.md)

---

## Overview

CrisisGuardAI uses **SWI-Prolog** embedded in-process via **PySwip** for deterministic, explainable crisis reasoning. No neural networks. No probabilistic models. Every recommendation is a proven logical conclusion from first-order rules + patient facts.

**Stack**: SWI-Prolog + PySwip (C bindings) + CLP(FD) (Constraint Logic Programming over Finite Domains)

---

## Knowledge Base Architecture

```
backend/app/knowledge_base/
├── core/
│   ├── core_rules.pl           # Master dispatcher
│   ├── scheduler_clpfd.pl      # CLP(FD) resource allocation
│   └── xai_explainer.pl        # Proof tree generator
├── domains/
│   ├── medical.pl              # Medical emergencies
│   ├── natural_disasters.pl    # Natural disaster protocols
│   ├── fire_hazards.pl         # Fire & hazmat rules
│   └── road_accidents.pl       # Road crash triage
└── tests/
    ├── test_medical.pl          # plunit medical tests
    └── test_hazards.pl          # plunit hazard tests
```

---

## Core Rules — The Dispatcher

`core_rules.pl` is the entry point. It routes to domain-specific evaluators:

```prolog
:- module(core_rules, [evaluate_emergency/6]).

% Master dispatcher — routes by domain
evaluate_emergency(medical, Facts, Action, Severity, Reasons, Prohibitions) :-
    medical_eval(Facts, Action, Severity, Reasons, Prohibitions).

evaluate_emergency(fire_hazard, Facts, Action, Severity, Reasons, Prohibitions) :-
    hazard_eval(Facts, Action, Severity, Reasons, Prohibitions).

evaluate_emergency(natural_disaster, Facts, Action, Severity, Reasons, Prohibitions) :-
    disaster_eval(Facts, Action, Severity, Reasons, Prohibitions).

evaluate_emergency(road_accident, Facts, Action, Severity, Reasons, Prohibitions) :-
    road_eval(Facts, Action, Severity, Reasons, Prohibitions).
```

---

## Domain Rulebases

### Medical (`medical.pl`)

Module `medical_kb`, exports `medical_eval/5`. Each rule matches fact patterns → deterministic action.

```prolog
% CARDIAC ARREST — unconscious + no breathing → CPR
medical_eval(Facts, begin_cpr_and_call_emergency, critical, Reasons, Prohibitions) :-
    member(unconscious(true), Facts),
    member(breathing(none), Facts),
    Reasons = [
        'Victim is unconscious with absent respiration.',
        'Immediate chest compressions (100-120 BPM) required.',
        'Request AED immediately.'
    ],
    Prohibitions = [
        'Do not give oral fluids or medications.',
        'Do not delay CPR to search for a pulse if untrained.',
        'Do not leave victim unattended.'
    ].

% CHOKING — blocked airway → Heimlich
medical_eval(Facts, perform_heimlich_thrusts, critical, Reasons, Prohibitions) :-
    member(symptom(choking), Facts),
    member(airway_pass(blocked), Facts),
    Reasons = ['Complete airway obstruction. Deliver 5 back blows then 5 abdominal thrusts.'],
    Prohibitions = ['Do not perform blind finger sweeps.', 'Do not offer water.'].

% ARTERIAL BLEEDING → tourniquet
medical_eval(Facts, apply_direct_pressure_and_tourniquet, critical, Reasons, Prohibitions) :-
    member(bleeding(severe_pulsing), Facts),
    Reasons = ['Pulsing blood indicates arterial laceration. Apply direct pressure + tourniquet.'],
    Prohibitions = ['Do not remove soaked dressings.', 'Do not place tourniquet over joints.'].

% STROKE (F.A.S.T.) → emergency dispatch
medical_eval(Facts, activate_stroke_emergency_dispatch, critical, Reasons, Prohibitions) :-
    ( member(face_droop(true), Facts) ; member(arm_weakness(true), Facts) ; member(speech_difficulty(true), Facts) ),
    Reasons = ['Positive FAST indicators. Immediate transport to stroke center required.'],
    Prohibitions = ['Do not administer aspirin.', 'Do not allow patient to drive.'].
```

### Fire Hazards (`fire_hazards.pl`)

Module `hazards_kb`, exports `hazard_eval/5`. Contains **life-safety invariants**:

```prolog
% ELECTRICAL FIRE — NEVER water
hazard_eval(Facts, isolate_main_power_and_use_co2_extinguisher, critical, Reasons, Prohibitions) :-
    member(hazard(fire), Facts),
    member(fire_source(electrical), Facts),
    Reasons = ['Live current = electrocution hazard. Use Class C (CO2) extinguisher only.'],
    Prohibitions = ['NEVER THROW WATER ON AN ELECTRICAL FIRE.', 'Do not touch exposed wiring.'].

% GREASE FIRE — NEVER water
hazard_eval(Facts, cover_with_metal_lid_and_turn_off_burner, critical, Reasons, Prohibitions) :-
    member(hazard(fire), Facts),
    member(fire_source(cooking_oil), Facts),
    Reasons = ['Oil combustion >300C. Smother with metal lid or fire blanket.'],
    Prohibitions = ['NEVER POUR WATER ON BURNING OIL.', 'Do not move burning pan.'].
```

### Natural Disasters (`natural_disasters.pl`)

Flood, Earthquake, Storm, Tsunami — evaluation rules for each scenario.

### Road Accidents (`road_accidents.pl`)

Crash triage, vehicle extraction protocols, traffic control procedures.

---

## CLP(FD) Constraint Scheduler

`scheduler_clpfd.pl` uses SWI-Prolog's constraint logic programming for resource optimization:

```prolog
:- module(scheduler_clpfd, [schedule_rescue_teams/4, verify_resource_constraints/3]).
:- use_module(library(clpfd)).

schedule_rescue_teams(IncidentSeverities, TeamCapacities, Assignments, MaxTime) :-
    length(IncidentSeverities, N),
    length(Assignments, N),
    length(TeamCapacities, NumTeams),
    Assignments ins 1..NumTeams,
    enforce_severity_matching(IncidentSeverities, Assignments),
    labeling([ff, bisect], Assignments).

% Critical incidents → only teams 1-2 (critical response teams)
enforce_severity_matching([], []).
enforce_severity_matching([critical|RestS], [TeamId|RestA]) :-
    TeamId #=< 2,
    enforce_severity_matching(RestS, RestA).
enforce_severity_matching([_|RestS], [_|RestA]) :-
    enforce_severity_matching(RestS, RestA).
```

Called from Python via `POST /api/v1/scheduler/optimize`.

---

## XAI Proof Trees

`xai_explainer.pl` generates machine-readable proof trees explaining WHY a conclusion was reached:

```prolog
:- module(xai_explainer, [generate_xai_proof/3]).

generate_xai_proof(Goal, Facts, ProofTree) :- prove(Goal, Facts, ProofTree).

prove(true, _, []) :- !.
prove((A, B), Facts, [PA, PB]) :- !, prove(A, Facts, PA), prove(B, Facts, PB).
prove(Goal, Facts, evidence(Goal)) :- member(Goal, Facts), !.
prove(Goal, Facts, deduction(Goal, SubProofs)) :-
    clause(Goal, Body), prove(Body, Facts, SubProofs).
```

**Example proof tree output:**
```
deduction(
  medical_eval([unconscious(true), breathing(none)], begin_cpr, critical, ...),
  [
    evidence(unconscious(true)),     ← fact matched
    evidence(breathing(none))        ← fact matched
  ]
)
```

The frontend `ExplanationDrawer.tsx` will render this as a human-readable reasoning chain.

---

## Python Bridge — `PrologEngineBridge`

Located at `backend/app/prolog/engine.py`. Thread-safe singleton:

```python
class PrologEngineBridge:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_engine()
            return cls._instance

    def _init_engine(self):
        self.prolog = Prolog()
        self._query_lock = threading.Lock()
        self._load_knowledge_base()  # Loads all 7 .pl files

    def evaluate_crisis(self, domain: str, facts: List[str]) -> Dict[str, Any]:
        facts_term = "[" + ", ".join(facts) + "]"
        query = f"evaluate_emergency({domain}, {facts_term}, Action, Severity, Reasons, Prohibitions)"
        
        with self._query_lock:  # Thread-safe
            try:
                results = list(self.prolog.query(query))
                if not results:
                    return self._safe_fallback()
                raw = results[0]
                return {
                    "recommended_action": str(raw["Action"]),
                    "severity": str(raw["Severity"]),
                    "reasons": [str(r) for r in raw["Reasons"]],
                    "prohibited_actions": [str(p) for p in raw["Prohibitions"]],
                }
            except Exception:
                return self._safe_fallback()

    def _safe_fallback(self):
        return {
            "recommended_action": "call_emergency_services_immediately",
            "severity": "critical",
            "reasons": ["Uncertain input. Immediate emergency dispatch recommended."],
            "prohibited_actions": ["Do not enter hazardous areas."]
        }
```

### Supporting Modules

| Module | File | Role |
|--------|------|------|
| `query_builder.py` | Serializes `{key: value}` dicts → `key(value)` Prolog terms |
| `parser.py` | Normalizes Prolog atoms/lists → Python dicts/lists |
| `scheduler.py` | Wraps CLP(FD) queries for the scheduler endpoint |
| `xai.py` | Visits proof tree structures → human-readable explanations |
| `exceptions.py` | `PrologError`, `KBLoadError`, `QueryTimeoutError` |

---

## Query Lifecycle (Full Flow)

```mermaid
graph LR
    A["Python: evaluate_crisis()"] --> B["Build Prolog query string"]
    B --> C["Acquire threading.Lock"]
    C --> D["PySwip: prolog.query()"]
    D --> E["SWI-Prolog: evaluate_emergency/6"]
    E --> F["Domain rulebase: medical_eval/5"]
    F --> G["Pattern match facts → unify Action, Severity, Reasons"]
    G --> H["Return bindings to PySwip"]
    H --> I["Release Lock"]
    I --> J["Parse → Python dict"]
    J --> K["Return to TriageService"]
```

---

## Adding a New Crisis Domain

**Time: ~15 minutes. Zero structural changes to backend.**

### Step 1: Create Prolog Rules
```prolog
% backend/app/knowledge_base/domains/chemical_spills.pl
:- module(chemical_kb, [chemical_eval/5]).

chemical_eval(Facts, evacuate_and_call_hazmat, critical, Reasons, Prohibitions) :-
    member(spill_type(toxic_gas), Facts),
    member(wind_direction(toward_population), Facts),
    Reasons = ['Toxic gas release with wind carrying toward populated area.'],
    Prohibitions = ['Do not approach without SCBA equipment.'].
```

### Step 2: Register in Core Dispatcher
Add to `core_rules.pl`:
```prolog
evaluate_emergency(chemical_spill, Facts, A, S, R, P) :- chemical_eval(Facts, A, S, R, P).
```

### Step 3: Add to Engine Loader
Add filepath to `engine.py` `_load_knowledge_base()` list.

### Step 4: Add Domain Constant
Add `'chemical_spill'` to `DomainType` enum in `constants.py`.

### Step 5: Frontend Questionnaire
Create question flow in `frontend/src/config/questionnaires.ts` (Phase 3).

---

## Safety Invariants

These are **non-negotiable rules** enforced by Prolog and verified by tests:

| Invariant | Rule | Test File |
|-----------|------|-----------|
| Never recommend water on electrical fire | `Prohibitions` includes "NEVER THROW WATER" | `test_hazards.pl` |
| Never recommend water on grease fire | `Prohibitions` includes "NEVER POUR WATER" | `test_hazards.pl` |
| Never recommend aspirin for stroke | `Prohibitions` includes "aspirin" | `test_medical.pl` |
| Always fallback to "call emergency services" | `_safe_fallback()` returns critical | `test_safety_invariants.py` |

Python test in `test_safety_invariants.py` parametrically checks forbidden substrings never appear in `recommended_action`.
