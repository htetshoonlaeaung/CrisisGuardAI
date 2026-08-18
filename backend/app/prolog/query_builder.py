# backend/app/prolog/query_builder.py
# Formats facts and domain queries into valid Prolog terms and queries.

from typing import Any, Dict, List

class PrologQueryBuilder:
    """
    Utility for sanitizing and transforming Python dictionaries and fact lists
    into syntactically valid Prolog compound terms and queries.
    """

    @staticmethod
    def format_fact(key: str, value: Any) -> str:
        """
        Converts a key-value pair into a Prolog term, e.g. key(value).
        """
        # Clean atom names
        clean_key = str(key).strip().lower().replace(" ", "_")
        
        if isinstance(value, bool):
            val_str = "true" if value else "false"
        elif isinstance(value, (int, float)):
            val_str = str(value)
        else:
            val_str = str(value).strip().lower().replace(" ", "_")

        return f"{clean_key}({val_str})"

    @classmethod
    def build_facts_list(cls, facts: List[Dict[str, Any]]) -> str:
        """
        Converts a list of fact items into a Prolog list string: [fact1, fact2, ...].
        """
        formatted = []
        for f in facts:
            k = f.get("key") or f.get("fact_key")
            v = f.get("value") or f.get("fact_value")
            if k is not None and v is not None:
                formatted.append(cls.format_fact(k, v))
        return "[" + ", ".join(formatted) + "]"

    @classmethod
    def build_triage_query(cls, domain: str, facts: List[Dict[str, Any]]) -> str:
        """
        Constructs the top-level evaluate_emergency/6 query string.
        """
        facts_term = cls.build_facts_list(facts)
        clean_domain = str(domain).strip().lower()
        return f"evaluate_emergency({clean_domain}, {facts_term}, Action, Severity, Reasons, Prohibitions)"
