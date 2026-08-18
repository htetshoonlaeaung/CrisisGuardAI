# backend/app/domain/constants.py
# Application-wide constants.
# Domain question trees used by the frontend wizard, emergency contact numbers,
# and Prolog predicate naming conventions.

EMERGENCY_CONTACTS = {
    "default": "911",
    "myanmar": "199",
    "uk": "999",
    "europe": "112",
}

DOMAIN_LABELS = {
    "medical": "Medical Emergency",
    "natural_disaster": "Natural Disaster",
    "fire_hazard": "Fire & Hazard",
    "road_accident": "Road Accident",
}

# TODO: Add domain-specific branching questionnaire definitions for the frontend wizard
