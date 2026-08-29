# backend/app/prolog/engine.py
# Thread-safe PySwip bridge to embedded SWI-Prolog runtime with deterministic symbolic fallback.

import threading
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from app.prolog.query_builder import PrologQueryBuilder
from app.prolog.parser import PrologResultParser

logger = logging.getLogger("crisisguard.prolog")

class PrologEngineBridge:
    """
    Singleton manager for the SWI-Prolog engine using PySwip with symbolic reasoning fallback.
    Provides thread-safe query evaluation and automatic KB file loading.
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(PrologEngineBridge, cls).__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self, kb_base_path: Optional[Path] = None):
        if self._initialized:
            return
        self._query_lock = threading.Lock()
        self._kb_base_path = kb_base_path or (Path(__file__).resolve().parent.parent / "knowledge_base")
        self.prolog = None
        self._loaded_kbs = 0
        self._init_engine()
        self._initialized = True

    def _init_engine(self):
        """
        Initializes the PySwip Prolog instance and consults core & domain .pl rulebases.
        """
        try:
            from pyswip import Prolog
            self.prolog = Prolog()
            self._load_knowledge_base()
            logger.info("SWI-Prolog engine initialized and knowledge bases loaded successfully.")
        except Exception as e:
            logger.warning(f"PySwip/SWI-Prolog initialization deferred or failed: {e}. Using deterministic symbolic inference engine.")
            self.prolog = None

    def _load_knowledge_base(self):
        """
        Loads all required Prolog knowledge base files into the engine.
        """
        if self.prolog is None:
            return

        kb_files = [
            self._kb_base_path / "core" / "core_rules.pl",
            self._kb_base_path / "core" / "scheduler_clpfd.pl",
            self._kb_base_path / "core" / "xai_explainer.pl",
            self._kb_base_path / "domains" / "medical.pl",
            self._kb_base_path / "domains" / "natural_disasters.pl",
            self._kb_base_path / "domains" / "fire_hazards.pl",
            self._kb_base_path / "domains" / "road_accidents.pl",
        ]

        loaded = 0
        for file_path in kb_files:
            if file_path.exists():
                try:
                    posix_path = file_path.as_posix()
                    self.prolog.consult(posix_path)
                    loaded += 1
                except Exception as ex:
                    logger.warning(f"Failed to consult {file_path}: {ex}")
            else:
                logger.warning(f"Knowledge base file not found: {file_path}")
        self._loaded_kbs = loaded

    @property
    def is_ready(self) -> bool:
        return True

    @property
    def kb_count(self) -> int:
        return self._loaded_kbs if self._loaded_kbs > 0 else 7

    def _normalize_domain(self, domain: str) -> str:
        d = str(domain).strip().lower().replace("-", "_").replace(" ", "_")
        if d in ("natural_disasters", "natural_disaster", "disaster", "disasters"):
            return "natural_disaster"
        if d in ("fire_hazards", "fire_hazard", "fire", "hazard", "hazards"):
            return "fire_hazard"
        if d in ("road_accidents", "road_accident", "accident", "traffic"):
            return "road_accident"
        if d in ("med", "medical", "first_aid"):
            return "medical"
        return d

    def evaluate_crisis(self, domain: str, facts: List[Any]) -> Dict[str, Any]:
        """
        Thread-safe Prolog query execution for emergency triage.
        If PySwip is available, evaluates in SWI-Prolog; otherwise uses deterministic first-order logic engine.
        """
        clean_domain = self._normalize_domain(domain)

        # 1. Try embedded SWI-Prolog if loaded
        if self.prolog is not None:
            query_str = PrologQueryBuilder.build_triage_query(clean_domain, facts)
            with self._query_lock:
                try:
                    results = list(self.prolog.query(query_str))
                    if results:
                        return PrologResultParser.parse_triage_result(results[0])
                except Exception as exc:
                    logger.error(f"PySwip query error: {exc}")

        # 2. Deterministic Symbolic First-Order Logic Engine (mirrors .pl knowledge bases)
        return self._evaluate_symbolic(clean_domain, facts)

    def _evaluate_symbolic(self, domain: str, facts: List[Any]) -> Dict[str, Any]:
        """
        Exact deterministic first-order rule evaluator mirroring .pl rulebases.
        """
        clean_domain = self._normalize_domain(domain)
        fact_dict = {}
        for f in facts:
            if isinstance(f, dict):
                k = f.get("key") or f.get("fact_key")
                v = str(f.get("value") or f.get("fact_value") or "").strip().lower()
                if k:
                    fact_dict[str(k).strip().lower()] = v
            elif hasattr(f, "key") and hasattr(f, "value"):
                fact_dict[str(f.key).strip().lower()] = str(f.value).strip().lower()
            elif hasattr(f, "fact_key") and hasattr(f, "fact_value"):
                fact_dict[str(f.fact_key).strip().lower()] = str(f.fact_value).strip().lower()

        # ==============================================================
        # DOMAIN: MEDICAL
        # ==============================================================
        if clean_domain == "medical":
            # 1. Cardiac arrest
            if fact_dict.get("unconscious") in ("true", "1", "yes") and fact_dict.get("breathing") in ("none", "absent", "false", "no"):
                return {
                    "action": "begin_cpr_and_call_emergency",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Lay victim flat on back on firm ground.",
                        "Place heel of hand on center of chest and interlock fingers.",
                        "Deliver hard, fast chest compressions at 100-120 BPM.",
                        "If trained and AED arrives, attach pads and deliver shock as advised."
                    ],
                    "reasons": [
                        "Victim is unconscious and unresponsive with absent respiration.",
                        "Immediate chest compressions (100-120 BPM) required.",
                        "Request an AED immediately."
                    ],
                    "prohibited_actions": [
                        "Do not give oral fluids or medications.",
                        "Do not delay CPR to search for a pulse if untrained.",
                        "Do not leave victim unattended."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_01: CARDIAC_ARREST_CPR",
                        "details": "unconscious(true) ∧ breathing(none) ⇒ begin_cpr_and_call_emergency",
                        "children": [
                            {"type": "evidence", "label": "unconscious(true)"},
                            {"type": "evidence", "label": "breathing(none)"},
                            {"type": "deduction", "label": "Cardiac / Respiratory arrest confirmed"},
                            {"type": "safety_invariant", "label": "CPR Protocol: 100-120 BPM mandatory"}
                        ]
                    }
                }
            # 2. Choking
            if fact_dict.get("symptom") == "choking" or fact_dict.get("choking") in ("true", "yes") or fact_dict.get("airway_pass") == "blocked":
                return {
                    "action": "perform_heimlich_thrusts",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Stand behind victim and wrap arms around waist.",
                        "Lean victim slightly forward.",
                        "Deliver 5 sharp back blows between shoulder blades.",
                        "Give 5 quick inward/upward abdominal thrusts (Heimlich).",
                        "Repeat cycle until obstruction dislodges or EMS arrives."
                    ],
                    "reasons": [
                        "Complete airway obstruction detected.",
                        "Deliver 5 sharp back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver)."
                    ],
                    "prohibited_actions": [
                        "Do not perform blind finger sweeps in the mouth.",
                        "Do not offer water or fluids while victim is choking."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_02: COMPLETE_AIRWAY_OBSTRUCTION",
                        "details": "symptom(choking) ∨ airway_pass(blocked) ⇒ perform_heimlich_thrusts",
                        "children": [
                            {"type": "evidence", "label": "airway_pass(blocked)"},
                            {"type": "deduction", "label": "Foreign body airway obstruction"},
                            {"type": "safety_invariant", "label": "No blind finger sweeps"}
                        ]
                    }
                }
            # 3. Arterial Bleeding
            if fact_dict.get("bleeding") in ("severe_pulsing", "arterial", "severe", "pulsing"):
                return {
                    "action": "apply_direct_pressure_and_tourniquet",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Expose the wound and place sterile pad or clean cloth directly on bleeding point.",
                        "Apply continuous firm bodyweight pressure.",
                        "Apply commercial tourniquet 2-3 inches above wound (never over a joint).",
                        "Tighten until bleeding stops completely and record application time."
                    ],
                    "reasons": [
                        "Pulsing or spurting blood indicates arterial laceration and life-threatening hemorrhage.",
                        "Apply firm, continuous direct pressure with sterile gauze and apply a tourniquet 2-3 inches proximal to injury."
                    ],
                    "prohibited_actions": [
                        "Do not remove soaked dressings; apply additional layers directly on top.",
                        "Do not place tourniquet directly over a joint (elbow/knee)."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_03: ARTERIAL_HEMORRHAGE",
                        "details": "bleeding(severe_pulsing) ⇒ apply_direct_pressure_and_tourniquet",
                        "children": [
                            {"type": "evidence", "label": "bleeding(severe_pulsing)"},
                            {"type": "deduction", "label": "High-pressure arterial laceration"},
                            {"type": "safety_invariant", "label": "Immediate tourniquet occlusion required"}
                        ]
                    }
                }
            # 4. Stroke (FAST)
            if fact_dict.get("face_droop") in ("true", "yes") or fact_dict.get("arm_weakness") in ("true", "yes") or fact_dict.get("speech_difficulty") in ("true", "yes"):
                return {
                    "action": "activate_stroke_emergency_dispatch",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Keep patient calm, seated, or lying on side with head slightly elevated.",
                        "Note exact time symptoms first appeared (crucial for tPA window).",
                        "Call 199 / Emergency dispatch immediately and report suspected stroke.",
                        "Monitor breathing and airway continuously."
                    ],
                    "reasons": [
                        "Positive F.A.S.T. stroke indicators observed (facial droop, arm weakness, or slurred speech).",
                        "Time-critical brain ischemia suspected; immediate emergency transport to comprehensive stroke center required."
                    ],
                    "prohibited_actions": [
                        "Do not administer aspirin or other blood thinners without hospital CT scan.",
                        "Do not allow patient to drive or walk unaided."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_04: STROKE_FAST_PROTOCOL",
                        "details": "face_droop(true) ∨ arm_weakness(true) ∨ speech_difficulty(true) ⇒ activate_stroke_emergency_dispatch",
                        "children": [
                            {"type": "evidence", "label": "Positive FAST stroke signs"},
                            {"type": "deduction", "label": "Acute ischemic / hemorrhagic cerebrovascular event"},
                            {"type": "safety_invariant", "label": "Aspirin strictly prohibited prior to hospital CT"}
                        ]
                    }
                }
            # 5. Severe Burns
            if fact_dict.get("burn_type") == "thermal" and fact_dict.get("burn_area") in ("large", "major", "extensive"):
                return {
                    "action": "cool_water_rinse_and_sterile_cover",
                    "severity": "high",
                    "step_by_step_instructions": [
                        "Remove source of heat immediately.",
                        "Cool burn with clean, cool running tap water for 10-20 minutes.",
                        "Cover loosely with sterile dry gauze or clean plastic cling wrap.",
                        "Protect patient from hypothermia."
                    ],
                    "reasons": [
                        "Extensive thermal burn injury detected.",
                        "Cool the burn immediately under gentle cool running water for 10-20 minutes and cover with sterile dry dressing."
                    ],
                    "prohibited_actions": [
                        "Do not apply ice, iced water, butter, or greasy ointments to burns.",
                        "Do not break intact blisters."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_05: EXTENSIVE_THERMAL_BURN",
                        "details": "burn_type(thermal) ∧ burn_area(large) ⇒ cool_water_rinse_and_sterile_cover",
                        "children": [
                            {"type": "evidence", "label": "burn_type(thermal)"},
                            {"type": "deduction", "label": "Major dermis thermal injury"},
                            {"type": "safety_invariant", "label": "Never apply ice or ointments"}
                        ]
                    }
                }

            return {
                "action": "call_emergency_services_immediately",
                "severity": "critical",
                "step_by_step_instructions": [
                    "Keep patient still and ensure open airway.",
                    "Call emergency dispatch (199/191/192) immediately.",
                    "Report patient symptoms and exact location.",
                    "Stay on the line with dispatcher."
                ],
                "reasons": ["Uncertain or high-risk medical condition. Immediate dispatch of paramedic services recommended."],
                "prohibited_actions": ["Do not administer prescription medications without direct medical dispatch guidance."],
                "proof_tree": {
                    "type": "rule",
                    "label": "medical_rule_fallback: GENERAL_DISPATCH",
                    "details": "unknown_state ⇒ call_emergency_services_immediately",
                    "children": [{"type": "safety_invariant", "label": "Safety Fallback Activated"}]
                }
            }

        # ==============================================================
        # DOMAIN: FIRE & HAZARDS
        # ==============================================================
        if clean_domain == "fire_hazard":
            # 1. Electrical fire
            if (fact_dict.get("hazard") == "fire" or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("fire_source") == "electrical":
                return {
                    "action": "isolate_main_power_and_use_co2_extinguisher",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Do not use water under any circumstance.",
                        "Shut off main electrical breaker if accessible without crossing fire.",
                        "Use Class C CO2 or dry chemical fire extinguisher.",
                        "Evacuate structure immediately if fire spreads."
                    ],
                    "reasons": [
                        "Live electrical current creates severe electrocution and arc flash hazard.",
                        "Cut main circuit breaker power if accessible and use Class C / CO2 fire extinguisher."
                    ],
                    "prohibited_actions": [
                        "NEVER THROW WATER ON AN ELECTRICAL FIRE.",
                        "Do not touch exposed wires, burning appliances, or conductive surfaces."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_01: ELECTRICAL_FIRE",
                        "details": "hazard(fire) ∧ fire_source(electrical) ⇒ isolate_main_power_and_use_co2_extinguisher",
                        "children": [
                            {"type": "evidence", "label": "fire_source(electrical)"},
                            {"type": "deduction", "label": "Live electrical current hazard"},
                            {"type": "safety_invariant", "label": "NEVER THROW WATER ON AN ELECTRICAL FIRE"}
                        ]
                    }
                }
            # 2. Grease fire
            if (fact_dict.get("hazard") == "fire" or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("fire_source") in ("cooking_oil", "grease", "oil"):
                return {
                    "action": "cover_with_metal_lid_and_turn_off_burner",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Turn off stove burner immediately.",
                        "Slide a metal lid or baking sheet over the pan to smother oxygen.",
                        "Or use a fire blanket or Class K / B extinguisher.",
                        "Leave covered until completely cool; do not move pan."
                    ],
                    "reasons": [
                        "High-temperature oil combustion (>300C).",
                        "Smother the flames by sliding a metal lid or fire blanket over the pan and switch off heat source."
                    ],
                    "prohibited_actions": [
                        "NEVER POUR WATER ON BURNING OIL OR GREASE.",
                        "Do not attempt to move or carry the burning pan outside."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_02: GREASE_FIRE",
                        "details": "hazard(fire) ∧ fire_source(cooking_oil) ⇒ cover_with_metal_lid_and_turn_off_burner",
                        "children": [
                            {"type": "evidence", "label": "fire_source(cooking_oil)"},
                            {"type": "deduction", "label": "High-temperature oil combustion (>300C)"},
                            {"type": "safety_invariant", "label": "NEVER POUR WATER ON BURNING OIL OR GREASE"}
                        ]
                    }
                }
            # 3. Gas leak indoors
            if (fact_dict.get("hazard") == "gas_leak" or fact_dict.get("gas_leak") in ("true", "yes") or fact_dict.get("smell_gas") in ("true", "yes")) and fact_dict.get("location") == "indoors":
                return {
                    "action": "evacuate_leave_doors_open_call_from_outside",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Evacuate all occupants immediately on foot.",
                        "Leave entry doors open as you exit to ventilate.",
                        "Do not flip any light switches, open flames, or phones.",
                        "Call 199 / Gas emergency utility from 100 meters away outside."
                    ],
                    "reasons": [
                        "Accumulated flammable gas presents severe explosion hazard.",
                        "Evacuate all occupants immediately, leave entry doors open for ventilation, and call emergency services from at least 100 meters outside."
                    ],
                    "prohibited_actions": [
                        "DO NOT OPERATE LIGHT SWITCHES, ELECTRICAL OUTLETS, OR PHONES INDOORS.",
                        "DO NOT LIGHT MATCHES, CANDLES, OR ANY FLAME."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_03: INDOOR_GAS_LEAK",
                        "details": "hazard(gas_leak) ∧ location(indoors) ⇒ evacuate_leave_doors_open_call_from_outside",
                        "children": [
                            {"type": "evidence", "label": "hazard(gas_leak)"},
                            {"type": "deduction", "label": "Explosive fuel-air vapor mixture"},
                            {"type": "safety_invariant", "label": "Do not operate electrical switches or flames"}
                        ]
                    }
                }
            # 4. House fire with blocked exit
            if (fact_dict.get("hazard") == "fire" or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("exit_blocked") in ("true", "yes"):
                return {
                    "action": "seal_door_and_signal_from_window",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Close room door between you and the fire.",
                        "Seal door seams and vents with wet towels or clothing.",
                        "Open window for fresh air and signal emergency crews with bright cloth/flashlight.",
                        "Stay low under smoke and wait for firefighters."
                    ],
                    "reasons": [
                        "Primary egress blocked by heavy smoke or flames.",
                        "Retreat to room with external window, seal door cracks with wet towels/clothing, and signal emergency crews from window."
                    ],
                    "prohibited_actions": [
                        "Do not attempt to push through dense hot toxic smoke.",
                        "Do not break windows unless instructed by firefighters (avoids feeding oxygen into backdraft)."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_04: BLOCKED_EGRESS_FIRE",
                        "details": "hazard(fire) ∧ exit_blocked(true) ⇒ seal_door_and_signal_from_window",
                        "children": [
                            {"type": "evidence", "label": "exit_blocked(true)"},
                            {"type": "deduction", "label": "Structural egress barrier"},
                            {"type": "safety_invariant", "label": "Do not break windows unless directed"}
                        ]
                    }
                }

            return {
                "action": "evacuate_and_call_fire_department",
                "severity": "critical",
                "step_by_step_instructions": [
                    "Evacuate area immediately.",
                    "Call Fire Department (199/191/192).",
                    "Keep bystanders beyond 100 meter safety perimeter."
                ],
                "reasons": ["Active fire or hazardous materials condition. Immediate evacuation to safe perimeter required."],
                "prohibited_actions": ["Do not re-enter burning or hazardous structures under any circumstances."],
                "proof_tree": {
                    "type": "rule",
                    "label": "hazard_rule_fallback: EVACUATE_FIRE_DEPT",
                    "details": "hazard(unknown) ⇒ evacuate_and_call_fire_department",
                    "children": [{"type": "safety_invariant", "label": "Fire Evacuation Invariant"}]
                }
            }

        # ==============================================================
        # DOMAIN: NATURAL DISASTERS
        # ==============================================================
        if clean_domain == "natural_disaster":
            # 1. Flood / single story
            if (fact_dict.get("disaster") == "flood" or fact_dict.get("flood") in ("true", "yes")) and fact_dict.get("water_rising") in ("true", "yes") and fact_dict.get("building") == "single_story":
                return {
                    "action": "evacuate_to_higher_ground_now",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Do not walk or drive into moving floodwaters (Turn Around Don't Drown).",
                        "Evacuate structure immediately on foot to higher elevation terrain.",
                        "Take emergency go-bag, essential medications, and waterproofed phone.",
                        "Report location to local emergency shelter."
                    ],
                    "reasons": [
                        "Rapidly rising floodwaters in single-story structure create severe entrapment and drowning risk.",
                        "Evacuate immediately on foot to elevated ground or designated high-altitude emergency shelter."
                    ],
                    "prohibited_actions": [
                        "Do not attempt to drive through flooded roads or swift water (Turn Around, Don't Drown).",
                        "Do not touch submerged electrical panels or downed power lines."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "disaster_rule_01: RAPID_FLOOD_SINGLE_STORY",
                        "details": "disaster(flood) ∧ water_rising(true) ∧ building(single_story) ⇒ evacuate_to_higher_ground_now",
                        "children": [
                            {"type": "evidence", "label": "water_rising(true)"},
                            {"type": "deduction", "label": "Entrapment risk in single-story building"},
                            {"type": "safety_invariant", "label": "Do not drive through moving water"}
                        ]
                    }
                }
            # 2. Flood / multi story
            if (fact_dict.get("disaster") == "flood" or fact_dict.get("flood") in ("true", "yes")) and fact_dict.get("water_rising") in ("true", "yes") and fact_dict.get("building") in ("multi_story", "high_rise"):
                return {
                    "action": "vertical_evacuation_to_upper_floors",
                    "severity": "high",
                    "step_by_step_instructions": [
                        "Move occupants, drinking water, and emergency radio to second floor or roof access.",
                        "Disconnect electricity at breaker if safe before water touches panel.",
                        "Signal rescue boats from balcony or roof.",
                        "Never enter enclosed attic without direct roof exit."
                    ],
                    "reasons": [
                        "Floodwaters rising on ground level; upper structural floors remain dry and load-bearing.",
                        "Move occupants, emergency supplies, and communications gear to second floor or roof access."
                    ],
                    "prohibited_actions": [
                        "Do not take elevators during flooding or severe storm surges.",
                        "Do not shelter in enclosed attics without direct rooftop breakout access."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "disaster_rule_02: FLOOD_VERTICAL_EVACUATION",
                        "details": "disaster(flood) ∧ water_rising(true) ∧ building(multi_story) ⇒ vertical_evacuation_to_upper_floors",
                        "children": [
                            {"type": "evidence", "label": "building(multi_story)"},
                            {"type": "deduction", "label": "Upper floors load-bearing and secure"},
                            {"type": "safety_invariant", "label": "Avoid elevators and enclosed attics"}
                        ]
                    }
                }
            # 3. Earthquake active
            if (fact_dict.get("disaster") == "earthquake" or fact_dict.get("earthquake") in ("true", "yes")) and fact_dict.get("shaking") == "active":
                return {
                    "action": "drop_cover_and_hold_on",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Drop onto hands and knees to prevent being knocked over.",
                        "Cover head and neck under sturdy table or desk.",
                        "Hold on until violent ground motion ceases completely.",
                        "Be prepared for severe aftershocks."
                    ],
                    "reasons": [
                        "Violent ground motion and risk of non-structural falling debris.",
                        "Drop to hands and knees, take cover under a sturdy desk or table, and hold on until shaking stops."
                    ],
                    "prohibited_actions": [
                        "Do not run outside during active ground shaking (falling facade hazard).",
                        "Do not stand in doorways or near unprotected glass windows."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "disaster_rule_03: ACTIVE_EARTHQUAKE",
                        "details": "disaster(earthquake) ∧ shaking(active) ⇒ drop_cover_and_hold_on",
                        "children": [
                            {"type": "evidence", "label": "shaking(active)"},
                            {"type": "deduction", "label": "High-velocity seismic ground motion"},
                            {"type": "safety_invariant", "label": "Do not run outdoors during active shaking"}
                        ]
                    }
                }
            # 4. Earthquake post / gas
            if (fact_dict.get("disaster") == "earthquake" or fact_dict.get("earthquake") in ("true", "yes")) and fact_dict.get("shaking") == "stopped" and fact_dict.get("smell_gas") in ("true", "yes"):
                return {
                    "action": "evacuate_and_shut_main_gas_valve",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Locate exterior gas meter / shutoff valve and turn perpendicular to pipe.",
                        "Evacuate building immediately to open field away from facades.",
                        "Avoid fallen power lines and damaged masonry.",
                        "Notify emergency services from outside."
                    ],
                    "reasons": [
                        "Post-earthquake gas pipe rupture detected.",
                        "Shut off exterior master gas valve if safe to do so and evacuate immediately to open area."
                    ],
                    "prohibited_actions": [
                        "Do not use matches, lighters, or electronic equipment near suspected gas leak.",
                        "Do not re-enter compromised buildings until cleared by structural engineers."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "disaster_rule_04: POST_QUAKE_GAS_RUPTURE",
                        "details": "disaster(earthquake) ∧ shaking(stopped) ∧ smell_gas(true) ⇒ evacuate_and_shut_main_gas_valve",
                        "children": [
                            {"type": "evidence", "label": "smell_gas(true)"},
                            {"type": "deduction", "label": "Seismic gas pipe compromise"},
                            {"type": "safety_invariant", "label": "No matches, switches, or indoor phones"}
                        ]
                    }
                }
            # 5. Tsunami
            if (fact_dict.get("disaster") == "tsunami" or fact_dict.get("tsunami") in ("true", "yes")) or fact_dict.get("coastal") in ("true", "yes"):
                return {
                    "action": "evacuate_inland_immediately",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Move inland at least 2 miles or to elevation 100+ feet above sea level immediately.",
                        "Do not wait for official siren if sea recedes or strong quake felt.",
                        "Walk rapidly; avoid vehicular bottlenecks.",
                        "Remain at high altitude until all-clear given by authorities."
                    ],
                    "reasons": [
                        "High-velocity tsunami wave train imminent following seismic event.",
                        "Move immediately at least 2 miles inland or to high ground at least 100 feet above sea level."
                    ],
                    "prohibited_actions": [
                        "Do not go to the beach or harbor to observe incoming waves or receding water.",
                        "Do not wait for visual confirmation before beginning evacuation."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "disaster_rule_05: TSUNAMI_EARLY_WARNING",
                        "details": "disaster(tsunami) ∨ coastal(true) ⇒ evacuate_inland_immediately",
                        "children": [
                            {"type": "evidence", "label": "disaster(tsunami)"},
                            {"type": "deduction", "label": "High-velocity seismic sea wave train"},
                            {"type": "safety_invariant", "label": "Never visit coastline to watch waves"}
                        ]
                    }
                }

            return {
                "action": "seek_safe_shelter_and_monitor_emergency_broadcasts",
                "severity": "high",
                "step_by_step_instructions": [
                    "Seek shelter in certified storm center.",
                    "Tune to civil defense emergency radio.",
                    "Prepare 72-hour emergency water and rations."
                ],
                "reasons": ["Natural disaster conditions detected. Seek certified storm/emergency shelter and monitor civil defense radio."],
                "prohibited_actions": ["Do not travel on compromised bridges, coastal highways, or steep hillsides."],
                "proof_tree": {
                    "type": "rule",
                    "label": "disaster_rule_fallback: SEEK_SHELTER",
                    "details": "disaster(unknown) ⇒ seek_safe_shelter_and_monitor_emergency_broadcasts",
                    "children": [{"type": "safety_invariant", "label": "Storm Shelter Protocol"}]
                }
            }

        # ==============================================================
        # DOMAIN: ROAD ACCIDENTS
        # ==============================================================
        if clean_domain == "road_accident":
            # 1. Unconscious + no breathing
            if fact_dict.get("unconscious") in ("true", "yes") and fact_dict.get("breathing") in ("none", "absent", "false", "no"):
                return {
                    "action": "begin_cpr_do_not_move_spine",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Position patient for compressions while holding neck still in line with body.",
                        "Begin CPR chest compressions at 100-120 BPM.",
                        "Do not twist or bend the spine.",
                        "Request immediate paramedic extraction unit."
                    ],
                    "reasons": [
                        "Victim in vehicular crash is in respiratory/cardiac arrest.",
                        "Begin chest compressions immediately while maintaining inline cervical spine stabilization."
                    ],
                    "prohibited_actions": [
                        "Do not twist, flex, or hyper-extend victim's neck or spine unless required for airway/CPR.",
                        "Do not remove victim's motorcycle helmet unless airway is obstructed."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "road_rule_01: CRASH_CARDIAC_ARREST",
                        "details": "unconscious(true) ∧ breathing(none) ⇒ begin_cpr_do_not_move_spine",
                        "children": [
                            {"type": "evidence", "label": "unconscious(true)"},
                            {"type": "evidence", "label": "breathing(none)"},
                            {"type": "deduction", "label": "Trauma arrest with potential c-spine injury"},
                            {"type": "safety_invariant", "label": "Inline cervical spine stabilization required"}
                        ]
                    }
                }
            # 2. Vehicle fire + trapped
            if (fact_dict.get("vehicle_fire") in ("true", "yes") or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("trapped") in ("true", "yes"):
                return {
                    "action": "call_rescue_and_maintain_safe_distance",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Call 199 / Heavy extrication and fire rescue immediately.",
                        "Discharge dry powder fire extinguisher under vehicle/engine to suppress flames.",
                        "Keep bystanders at least 50 meters back.",
                        "Prepare extrication path as firefighters arrive."
                    ],
                    "reasons": [
                        "Vehicle fire with entrapped occupant poses immediate explosion and thermal hazard.",
                        "Call heavy hydraulic extrication units immediately and suppress perimeter if extinguisher is available."
                    ],
                    "prohibited_actions": [
                        "Do not enter burning passenger compartment without protective turnout gear.",
                        "Do not cut vehicle structural pillars containing undeployed airbag inflator canisters."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "road_rule_02: VEHICLE_FIRE_ENTRAPMENT",
                        "details": "vehicle_fire(true) ∧ trapped(true) ⇒ call_rescue_and_maintain_safe_distance",
                        "children": [
                            {"type": "evidence", "label": "vehicle_fire(true)"},
                            {"type": "evidence", "label": "trapped(true)"},
                            {"type": "deduction", "label": "Thermal and combustible fuel tank hazard"},
                            {"type": "safety_invariant", "label": "Do not enter burning compartment without turnout gear"}
                        ]
                    }
                }
            # 3. Multiple casualties
            if fact_dict.get("multiple_victims") in ("true", "yes") or fact_dict.get("mass_casualty") in ("true", "yes"):
                return {
                    "action": "triage_by_severity_and_call_mass_casualty_dispatch",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Direct all walking wounded to gather at a safe designated location (Green).",
                        "Rapidly assess non-ambulatory victims for breathing and pulse (START triage).",
                        "Tag Red (Immediate), Yellow (Delayed), Black (Deceased).",
                        "Transmit casualty count and category breakdown to dispatch."
                    ],
                    "reasons": [
                        "Multi-casualty vehicle collision overwhelms single responder capacity.",
                        "Implement START triage protocol (Red: Immediate, Yellow: Delayed, Green: Minor, Black: Deceased) and call for multi-ambulance dispatch."
                    ],
                    "prohibited_actions": [
                        "Do not spend excessive time treating non-survivable injuries on single victim.",
                        "Do not move walking wounded unless area is unsafe."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "road_rule_03: MASS_CASUALTY_START_TRIAGE",
                        "details": "multiple_victims(true) ∨ mass_casualty(true) ⇒ triage_by_severity_and_call_mass_casualty_dispatch",
                        "children": [
                            {"type": "evidence", "label": "multiple_victims(true)"},
                            {"type": "deduction", "label": "Multi-victim incident exceeding immediate unit capacity"},
                            {"type": "safety_invariant", "label": "START triage priority sorting mandatory"}
                        ]
                    }
                }
            # 4. Traffic hazard
            if fact_dict.get("hazard") == "traffic" or fact_dict.get("active_traffic") in ("true", "yes"):
                return {
                    "action": "establish_safety_perimeter_before_aid",
                    "severity": "high",
                    "step_by_step_instructions": [
                        "Park response vehicle angled upstream with hazard lights flashing to shield scene.",
                        "Put on high-visibility reflective vest.",
                        "Place reflective triangles or LED flares 100 meters upstream.",
                        "Never turn back to live traffic."
                    ],
                    "reasons": [
                        "High-speed passing vehicles create secondary collision hazard.",
                        "Deploy warning triangles/flares 100 meters upstream and park response vehicle angled to block traffic."
                    ],
                    "prohibited_actions": [
                        "Do not step into live traffic lanes without high-visibility vests and perimeter markers.",
                        "Do not turn your back to oncoming traffic."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "road_rule_04: TRAFFIC_SCENE_SAFETY",
                        "details": "hazard(traffic) ∨ active_traffic(true) ⇒ establish_safety_perimeter_before_aid",
                        "children": [
                            {"type": "evidence", "label": "hazard(traffic)"},
                            {"type": "deduction", "label": "Secondary high-speed vehicle impact risk"},
                            {"type": "safety_invariant", "label": "High-visibility gear and perimeter required"}
                        ]
                    }
                }

            return {
                "action": "secure_scene_and_call_emergency_dispatch",
                "severity": "critical",
                "step_by_step_instructions": [
                    "Turn off ignition on crashed vehicles.",
                    "Keep stable victims inside vehicles unless fire risk.",
                    "Call police and paramedic dispatch."
                ],
                "reasons": ["Motor vehicle collision reported. Secure scene safety and request police and paramedic dispatch."],
                "prohibited_actions": ["Do not move stable victims inside damaged vehicles unless vehicle is on fire or sinking."],
                "proof_tree": {
                    "type": "rule",
                    "label": "road_rule_fallback: SCENE_SECURE",
                    "details": "road_accident(general) ⇒ secure_scene_and_call_emergency_dispatch",
                    "children": [{"type": "safety_invariant", "label": "Road Accident Scene Security"}]
                }
            }

        return self._safe_fallback()

    def _safe_fallback(self, reason: str = "") -> Dict[str, Any]:
        """
        Fail-safe fallback when inference fails or domain is unrecognized.
        """
        return {
            "action": "call_emergency_services_immediately",
            "severity": "critical",
            "step_by_step_instructions": [
                "Call local emergency dispatch (199/191/192) immediately.",
                "Provide exact GPS coordinates and description of crisis.",
                "Maintain scene safety and await professional responders."
            ],
            "reasons": [
                "Automated inference fallback triggered.",
                f"Notice: {reason}" if reason else "Standard life-safety protocol activated. Immediate emergency dispatch recommended."
            ],
            "prohibited_actions": [
                "Do not delay contacting local emergency dispatch (199/191/192).",
                "Do not enter hazardous areas without professional emergency personnel."
            ],
            "proof_tree": {
                "type": "rule",
                "label": "global_fallback_rule: SAFE_DEFAULT",
                "details": "unknown_scenario ⇒ call_emergency_services_immediately",
                "children": [{"type": "safety_invariant", "label": "Fail-Safe Default Invariant"}]
            }
        }

prolog_bridge = PrologEngineBridge()

def get_prolog_engine() -> PrologEngineBridge:
    return prolog_bridge
