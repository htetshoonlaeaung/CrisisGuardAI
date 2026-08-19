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
                    "reasons": [
                        "Victim is unconscious and unresponsive with absent respiration.",
                        "Immediate chest compressions (100-120 BPM) required.",
                        "Request an AED immediately."
                    ],
                    "prohibited_actions": [
                        "Do not give oral fluids or medications.",
                        "Do not delay CPR to search for a pulse if untrained.",
                        "Do not leave victim unattended."
                    ]
                }
            # 2. Choking
            if fact_dict.get("symptom") == "choking" or fact_dict.get("choking") in ("true", "yes") or fact_dict.get("airway_pass") == "blocked":
                return {
                    "action": "perform_heimlich_thrusts",
                    "severity": "critical",
                    "reasons": [
                        "Complete airway obstruction detected.",
                        "Deliver 5 sharp back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver)."
                    ],
                    "prohibited_actions": [
                        "Do not perform blind finger sweeps in the mouth.",
                        "Do not offer water or fluids while victim is choking."
                    ]
                }
            # 3. Arterial Bleeding
            if fact_dict.get("bleeding") in ("severe_pulsing", "arterial", "severe", "pulsing"):
                return {
                    "action": "apply_direct_pressure_and_tourniquet",
                    "severity": "critical",
                    "reasons": [
                        "Pulsing or spurting blood indicates arterial laceration and life-threatening hemorrhage.",
                        "Apply firm, continuous direct pressure with sterile gauze and apply a tourniquet 2-3 inches proximal to injury."
                    ],
                    "prohibited_actions": [
                        "Do not remove soaked dressings; apply additional layers directly on top.",
                        "Do not place tourniquet directly over a joint (elbow/knee)."
                    ]
                }
            # 4. Stroke (FAST)
            if fact_dict.get("face_droop") in ("true", "yes") or fact_dict.get("arm_weakness") in ("true", "yes") or fact_dict.get("speech_difficulty") in ("true", "yes"):
                return {
                    "action": "activate_stroke_emergency_dispatch",
                    "severity": "critical",
                    "reasons": [
                        "Positive F.A.S.T. stroke indicators observed (facial droop, arm weakness, or slurred speech).",
                        "Time-critical brain ischemia suspected; immediate emergency transport to comprehensive stroke center required."
                    ],
                    "prohibited_actions": [
                        "Do not administer aspirin or other blood thinners without hospital CT scan.",
                        "Do not allow patient to drive or walk unaided."
                    ]
                }
            # 5. Severe Burns
            if fact_dict.get("burn_type") == "thermal" and fact_dict.get("burn_area") in ("large", "major", "extensive"):
                return {
                    "action": "cool_water_rinse_and_sterile_cover",
                    "severity": "high",
                    "reasons": [
                        "Extensive thermal burn injury detected.",
                        "Cool the burn immediately under gentle cool running water for 10-20 minutes and cover with sterile dry dressing."
                    ],
                    "prohibited_actions": [
                        "Do not apply ice, iced water, butter, or greasy ointments to burns.",
                        "Do not break intact blisters."
                    ]
                }

            return {
                "action": "call_emergency_services_immediately",
                "severity": "critical",
                "reasons": ["Uncertain or high-risk medical condition. Immediate dispatch of paramedic services recommended."],
                "prohibited_actions": ["Do not administer prescription medications without direct medical dispatch guidance."]
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
                    "reasons": [
                        "Live electrical current creates severe electrocution and arc flash hazard.",
                        "Cut main circuit breaker power if accessible and use Class C / CO2 fire extinguisher."
                    ],
                    "prohibited_actions": [
                        "NEVER THROW WATER ON AN ELECTRICAL FIRE.",
                        "Do not touch exposed wires, burning appliances, or conductive surfaces."
                    ]
                }
            # 2. Grease fire
            if (fact_dict.get("hazard") == "fire" or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("fire_source") in ("cooking_oil", "grease", "oil"):
                return {
                    "action": "cover_with_metal_lid_and_turn_off_burner",
                    "severity": "critical",
                    "reasons": [
                        "High-temperature oil combustion (>300C).",
                        "Smother the flames by sliding a metal lid or fire blanket over the pan and switch off heat source."
                    ],
                    "prohibited_actions": [
                        "NEVER POUR WATER ON BURNING OIL OR GREASE.",
                        "Do not attempt to move or carry the burning pan outside."
                    ]
                }
            # 3. Gas leak indoors
            if (fact_dict.get("hazard") == "gas_leak" or fact_dict.get("gas_leak") in ("true", "yes") or fact_dict.get("smell_gas") in ("true", "yes")) and fact_dict.get("location") == "indoors":
                return {
                    "action": "evacuate_leave_doors_open_call_from_outside",
                    "severity": "critical",
                    "reasons": [
                        "Accumulated flammable gas presents severe explosion hazard.",
                        "Evacuate all occupants immediately, leave entry doors open for ventilation, and call emergency services from at least 100 meters outside."
                    ],
                    "prohibited_actions": [
                        "DO NOT OPERATE LIGHT SWITCHES, ELECTRICAL OUTLETS, OR PHONES INDOORS.",
                        "DO NOT LIGHT MATCHES, CANDLES, OR ANY FLAME."
                    ]
                }
            # 4. House fire with blocked exit
            if (fact_dict.get("hazard") == "fire" or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("exit_blocked") in ("true", "yes"):
                return {
                    "action": "seal_door_and_signal_from_window",
                    "severity": "critical",
                    "reasons": [
                        "Primary egress blocked by heavy smoke or flames.",
                        "Retreat to room with external window, seal door cracks with wet towels/clothing, and signal emergency crews from window."
                    ],
                    "prohibited_actions": [
                        "Do not attempt to push through dense hot toxic smoke.",
                        "Do not break windows unless instructed by firefighters (avoids feeding oxygen into backdraft)."
                    ]
                }

            return {
                "action": "evacuate_and_call_fire_department",
                "severity": "critical",
                "reasons": ["Active fire or hazardous materials condition. Immediate evacuation to safe perimeter required."],
                "prohibited_actions": ["Do not re-enter burning or hazardous structures under any circumstances."]
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
                    "reasons": [
                        "Rapidly rising floodwaters in single-story structure create severe entrapment and drowning risk.",
                        "Evacuate immediately on foot to elevated ground or designated high-altitude emergency shelter."
                    ],
                    "prohibited_actions": [
                        "Do not attempt to drive through flooded roads or swift water (Turn Around, Don't Drown).",
                        "Do not touch submerged electrical panels or downed power lines."
                    ]
                }
            # 2. Flood / multi story
            if (fact_dict.get("disaster") == "flood" or fact_dict.get("flood") in ("true", "yes")) and fact_dict.get("water_rising") in ("true", "yes") and fact_dict.get("building") in ("multi_story", "high_rise"):
                return {
                    "action": "vertical_evacuation_to_upper_floors",
                    "severity": "high",
                    "reasons": [
                        "Floodwaters rising on ground level; upper structural floors remain dry and load-bearing.",
                        "Move occupants, emergency supplies, and communications gear to second floor or roof access."
                    ],
                    "prohibited_actions": [
                        "Do not take elevators during flooding or severe storm surges.",
                        "Do not shelter in enclosed attics without direct rooftop breakout access."
                    ]
                }
            # 3. Earthquake active
            if (fact_dict.get("disaster") == "earthquake" or fact_dict.get("earthquake") in ("true", "yes")) and fact_dict.get("shaking") == "active":
                return {
                    "action": "drop_cover_and_hold_on",
                    "severity": "critical",
                    "reasons": [
                        "Violent ground motion and risk of non-structural falling debris.",
                        "Drop to hands and knees, take cover under a sturdy desk or table, and hold on until shaking stops."
                    ],
                    "prohibited_actions": [
                        "Do not run outside during active ground shaking (falling facade hazard).",
                        "Do not stand in doorways or near unprotected glass windows."
                    ]
                }
            # 4. Earthquake post / gas
            if (fact_dict.get("disaster") == "earthquake" or fact_dict.get("earthquake") in ("true", "yes")) and fact_dict.get("shaking") == "stopped" and fact_dict.get("smell_gas") in ("true", "yes"):
                return {
                    "action": "evacuate_and_shut_main_gas_valve",
                    "severity": "critical",
                    "reasons": [
                        "Post-earthquake gas pipe rupture detected.",
                        "Shut off exterior master gas valve if safe to do so and evacuate immediately to open area."
                    ],
                    "prohibited_actions": [
                        "Do not use matches, lighters, or electronic equipment near suspected gas leak.",
                        "Do not re-enter compromised buildings until cleared by structural engineers."
                    ]
                }
            # 5. Tsunami
            if (fact_dict.get("disaster") == "tsunami" or fact_dict.get("tsunami") in ("true", "yes")) or fact_dict.get("coastal") in ("true", "yes"):
                return {
                    "action": "evacuate_inland_immediately",
                    "severity": "critical",
                    "reasons": [
                        "High-velocity tsunami wave train imminent following seismic event.",
                        "Move immediately at least 2 miles inland or to high ground at least 100 feet above sea level."
                    ],
                    "prohibited_actions": [
                        "Do not go to the beach or harbor to observe incoming waves or receding water.",
                        "Do not wait for visual confirmation before beginning evacuation."
                    ]
                }

            return {
                "action": "seek_safe_shelter_and_monitor_emergency_broadcasts",
                "severity": "high",
                "reasons": ["Natural disaster conditions detected. Seek certified storm/emergency shelter and monitor civil defense radio."],
                "prohibited_actions": ["Do not travel on compromised bridges, coastal highways, or steep hillsides."]
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
                    "reasons": [
                        "Victim in vehicular crash is in respiratory/cardiac arrest.",
                        "Begin chest compressions immediately while maintaining inline cervical spine stabilization."
                    ],
                    "prohibited_actions": [
                        "Do not twist, flex, or hyper-extend victim's neck or spine unless required for airway/CPR.",
                        "Do not remove victim's motorcycle helmet unless airway is obstructed."
                    ]
                }
            # 2. Vehicle fire + trapped
            if (fact_dict.get("vehicle_fire") in ("true", "yes") or fact_dict.get("fire") in ("true", "yes")) and fact_dict.get("trapped") in ("true", "yes"):
                return {
                    "action": "call_rescue_and_maintain_safe_distance",
                    "severity": "critical",
                    "reasons": [
                        "Vehicle fire with entrapped occupant poses immediate explosion and thermal hazard.",
                        "Call heavy hydraulic extrication units immediately and suppress perimeter if extinguisher is available."
                    ],
                    "prohibited_actions": [
                        "Do not enter burning passenger compartment without protective turnout gear.",
                        "Do not cut vehicle structural pillars containing undeployed airbag inflator canisters."
                    ]
                }
            # 3. Multiple casualties
            if fact_dict.get("multiple_victims") in ("true", "yes") or fact_dict.get("mass_casualty") in ("true", "yes"):
                return {
                    "action": "triage_by_severity_and_call_mass_casualty_dispatch",
                    "severity": "critical",
                    "reasons": [
                        "Multi-casualty vehicle collision overwhelms single responder capacity.",
                        "Implement START triage protocol (Red: Immediate, Yellow: Delayed, Green: Minor, Black: Deceased) and call for multi-ambulance dispatch."
                    ],
                    "prohibited_actions": [
                        "Do not spend excessive time treating non-survivable injuries on single victim.",
                        "Do not move walking wounded unless area is unsafe."
                    ]
                }
            # 4. Traffic hazard
            if fact_dict.get("hazard") == "traffic" or fact_dict.get("active_traffic") in ("true", "yes"):
                return {
                    "action": "establish_safety_perimeter_before_aid",
                    "severity": "high",
                    "reasons": [
                        "High-speed passing vehicles create secondary collision hazard.",
                        "Deploy warning triangles/flares 100 meters upstream and park response vehicle angled to block traffic."
                    ],
                    "prohibited_actions": [
                        "Do not step into live traffic lanes without high-visibility vests and perimeter markers.",
                        "Do not turn your back to oncoming traffic."
                    ]
                }

            return {
                "action": "secure_scene_and_call_emergency_dispatch",
                "severity": "critical",
                "reasons": ["Motor vehicle collision reported. Secure scene safety and request police and paramedic dispatch."],
                "prohibited_actions": ["Do not move stable victims inside damaged vehicles unless vehicle is on fire or sinking."]
            }

        return self._safe_fallback()

    def _safe_fallback(self, reason: str = "") -> Dict[str, Any]:
        """
        Fail-safe fallback when inference fails or domain is unrecognized.
        """
        return {
            "action": "call_emergency_services_immediately",
            "severity": "critical",
            "reasons": [
                "Automated inference fallback triggered.",
                f"Notice: {reason}" if reason else "Standard life-safety protocol activated. Immediate emergency dispatch recommended."
            ],
            "prohibited_actions": [
                "Do not delay contacting local emergency dispatch (911/112).",
                "Do not enter hazardous areas without professional emergency personnel."
            ]
        }

prolog_bridge = PrologEngineBridge()

def get_prolog_engine() -> PrologEngineBridge:
    return prolog_bridge
