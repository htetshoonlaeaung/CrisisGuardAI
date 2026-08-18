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
        action = cls.decode_atom(raw_result.get("Action", "contact_emergency_services"))
        severity = cls.decode_atom(raw_result.get("Severity", "critical")).lower()

        reasons = raw_result.get("Reasons", [])
        if isinstance(reasons, list):
            reasons = [cls.decode_atom(r) for r in reasons]
        else:
            reasons = [cls.decode_atom(reasons)] if reasons else []

        prohibitions = raw_result.get("Prohibitions", [])
        if isinstance(prohibitions, list):
            prohibitions = [cls.decode_atom(p) for p in prohibitions]
        else:
            prohibitions = [cls.decode_atom(prohibitions)] if prohibitions else []

        return {
            "action": action,
            "severity": severity,
            "reasons": reasons,
            "prohibited_actions": prohibitions,
        }
