# backend/tests/test_api.py
# FastAPI integration tests for all REST API endpoints.

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # System Health
        res = await client.get("/api/v1/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert "version" in data
        assert "X-Request-ID" in res.headers
        assert "X-Process-Time-Ms" in res.headers

        # Prolog Engine Health
        res_prolog = await client.get("/api/v1/health/prolog")
        assert res_prolog.status_code == 200
        data_prolog = res_prolog.json()
        assert data_prolog["prolog_status"] == "ready"
        assert data_prolog["engine_ready"] is True

@pytest.mark.asyncio
async def test_evaluate_medical_cardiac_arrest():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "session_token": "test-med-001",
            "domain": "medical",
            "submitted_facts": [
                {"key": "unconscious", "value": "true"},
                {"key": "breathing", "value": "none"}
            ]
        }
        res = await client.post("/api/v1/crisis/evaluate", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["severity"] == "critical"
        assert data["action_headline"] == "begin_cpr_and_call_emergency"
        assert len(data["reasons"]) > 0
        assert len(data["prohibited_actions"]) > 0
        assert data["evaluation_latency_ms"] >= 0
        assert "X-Request-ID" in res.headers

@pytest.mark.asyncio
async def test_evaluate_fire_electrical():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "session_token": "test-fire-001",
            "domain": "fire_hazard",
            "submitted_facts": [
                {"key": "hazard", "value": "fire"},
                {"key": "fire_source", "value": "electrical"}
            ]
        }
        res = await client.post("/api/v1/crisis/evaluate", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["severity"] == "critical"
        assert data["action_headline"] == "isolate_main_power_and_use_co2_extinguisher"
        # Strict safety invariant: NEVER water on electrical fire
        assert any("WATER" in p.upper() for p in data["prohibited_actions"])

@pytest.mark.asyncio
async def test_evaluate_batch():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "evaluations": [
                {
                    "session_token": "test-batch-1",
                    "domain": "medical",
                    "submitted_facts": [{"key": "bleeding", "value": "severe_pulsing"}]
                },
                {
                    "session_token": "test-batch-2",
                    "domain": "fire_hazard",
                    "submitted_facts": [
                        {"key": "hazard", "value": "fire"},
                        {"key": "fire_source", "value": "cooking_oil"}
                    ]
                }
            ]
        }
        res = await client.post("/api/v1/crisis/evaluate/batch", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert len(data) == 2
        assert data[0]["action_headline"] == "apply_direct_pressure_and_tourniquet"
        assert data[1]["action_headline"] == "cover_with_metal_lid_and_turn_off_burner"

@pytest.mark.asyncio
async def test_session_lifecycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Create session
        create_res = await client.post("/api/v1/sessions/create", json={"domain": "medical"})
        assert create_res.status_code == 201
        session_data = create_res.json()
        token = session_data["session_token"]
        assert token is not None

        # 2. Add facts
        facts_res = await client.post(f"/api/v1/sessions/{token}/facts", json={
            "facts": [{"key": "unconscious", "value": "true"}]
        })
        assert facts_res.status_code == 200

        # 3. Retrieve session details
        get_res = await client.get(f"/api/v1/sessions/{token}")
        assert get_res.status_code == 200
        detail = get_res.json()
        assert detail["session_token"] == token
        assert len(detail["facts"]) >= 1

@pytest.mark.asyncio
async def test_nearby_shelters():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/shelters/nearby?lat=16.8661&lng=96.1951&radius_km=15")
        assert res.status_code == 200
        data = res.json()
        assert "shelters" in data
        assert data["total"] > 0
        assert data["shelters"][0]["distance_km"] is not None

@pytest.mark.asyncio
async def test_scheduler_optimize():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "incident_severities": ["critical", "high", "moderate", "critical"],
            "team_capacities": [10, 8, 6, 12],
            "max_time": 60
        }
        res = await client.post("/api/v1/scheduler/optimize", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "assignments" in data
        assert len(data["assignments"]) == 4
        # Safety invariant: Critical incidents (0 and 3) must be assigned to teams 1 or 2
        assert data["assignments"][0] in [1, 2]
        assert data["assignments"][3] in [1, 2]
