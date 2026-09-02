# 🛡️ CrisisGuard AI — Engineering Skills & Extension Blueprint

> **Version:** 3.1.0  
> **Tech Stack:** TypeScript • React 18 • Vite • Express • Tailwind CSS 4 • SWI-Prolog Logic Rules • CLP(FD) Constraint Solving  
> **Purpose:** Developer handbook for contributors modifying rules, extending crisis domains, and maintaining life-safety standards.

---

## 1. Core Engineering Principles

1. **Deterministic Logic Over Probabilistic Predictions**:
   - Critical life-safety actions must never hallucinate. Every triage recommendation is derived from deterministic rules and constraints.
2. **Explicit Safety Invariants & Prohibitions**:
   - Every emergency outcome must explicitly output forbidden actions (e.g. *"NEVER pour water on electrical or grease fires"*).
3. **Explainable AI (XAI) Proof Trees**:
   - Decisions must trace back to concrete observations and deduction steps.
4. **Sub-Millisecond Evaluation Latency**:
   - Logic evaluations execute in-process with minimal overhead (< 5ms).

---

## 2. Knowledge Base & Rule Engine Architecture

The rule engine resides in `src/server/ruleEngine.ts`. It models first-order Horn-clause logic across four emergency domains:

```text
src/server/ruleEngine.ts
├── evalMedical()             # CPR, choking, arterial bleeding, stroke (FAST), burns, toxins
├── evalFireHazards()         # Electrical, grease/cooking oil, gas leaks, structure fires
├── evalNaturalDisasters()    # Flash floods, earthquakes, tsunami evacuations
├── evalRoadAccidents()       # Multi-vehicle trauma, vehicle fires, traffic perimeters, START triage
├── safeFallback()            # Precautionary emergency dispatch invariant
└── solveDispatchCLPFD()      # Finite domain resource assignment solver
```

---

## 3. How to Add a New Emergency Domain in 3 Steps

### Step 1: Write the Domain Evaluator
In `src/server/ruleEngine.ts` (or a separate module), implement a `DomainEvaluator` function:

```typescript
import { RuleEvaluationResult } from './ruleEngine';

export function evalHazmatChemical(facts: Map<string, any>): RuleEvaluationResult {
  const gasColor = String(facts.get('gas_color') || '').toLowerCase();
  const respiratoryDistress = facts.get('respiratory_distress') === true;

  if (gasColor === 'chlorine_yellow' || respiratoryDistress) {
    return {
      action: 'EVACUATE_UPWIND_AND_SEAL_RESPIRATORY_BARRIER',
      severity: 'critical',
      step_by_step_instructions: [
        'Move upwind and uphill immediately away from the vapor cloud.',
        'Cover nose and mouth with a wet cloth or respirator.',
        'Notify emergency dispatch (911 / Hazmat unit) with chemical placard ID.'
      ],
      reasons: [
        'Dense toxic vapors settle in low-lying topography.',
        'Immediate respiratory isolation is critical to avoid pulmonary edema.'
      ],
      prohibited_actions: [
        'DO NOT move downwind or enter basements.',
        'DO NOT touch contaminated liquid runoff.'
      ],
      proof_tree: {
        type: 'rule',
        label: 'hazmat_rule_01: TOXIC_VAPOR_ISOLATION',
        details: 'gas_color(chlorine_yellow) ⇒ evacuate_upwind',
        children: [{ type: 'evidence', label: 'Yellow chlorine vapor reported' }]
      }
    };
  }

  // Precautionary fallback
  return ruleEngine.safeFallback(Array.from(facts.entries()).map(([k, v]) => ({ key: k, value: v })), 'medical');
}
```

### Step 2: Register the Evaluator
Register it with `ruleEngine`:

```typescript
import { ruleEngine } from './src/server/ruleEngine';
import { evalHazmatChemical } from './evalHazmatChemical';

ruleEngine.registerDomainEvaluator('hazmat', evalHazmatChemical);
```

### Step 3: Add UI Presets
In `src/data/quickFacts.ts`, add user-friendly preset buttons:

```typescript
{
  id: 'hazmat_chlorine',
  title: 'Chlorine Gas Cloud',
  domain: 'hazmat',
  facts: [
    { key: 'gas_color', value: 'chlorine_yellow' },
    { key: 'respiratory_distress', value: 'true' }
  ]
}
```

---

## 4. CLP(FD) Constraint Dispatch Solver

The fleet dispatcher solves multi-criteria rescue resource allocation:

- **Constraint 1 (Capacity)**: `Team Vehicle Capacity >= Incident Victim Count`.
- **Constraint 2 (Specialization)**: `Critical Incidents` mapped to `Paramedics / Fire Rescue` units.
- **Constraint 3 (No Double Booking)**: Each team is assigned to at most one active scene per dispatch round.
- **Sorting Metric**: Critical incidents take priority over moderate/low severity.

---

## 5. UI Component & Interaction Standards

- **3D Skeuomorphic Buttons**: Use `HapticButton` (`src/components/ui/HapticButton.tsx`) for tactile feedback with active depression states.
- **Theme Support**: Components use Tailwind classes paired with CSS custom variables from `src/index.css`:
  - Accent: `--accent-primary: #FFAB00`
  - Alert: `--alert-red: #EF4444`
  - Theme check: `const { isLight, themeMode } = useTheme();`
- **Responsive Layout**: Ribbon layouts are stacked on mobile screens (< 1024px) with accessible touch targets (≥ 44px).

---

## 6. Testing & Quality Verification Checklist

Before pushing changes or submitting PRs:
1. **TypeScript Build**: `npm run build` (Ensures zero compilation errors across client and server).
2. **Type Checking & Linting**: `npm run lint` (`tsc --noEmit`).
3. **Safety Verification**: Ensure every new rule contains at least one explicit item in `prohibited_actions`.
4. **Latency Verification**: Ensure evaluation completes within < 10ms.
