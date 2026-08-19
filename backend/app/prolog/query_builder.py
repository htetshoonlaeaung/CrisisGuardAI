# backend/app/prolog/query_builder.py
# Formats facts and domain queries into valid Prolog terms and queries.

from typing import Any, Dict, List, Union

class PrologQueryBuilder:
    """
    Utility for sanitizing and transforming Python dictionaries, objects, and fact lists
    into syntactically valid Prolog compound terms and queries.
    """

    @staticmethod
    def format_fact(key: str, value: Any) -> str:
        """
        Converts a key-value pair into a Prolog term, e.g. key(value).
        """
        clean_key = str(key).strip().lower().replace(" ", "_").replace("-", "_")

        if isinstance(value, bool):
            val_str = "true" if value else "false"
        elif isinstance(value, (int, float)):
            val_str = str(value)
        else:
            val_str = str(value).strip().lower().replace(" ", "_").replace("-", "_")

        return f"{clean_key}({val_str})"

    @classmethod
    def build_facts_list(cls, facts: List[Any]) -> str:
        """
        Converts a list of fact items into a Prolog list string: [fact1, fact2, ...].
        Supports dicts, Pydantic FactItem, or raw strings.
        """
        formatted = []
        for f in facts:
            if isinstance(f, str):
                formatted.append(f)
            elif isinstance(f, dict):
                k = f.get("key") or f.get("fact_key")
                v = f.get("value") or f.get("fact_value")
                if k is not None and v is not None:
                    formatted.append(cls.format_fact(k, v))
            elif hasattr(f, "key") and hasattr(f, "value"):
                formatted.append(cls.format_fact(f.key, f.value))
            elif hasattr(f, "fact_key") and hasattr(f, "fact_value"):
                formatted.append(cls.format_fact(f.fact_key, f.fact_value))
        return "[" + ", ".join(formatted) + "]"

    @classmethod
    def build_triage_query(cls, domain: str, facts: List[Any]) -> str:
        """
        Constructs the top-level evaluate_emergency/6 query string.
        """
        facts_term = cls.build_facts_list(facts)
        clean_domain = str(domain).strip().lower().replace("-", "_")
        return f"evaluate_emergency({clean_domain}, {facts_term}, Action, Severity, Reasons, Prohibitions)"
