# backend/tests/test_api.py
# FastAPI integration tests for the /api/v1/crisis/evaluate and /api/v1/sessions endpoints.
# Uses httpx AsyncClient against the real FastAPI app with a test Neon DB branch.

import pytest
from httpx import AsyncClient
from app.main import app

# TODO: test_evaluate_medical_cardiac_arrest()
# TODO: test_evaluate_fire_electrical()
# TODO: test_create_and_retrieve_session()
# TODO: test_health_check()
