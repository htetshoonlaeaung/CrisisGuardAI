# backend/tests/test_safety_invariants.py
# Automated safety invariant tests for the Prolog reasoning engine.
# Verifies that critical safety rules (e.g., never water on electrical fire)
# are always enforced regardless of other input facts.

import pytest
from app.prolog.engine import prolog_bridge

SAFETY_INVARIANTS = [
    {
        "domain": "fire_hazard",
        "facts": [{"key": "hazard", "value": "fire"}, {"key": "fire_source", "value": "electrical"}],
        "forbidden_in_action": ["water", "hose", "douse"],
        "required_in_prohibitions": "water",
        "expected_severity": "critical"
    },
    {
        "domain": "fire_hazard",
        "facts": [{"key": "hazard", "value": "fire"}, {"key": "fire_source", "value": "cooking_oil"}],
        "forbidden_in_action": ["water", "throw_water"],
        "required_in_prohibitions": "water",
        "expected_severity": "critical"
    },
    {
        "domain": "medical",
        "facts": [{"key": "face_droop", "value": "true"}, {"key": "arm_weakness", "value": "true"}],
        "forbidden_in_action": ["aspirin", "food", "sleep"],
        "required_in_prohibitions": "aspirin",
        "expected_severity": "critical"
    },
    {
        "domain": "medical",
        "facts": [{"key": "unconscious", "value": "true"}, {"key": "breathing", "value": "none"}],
        "forbidden_in_action": ["water", "feed", "leave"],
        "required_in_prohibitions": "fluids",
        "expected_severity": "critical"
    },
    {
        "domain": "natural_disasters",
        "facts": [{"key": "disaster", "value": "flood"}, {"key": "water_rising", "value": "true"}, {"key": "building", "value": "single_story"}],
        "forbidden_in_action": ["stay", "wait"],
        "required_in_prohibitions": "drive",
        "expected_severity": "critical"
    },
    {
        "domain": "road_accident",
        "facts": [{"key": "unconscious", "value": "true"}, {"key": "breathing", "value": "none"}],
        "forbidden_in_action": ["twist_neck"],
        "required_in_prohibitions": "spine",
        "expected_severity": "critical"
    }
]

@pytest.mark.parametrize("case", SAFETY_INVARIANTS)
def test_safety_guardrails(case):
    """
    Ensures that life-safety rules never produce hazardous advice or omit required prohibitions.
    """
    result = prolog_bridge.evaluate_crisis(case["domain"], case["facts"])

    action = result.get("action", "").lower()
    severity = result.get("severity", "").lower()
    prohibitions_str = " ".join(result.get("prohibited_actions", [])).lower()

    # 1. Severity check
    assert severity == case["expected_severity"], f"Expected {case['expected_severity']}, got {severity}"

    # 2. Forbidden words check in action headline
    for forbidden in case.get("forbidden_in_action", []):
        assert forbidden.lower() not in action, f"Safety violation: '{forbidden}' found in action '{action}'"

    # 3. Required words check in prohibitions
    req = case.get("required_in_prohibitions", "").lower()
    if req:
        assert req in prohibitions_str, f"Safety violation: required warning '{req}' missing from prohibitions"
