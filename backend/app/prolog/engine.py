# backend/app/prolog/engine.py
# Thread-safe PySwip bridge to embedded SWI-Prolog runtime.

import threading
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from .exceptions import PrologEngineUnavailableError, PrologQueryError

logger = logging.getLogger("crisisguard.prolog")

class PrologEngineBridge:
    """
    Singleton manager for the SWI-Prolog engine using PySwip.
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
            logger.warning(f"PySwip/SWI-Prolog initialization deferred or failed: {e}")
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

        for file_path in kb_files:
            if file_path.exists():
                logger.info(f"Consulting knowledge base: {file_path}")
                # Convert path to POSIX string for SWI-Prolog compatibility
                posix_path = file_path.as_posix()
                self.prolog.consult(posix_path)
            else:
                logger.warning(f"Knowledge base file not found: {file_path}")

    def evaluate_crisis(self, domain: str, facts: List[str]) -> Dict[str, Any]:
        """
        Thread-safe Prolog query execution for emergency triage.
        """
        if self.prolog is None:
            return self._safe_fallback("Prolog engine unavailable")

        facts_term = "[" + ", ".join(facts) + "]"
        query_str = f"evaluate_emergency({domain}, {facts_term}, Action, Severity, Reasons, Prohibitions)"

        with self._query_lock:
            try:
                results = list(self.prolog.query(query_str))
                if not results:
                    return self._safe_fallback("No matching logic rule found")
                return results[0]
            except Exception as exc:
                logger.error(f"Prolog query error: {exc}", exc_info=True)
                return self._safe_fallback(f"Prolog execution error: {exc}")

    def _safe_fallback(self, reason: str = "") -> Dict[str, Any]:
        """
        Fail-safe fallback when inference fails or engine is uninitialized.
        """
        return {
            "Action": "contact_emergency_services_immediately",
            "Severity": "critical",
            "Reasons": [
                "Automated inference fallback triggered.",
                f"Notice: {reason}" if reason else "Standard life-safety protocol activated."
            ],
            "Prohibitions": [
                "Do not delay contacting local emergency dispatch (911/112)."
            ]
        }

def get_prolog_engine() -> PrologEngineBridge:
    return PrologEngineBridge()
