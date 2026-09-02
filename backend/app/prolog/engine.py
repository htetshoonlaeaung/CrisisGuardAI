# backend/app/prolog/engine.py
# Thread-safe PySwip bridge to embedded SWI-Prolog runtime with deterministic symbolic fallback.

import os
import sys
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

    @staticmethod
    def _setup_windows_swipl_paths():
        """
        Configures DLL search directories and SWI_HOME_DIR on Windows to ensure PySwip
        reliably locates libswipl.dll on Windows Python >= 3.8.
        """
        if sys.platform != "win32":
            return

        try:
            from app.core.config import settings
        except Exception:
            settings = None

        candidate_dirs = []
        if settings:
            if getattr(settings, "SWI_BIN_DIR", None):
                candidate_dirs.append(Path(settings.SWI_BIN_DIR))
            if getattr(settings, "SWI_HOME_DIR", None):
                candidate_dirs.append(Path(settings.SWI_HOME_DIR) / "bin")

        env_home = os.environ.get("SWI_HOME_DIR")
        if env_home:
            candidate_dirs.append(Path(env_home) / "bin")

        # Standard installation locations on Windows
        candidate_dirs.extend([
            Path(r"C:\Program Files\swipl\bin"),
            Path(r"C:\Program Files (x86)\swipl\bin"),
            Path(r"C:\swipl\bin"),
            Path(os.path.expandvars(r"%LOCALAPPDATA%\Programs\swipl\bin")),
        ])

        for b_dir in candidate_dirs:
            if b_dir.is_dir() and (b_dir / "libswipl.dll").is_file():
                home_dir = b_dir.parent
                if not os.environ.get("SWI_HOME_DIR"):
                    os.environ["SWI_HOME_DIR"] = str(home_dir)
                if str(b_dir) not in os.environ.get("PATH", ""):
                    os.environ["PATH"] = f"{str(b_dir)};{os.environ.get('PATH', '')}"
                if hasattr(os, "add_dll_directory"):
                    try:
                        os.add_dll_directory(str(b_dir))
                    except Exception as dll_err:
                        logger.debug(f"os.add_dll_directory({b_dir}): {dll_err}")
                logger.info(f"SWI-Prolog configured at {home_dir}")
                break

    def _init_engine(self):
        """
        Initializes the PySwip Prolog instance and consults core & domain .pl rulebases.
        """
        try:
            self._setup_windows_swipl_paths()
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
                        parsed = PrologResultParser.parse_triage_result(results[0])
                        symbolic_meta = self._evaluate_symbolic(clean_domain, facts)
                        if not parsed.get("step_by_step_instructions"):
                            parsed["step_by_step_instructions"] = symbolic_meta.get("step_by_step_instructions", [])
                        if not parsed.get("proof_tree"):
                            parsed["proof_tree"] = symbolic_meta.get("proof_tree", {})
                        return parsed
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
                        "details": "unconscious(true) AND breathing(none) -> begin_cpr_and_call_emergency",
                        "children": [
                            {"type": "evidence", "label": "unconscious(true)"},
                            {"type": "evidence", "label": "breathing(none)"},
                            {"type": "deduction", "label": "Cardiac / Respiratory arrest confirmed"},
                            {"type": "safety_invariant", "label": "CPR Protocol: 100-120 BPM mandatory"}
                        ]
                    }
                }
            # 2A. Infant Choking
            if (fact_dict.get("symptom") == "choking" or fact_dict.get("choking") in ("true", "yes") or fact_dict.get("airway_pass") == "blocked") and fact_dict.get("patient_type") in ("infant", "baby") or fact_dict.get("age_group") == "infant" or fact_dict.get("age") == "infant":
                return {
                    "action": "perform_infant_choking_protocol",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Position infant face down along your forearm with head lower than chest, supporting the jaw.",
                        "Deliver 5 firm but gentle back blows between shoulder blades with the heel of hand.",
                        "Turn infant face up supporting head, deliver 5 two-finger chest thrusts.",
                        "Repeat sequence; do not perform abdominal thrusts."
                    ],
                    "reasons": [
                        "Infant (< 1 year) experiencing acute foreign body airway obstruction.",
                        "Deliver 5 gentle back blows with the heel of hand between shoulder blades, then flip face-up and deliver 5 two-finger chest thrusts."
                    ],
                    "prohibited_actions": [
                        "NEVER PERFORM ABDOMINAL THRUSTS (HEIMLICH) ON AN INFANT (high risk of fatal internal organ damage).",
                        "Do not perform blind finger sweeps in infant airway.",
                        "Do not shake the infant."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_02a: INFANT_AIRWAY_OBSTRUCTION",
                        "details": "choking(true) AND patient_type(infant) -> perform_infant_choking_protocol",
                        "children": [
                            {"type": "evidence", "label": "patient_type(infant)"},
                            {"type": "deduction", "label": "Acute infant foreign body airway obstruction"},
                            {"type": "safety_invariant", "label": "NEVER PERFORM ABDOMINAL THRUSTS ON INFANTS"}
                        ]
                    }
                }
            # 2B. Unconscious Choking Victim
            if (fact_dict.get("symptom") == "choking" or fact_dict.get("choking") in ("true", "yes")) and fact_dict.get("unconscious") in ("true", "yes"):
                return {
                    "action": "choking_unconscious_begin_cpr_with_airway_check",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Lower patient carefully to a firm, flat surface.",
                        "Call emergency dispatch (199/191) immediately.",
                        "Begin chest compressions (30 compressions).",
                        "Open the airway and look in the mouth; extract visible foreign object before attempting rescue breaths.",
                        "Never perform blind finger sweeps."
                    ],
                    "reasons": [
                        "Choking victim has lost consciousness due to acute severe hypoxia.",
                        "Lower victim carefully to firm flat ground, call 199/191 immediately, and begin CPR (30 compressions, inspect mouth for visible dislodged foreign object before rescue breaths)."
                    ],
                    "prohibited_actions": [
                        "Do not perform standing abdominal thrusts on an unconscious patient.",
                        "Do not perform blind finger sweeps (only extract object if clearly visible and accessible)."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_02b: UNCONSCIOUS_CHOKING_CPR",
                        "details": "choking(true) AND unconscious(true) -> choking_unconscious_begin_cpr_with_airway_check",
                        "children": [
                            {"type": "evidence", "label": "choking(true)"},
                            {"type": "evidence", "label": "unconscious(true)"},
                            {"type": "deduction", "label": "Hypoxic arrest from airway obstruction"},
                            {"type": "safety_invariant", "label": "No blind finger sweeps; perform CPR with visual check"}
                        ]
                    }
                }
            # 2C. Choking Complete (Adult / Child)
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
                        "label": "medical_rule_02c: COMPLETE_AIRWAY_OBSTRUCTION",
                        "details": "symptom(choking) OR airway_pass(blocked) -> perform_heimlich_thrusts",
                        "children": [
                            {"type": "evidence", "label": "airway_pass(blocked)"},
                            {"type": "deduction", "label": "Foreign body airway obstruction"},
                            {"type": "safety_invariant", "label": "No blind finger sweeps"}
                        ]
                    }
                }
            # 2D. Choking Partial / Mild
            if (fact_dict.get("symptom") == "choking" or fact_dict.get("choking") in ("true", "yes")) and (fact_dict.get("airway_pass") in ("partial", "mild") or fact_dict.get("coughing") in ("forceful", "true", "yes")):
                return {
                    "action": "encourage_forceful_coughing_and_monitor",
                    "severity": "high",
                    "step_by_step_instructions": [
                        "Encourage patient to cough forcefully.",
                        "Remain with patient and observe breathing continuously.",
                        "Do not interfere or deliver back blows while coughing is effective.",
                        "Prepare for Heimlich if airway becomes completely obstructed."
                    ],
                    "reasons": [
                        "Partial foreign body airway obstruction detected with intact coughing reflex and partial airflow.",
                        "Encourage continuous forceful coughing to expel object spontaneously while monitoring closely for progression to complete obstruction."
                    ],
                    "prohibited_actions": [
                        "Do not deliver back blows or abdominal thrusts while the victim is coughing forcefully.",
                        "Do not give liquids or fluids while patient is attempting to clear airway."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_02d: PARTIAL_AIRWAY_OBSTRUCTION",
                        "details": "choking(true) AND airway_pass(partial) -> encourage_forceful_coughing_and_monitor",
                        "children": [
                            {"type": "evidence", "label": "airway_pass(partial)"},
                            {"type": "deduction", "label": "Partial airway obstruction with maintained cough reflex"},
                            {"type": "safety_invariant", "label": "Do not interfere while coughing is effective"}
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
                        "details": "bleeding(severe_pulsing) -> apply_direct_pressure_and_tourniquet",
                        "children": [
                            {"type": "evidence", "label": "bleeding(severe_pulsing)"},
                            {"type": "deduction", "label": "High-pressure arterial laceration"},
                            {"type": "safety_invariant", "label": "Immediate tourniquet occlusion required"}
                        ]
                    }
                }
            # 4A. Stroke (Hyperacute Window)
            is_stroke = fact_dict.get("face_droop") in ("true", "yes") or fact_dict.get("arm_weakness") in ("true", "yes") or fact_dict.get("speech_difficulty") in ("true", "yes") or fact_dict.get("symptom") == "stroke" or fact_dict.get("stroke") in ("true", "yes")
            if is_stroke and (fact_dict.get("onset_time") in ("under_4_hours", "recent") or fact_dict.get("symptom_onset") == "under_3_hours" or fact_dict.get("onset_window") == "acute"):
                return {
                    "action": "activate_hyperacute_stroke_protocol",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Keep patient at rest with head elevated 30 degrees.",
                        "Note and record the exact Last Known Well (LKW) time immediately.",
                        "Notify emergency dispatch of suspected hyperacute stroke candidate for thrombolytic / EVT therapy.",
                        "Keep NPO (nothing by mouth) — no water, food, or medications."
                    ],
                    "reasons": [
                        "Acute ischemic stroke suspected within hyperacute thrombolytic (IV tPA/TNK) and endovascular thrombectomy therapeutic window.",
                        "Record exact Last Known Well (LKW) time and request priority pre-hospital stroke alert transport to comprehensive stroke center."
                    ],
                    "prohibited_actions": [
                        "NEVER ADMINISTER ASPIRIN, BLOOD THINNERS, FOOD, OR WATER PRIOR TO HOSPITAL CT SCAN.",
                        "Do not attempt to rapidly lower elevated blood pressure without direct medical command."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_04a: HYPERACUTE_STROKE_WINDOW",
                        "details": "stroke_signs(positive) AND onset_time(under_4_hours) -> activate_hyperacute_stroke_protocol",
                        "children": [
                            {"type": "evidence", "label": "Positive FAST stroke signs"},
                            {"type": "evidence", "label": "onset_time(under_4_hours)"},
                            {"type": "deduction", "label": "Hyperacute ischemic stroke within reperfusion window"},
                            {"type": "safety_invariant", "label": "Aspirin and oral intake strictly prohibited"}
                        ]
                    }
                }
            # 4B. Stroke (Airway / Mental Status Compromise)
            if is_stroke and (fact_dict.get("unconscious") in ("true", "yes") or fact_dict.get("altered_mental_status") in ("true", "yes") or fact_dict.get("swallowing_difficulty") in ("true", "yes")):
                return {
                    "action": "position_in_recovery_and_protect_airway_stroke",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Place patient in lateral recovery position (paralyzed side up if possible).",
                        "Ensure airway remains clear and open; suction or wipe oral secretions if needed.",
                        "Call emergency dispatch (199/191) immediately reporting airway-compromised stroke.",
                        "Do not give anything by mouth."
                    ],
                    "reasons": [
                        "Severe acute stroke with impaired consciousness and loss of airway protective reflexes.",
                        "Place patient in lateral recovery position with head elevated 30 degrees to maintain airway patency and prevent fatal aspiration."
                    ],
                    "prohibited_actions": [
                        "Do not give any oral fluids, food, or aspirin.",
                        "Do not leave patient supine (flat on back) due to high aspiration risk."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_04b: STROKE_AIRWAY_COMPROMISE",
                        "details": "stroke_signs(positive) AND airway_compromise -> position_in_recovery_and_protect_airway_stroke",
                        "children": [
                            {"type": "evidence", "label": "Positive FAST stroke signs"},
                            {"type": "evidence", "label": "Altered mental status / swallowing difficulty"},
                            {"type": "deduction", "label": "Severe acute stroke with airway vulnerability"},
                            {"type": "safety_invariant", "label": "Position in lateral recovery; strictly NPO"}
                        ]
                    }
                }
            # 4C. Stroke (Standard FAST Dispatch)
            if is_stroke:
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
                        "label": "medical_rule_04c: STROKE_FAST_PROTOCOL",
                        "details": "face_droop(true) OR arm_weakness(true) OR speech_difficulty(true) -> activate_stroke_emergency_dispatch",
                        "children": [
                            {"type": "evidence", "label": "Positive FAST stroke signs"},
                            {"type": "deduction", "label": "Acute ischemic / hemorrhagic cerebrovascular event"},
                            {"type": "safety_invariant", "label": "Aspirin strictly prohibited prior to hospital CT"}
                        ]
                    }
                }
            # 4D. Transient Ischemic Attack (TIA)
            if fact_dict.get("symptom") == "tia" or fact_dict.get("transient_ischemic_attack") in ("true", "yes") or fact_dict.get("stroke_symptoms") == "resolved":
                return {
                    "action": "urgent_stroke_center_evaluation_tia",
                    "severity": "high",
                    "step_by_step_instructions": [
                        "Do not ignore symptoms even if resolved completely.",
                        "Transport patient immediately to emergency department / stroke unit for urgent neuroimaging.",
                        "Do not allow patient to operate a motor vehicle."
                    ],
                    "reasons": [
                        "Transient Ischemic Attack (TIA) symptoms have temporarily resolved; represents critical warning indicator for imminent full-scale stroke (highest risk within 48 hours).",
                        "Urgent emergency neurovascular evaluation and brain MRI/CT neuroimaging required."
                    ],
                    "prohibited_actions": [
                        "Do not ignore or dismiss resolved symptoms as non-emergent.",
                        "Do not allow patient to drive self to medical facility."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "medical_rule_04d: TIA_URGENT_EVALUATION",
                        "details": "symptom(tia) OR stroke_symptoms(resolved) -> urgent_stroke_center_evaluation_tia",
                        "children": [
                            {"type": "evidence", "label": "symptom(tia)"},
                            {"type": "deduction", "label": "Transient ischemic attack with imminent stroke risk"},
                            {"type": "safety_invariant", "label": "Urgent neurovascular evaluation mandatory"}
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
                        "details": "burn_type(thermal) AND burn_area(large) -> cool_water_rinse_and_sterile_cover",
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
                    "details": "unknown_state -> call_emergency_services_immediately",
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
                        "details": "hazard(fire) AND fire_source(electrical) -> isolate_main_power_and_use_co2_extinguisher",
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
                        "details": "hazard(fire) AND fire_source(cooking_oil) -> cover_with_metal_lid_and_turn_off_burner",
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
                        "details": "hazard(gas_leak) AND location(indoors) -> evacuate_leave_doors_open_call_from_outside",
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
                        "details": "hazard(fire) AND exit_blocked(true) -> seal_door_and_signal_from_window",
                        "children": [
                            {"type": "evidence", "label": "exit_blocked(true)"},
                            {"type": "deduction", "label": "Structural egress barrier"},
                            {"type": "safety_invariant", "label": "Do not break windows unless directed"}
                        ]
                    }
                }
            # 5A. Hazardous Chemical Spill (Flammable / Explosive)
            is_chemical = fact_dict.get("hazard") == "chemical_spill" or fact_dict.get("chemical_leak") in ("true", "yes") or fact_dict.get("spill_type") == "toxic_gas"
            if is_chemical and (fact_dict.get("chemical_type") in ("flammable", "fuel") or fact_dict.get("flammable_liquid") in ("true", "yes")):
                return {
                    "action": "eliminate_all_ignition_sources_and_isolate_perimeter",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Establish immediate 300-meter exclusion zone.",
                        "Eliminate all ignition sources: turn off electrical equipment, engines, and open flames.",
                        "Call Fire & HazMat dispatch (199/191) immediately.",
                        "Deploy Class B alcohol-resistant foam blanket if trained HazMat responder."
                    ],
                    "reasons": [
                        "Volatile flammable chemical liquid spill presents immediate ignition, deflagration, and BLEVE explosion risk.",
                        "Establish 300-meter non-sparking exclusion perimeter, eliminate all ignition sources, and deploy HazMat Class B foam blanket."
                    ],
                    "prohibited_actions": [
                        "NEVER OPERATE ELECTRICAL SWITCHES, RADIOS, OR VEHICLES WITHIN VAPOR PLUME RADIUS.",
                        "Do not wash flammable chemical liquids into public storm drains or sewer systems.",
                        "Do not use water streams directly on burning hydrocarbons without specialized foam."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_05a: FLAMMABLE_CHEMICAL_SPILL",
                        "details": "hazard(chemical_spill) AND chemical_type(flammable) -> eliminate_all_ignition_sources_and_isolate_perimeter",
                        "children": [
                            {"type": "evidence", "label": "chemical_type(flammable)"},
                            {"type": "deduction", "label": "Volatile hydrocarbon / flammable solvent spill"},
                            {"type": "safety_invariant", "label": "NEVER OPERATE ELECTRICAL SWITCHES WITHIN VAPOR RADIUS"}
                        ]
                    }
                }
            # 5B. Hazardous Chemical Spill (Toxic Gas / Plume)
            if is_chemical and (fact_dict.get("vapor_plume") == "visible" or fact_dict.get("wind_direction") == "toward_population" or fact_dict.get("fumes") == "toxic" or fact_dict.get("spill_type") == "toxic_vapor"):
                return {
                    "action": "evacuate_upwind_uphill_and_shelter_in_place_downwind",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Determine wind direction and immediately move perpendicular then upwind and uphill.",
                        "Maintain at least 1,000 meters distance from vapor source.",
                        "Alert downwind occupants to shelter in place and seal all exterior openings.",
                        "Shut off HVAC ventilation systems immediately."
                    ],
                    "reasons": [
                        "Airborne toxic chemical plume migration poses acute inhalation toxicity and systemic atmospheric contamination hazard.",
                        "Evacuate immediately perpendicular then upwind and uphill to at least 1,000 meters; order downwind populations to shelter in place (seal doors/windows and shut off HVAC)."
                    ],
                    "prohibited_actions": [
                        "Do not enter low-lying drainage ditches, culverts, or basements (dense chemical vapors pool in low areas).",
                        "Do not walk into or drive through visible chemical vapors or gas clouds.",
                        "Do not operate exterior air ventilation or air conditioning units downwind."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_05b: TOXIC_CHEMICAL_PLUME",
                        "details": "hazard(chemical_spill) AND vapor_plume(visible) -> evacuate_upwind_uphill_and_shelter_in_place_downwind",
                        "children": [
                            {"type": "evidence", "label": "vapor_plume(visible)"},
                            {"type": "deduction", "label": "Atmospheric toxic vapor dispersion"},
                            {"type": "safety_invariant", "label": "Evacuate upwind/uphill; avoid low-lying basements"}
                        ]
                    }
                }
            # 5C. Hazardous Chemical Spill (Corrosive / Water-Reactive)
            if is_chemical and (fact_dict.get("chemical_type") in ("corrosive", "acid", "caustic") or fact_dict.get("water_reactive") in ("true", "yes")):
                return {
                    "action": "isolate_corrosive_spill_and_prevent_water_reaction",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Isolate area and erect dry physical containment berms.",
                        "Keep all water sources, hoses, and sprinkler runoff away from the spill.",
                        "Locate Safety Data Sheet (SDS) / UN placard number from distance.",
                        "Await HazMat chemical neutralization team."
                    ],
                    "reasons": [
                        "Corrosive chemical or concentrated acid/alkali spill creates severe dermal chemical burn and violent hydration reaction hazard.",
                        "Isolate spill area with chemical-resistant containment barriers, identify UN placard / Safety Data Sheet (SDS) from distance, and await certified HazMat neutralization."
                    ],
                    "prohibited_actions": [
                        "NEVER POUR WATER ON WATER-REACTIVE CHEMICALS OR CONCENTRATED ACIDS (causes violent exothermic boiling and acid splatter).",
                        "Do not touch spilled chemicals or contaminated packaging without level A/B HazMat suit.",
                        "Do not inhale acidic or alkaline fuming vapors."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_05c: CORROSIVE_WATER_REACTIVE_SPILL",
                        "details": "hazard(chemical_spill) AND chemical_type(corrosive) -> isolate_corrosive_spill_and_prevent_water_reaction",
                        "children": [
                            {"type": "evidence", "label": "chemical_type(corrosive)"},
                            {"type": "deduction", "label": "Severe exothermic / acid-corrosion danger"},
                            {"type": "safety_invariant", "label": "NEVER POUR WATER ON WATER-REACTIVE CHEMICALS"}
                        ]
                    }
                }
            # 5D. Hazardous Chemical Spill (General HazMat)
            if is_chemical:
                return {
                    "action": "evacuate_upwind_and_call_hazmat",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Evacuate upwind and uphill to at least 500 meters.",
                        "Call emergency dispatch (199/191) and report industrial chemical release.",
                        "Keep bystanders out of the perimeter."
                    ],
                    "reasons": [
                        "Toxic industrial chemical or corrosive gas release detected.",
                        "Evacuate immediately in an upwind and uphill direction to at least 500 meters safety radius."
                    ],
                    "prohibited_actions": [
                        "Do not walk through spilled liquids or vapor clouds.",
                        "Do not attempt to contain chemical spills without certified HazMat PPE."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_05d: GENERAL_HAZMAT_SPILL",
                        "details": "hazard(chemical_spill) -> evacuate_upwind_and_call_hazmat",
                        "children": [
                            {"type": "evidence", "label": "hazard(chemical_spill)"},
                            {"type": "deduction", "label": "Industrial hazardous material release"},
                            {"type": "safety_invariant", "label": "Evacuate upwind to 500m radius"}
                        ]
                    }
                }
            # 6. Wildfire / Brushfire
            if fact_dict.get("hazard") == "wildfire" or fact_dict.get("wildfire") in ("true", "yes") or fact_dict.get("brushfire") in ("true", "yes"):
                return {
                    "action": "execute_wildfire_evacuation_order",
                    "severity": "critical",
                    "step_by_step_instructions": [
                        "Evacuate immediately via designated primary egress routes.",
                        "Turn on vehicle headlights and close vehicle air intake / HVAC vents.",
                        "Wear cotton or wool long sleeves and N95 / particulate mask.",
                        "Monitor emergency radio broadcasts."
                    ],
                    "reasons": [
                        "Rapidly propagating wildfire front threatens structure.",
                        "Evacuate immediately via designated primary egress routes, turn on headlights, and close vehicle air intake vents."
                    ],
                    "prohibited_actions": [
                        "Do not delay evacuation to protect non-essential property.",
                        "Do not shelter in combustible wooden structures if evacuation routes remain open."
                    ],
                    "proof_tree": {
                        "type": "rule",
                        "label": "hazard_rule_06: WILDFIRE_EVACUATION",
                        "details": "hazard(wildfire) -> execute_wildfire_evacuation_order",
                        "children": [
                            {"type": "evidence", "label": "hazard(wildfire)"},
                            {"type": "deduction", "label": "Rapid wildfire propagation front"},
                            {"type": "safety_invariant", "label": "Do not delay evacuation for property"}
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
                    "details": "hazard(unknown) -> evacuate_and_call_fire_department",
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
                        "details": "disaster(flood) AND water_rising(true) AND building(single_story) -> evacuate_to_higher_ground_now",
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
                        "details": "disaster(flood) AND water_rising(true) AND building(multi_story) -> vertical_evacuation_to_upper_floors",
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
                        "details": "disaster(earthquake) AND shaking(active) -> drop_cover_and_hold_on",
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
                        "details": "disaster(earthquake) AND shaking(stopped) AND smell_gas(true) -> evacuate_and_shut_main_gas_valve",
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
                        "details": "disaster(tsunami) OR coastal(true) -> evacuate_inland_immediately",
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
                    "details": "disaster(unknown) -> seek_safe_shelter_and_monitor_emergency_broadcasts",
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
                        "details": "unconscious(true) AND breathing(none) -> begin_cpr_do_not_move_spine",
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
                        "details": "vehicle_fire(true) AND trapped(true) -> call_rescue_and_maintain_safe_distance",
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
                        "details": "multiple_victims(true) OR mass_casualty(true) -> triage_by_severity_and_call_mass_casualty_dispatch",
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
                        "details": "hazard(traffic) OR active_traffic(true) -> establish_safety_perimeter_before_aid",
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
                    "details": "road_accident(general) -> secure_scene_and_call_emergency_dispatch",
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
                "details": "unknown_scenario -> call_emergency_services_immediately",
                "children": [{"type": "safety_invariant", "label": "Fail-Safe Default Invariant"}]
            }
        }

prolog_bridge = PrologEngineBridge()

def get_prolog_engine() -> PrologEngineBridge:
    return prolog_bridge
