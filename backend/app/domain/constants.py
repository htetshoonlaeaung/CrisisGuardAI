from enum import Enum

class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MODERATE = "moderate"
    LOW = "low"
    INFORMATIONAL = "informational"

class DomainType(str, Enum):
    MEDICAL = "medical"
    NATURAL_DISASTER = "natural_disaster"
    FIRE_HAZARD = "fire_hazard"
    ROAD_ACCIDENT = "road_accident"

EMERGENCY_CONTACTS = {
    "default": "199",
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

