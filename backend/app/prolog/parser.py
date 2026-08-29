# backend/app/prolog/parser.py
# Normalizes and cleans Prolog query results into Python native dictionaries.

from typing import Any, Dict, List

class PrologResultParser:
    """
    Parses and decodes raw PySwip bindings (atoms, strings, nested lists)
    into standard Python data types for Pydantic models and APIs.
    """

    @classmethod
    def decode_atom(cls, val: Any) -> Any:
        if isinstance(val, bytes):
            return val.decode("utf-8")
        if isinstance(val, list):
            return [cls.decode_atom(item) for item in val]
        return str(val)

    @classmethod
    def parse_triage_result(cls, raw_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extracts and cleans Action, Severity, Reasons, and Prohibitions from a Prolog solution.
        """
        action = cls.decode_atom(raw_result.get("Action", "call_emergency_services_immediately"))
        severity = cls.decode_atom(raw_result.get("Severity", "critical")).lower()

        raw_reasons = raw_result.get("Reasons", [])
        if isinstance(raw_reasons, list):
            reasons = [cls.decode_atom(r) for r in raw_reasons]
        elif raw_reasons:
            reasons = [cls.decode_atom(raw_reasons)]
        else:
            reasons = []

        raw_prohibitions = raw_result.get("Prohibitions", [])
        if isinstance(raw_prohibitions, list):
            prohibitions = [cls.decode_atom(p) for p in raw_prohibitions]
        elif raw_prohibitions:
            prohibitions = [cls.decode_atom(raw_prohibitions)]
        else:
            prohibitions = []

        return {
            "action": action,
            "severity": severity,
            "reasons": reasons,
            "prohibited_actions": prohibitions,
        }
