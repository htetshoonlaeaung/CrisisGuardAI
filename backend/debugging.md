# 🔧 CrisisGuard AI — Debugging & Troubleshooting

> **Context File** — Error resolution, development setup, environment config, log analysis.  
> See also: [structure.md](./structure.md) · [api.md](./api.md)

---

## Quick Health Check

Run these to verify the backend is working:

```bash
# 1. Backend alive?
curl http://localhost:8000/api/v1/health

# 2. Prolog engine loaded?
curl http://localhost:8000/api/v1/health/prolog

# 3. Test evaluation
curl -X POST http://localhost:8000/api/v1/crisis/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "session_token": "test-001",
    "domain": "medical",
    "submitted_facts": [
      {"key": "unconscious", "value": "true"},
      {"key": "breathing", "value": "none"}
    ]
  }'
# Expected: severity=critical, action=begin_cpr_and_call_emergency
```

---

## Development Setup (Step-by-Step)

### Prerequisites
- Python 3.11+
- SWI-Prolog installed system-wide
- PostgreSQL (Neon Serverless account or local instance)

### Setup

```bash
# 1. Verify SWI-Prolog
swipl --version
# Expected: SWI-Prolog version 9.x.x

# 2. Create virtual environment
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
copy .env.example .env
# Edit .env with your Neon connection string

# 5. Run Alembic migrations (when set up)
# alembic upgrade head

# 6. Start development server
uvicorn app.main:app --reload --port 8000

# 7. Open Swagger docs
# http://localhost:8000/docs
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | — | Neon PostgreSQL connection string |
| `ENVIRONMENT` | ❌ | `development` | `development` / `staging` / `production` |
| `LOG_LEVEL` | ❌ | `INFO` | Python logging level |
| `CORS_ORIGINS` | ❌ | `["http://localhost:3000","http://localhost:5173"]` | Allowed frontend origins |
| `SWI_HOME_DIR` | ❌ | Auto-detected | Path to SWI-Prolog installation |

`.env.example`:
```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
ENVIRONMENT=development
LOG_LEVEL=INFO
```

---

## Troubleshooting Decision Tree

```mermaid
flowchart TD
    START["Backend not working?"] --> A{"Can you reach /health?"}
    
    A -->|No| B{"Is uvicorn running?"}
    B -->|No| B1["Run: uvicorn app.main:app --reload --port 8000"]
    B -->|Yes| B2{"Port 8000 in use?"}
    B2 -->|Yes| B3["Kill process: netstat -ano | findstr :8000"]
    B2 -->|No| B4["Check import errors in uvicorn output"]
    
    A -->|Yes| C{"Is /health/prolog returning ready?"}
    
    C -->|No| D{"Is SWI-Prolog installed?"}
    D -->|No| D1["Install: apt-get install swi-prolog OR download from swi-prolog.org"]
    D -->|Yes| D2{"Can Python find it?"}
    D2 -->|No| D3["Set SWI_HOME_DIR env variable to SWI-Prolog path"]
    D2 -->|Yes| D4["Check KB file paths in engine.py _load_knowledge_base()"]
    
    C -->|Yes| E{"Is /crisis/evaluate returning results?"}
    
    E -->|422 Error| F["Pydantic validation failed - check request body format"]
    E -->|500 Error| G{"Check error detail"}
    G --> G1["DB connection: Check DATABASE_URL in .env"]
    G --> G2["Prolog error: Check KB module conflicts"]
    G --> G3["Import error: Check Python dependencies"]
    
    E -->|CORS Error| H["Add frontend origin to CORS_ORIGINS in security.py"]
    E -->|200 OK| I["✅ Backend is working!"]
```

---

## Common Errors & Solutions

### 1. SWI-Prolog / PySwip

| Error | Cause | Fix |
|-------|-------|-----|
| `ImportError: cannot import name 'Prolog' from 'pyswip'` | PySwip not installed | `pip install pyswip` |
| `OSError: SWI-Prolog shared library not found` | SWI-Prolog not installed or not on PATH | Install SWI-Prolog. Set `SWI_HOME_DIR` env var. |
| `PrologError: existence_error(module, ...)` | Duplicate module name in .pl files | Each `.pl` file must have a unique `:- module(name, [...])` |
| `Query hangs / never returns` | CLP(FD) unsatisfiable constraints | Add timeout to `labeling/2`. Check constraint bounds. |
| `permission_error(modify, static_procedure, ...)` | Trying to assert into a module predicate | Use `:- dynamic predicate/arity` in the module |

**Thread Safety Warning:**
```
⚠️ SWI-Prolog is NOT thread-safe. ALL queries MUST go through
   PrologEngineBridge._query_lock. Never call prolog.query() directly
   from FastAPI handlers.
```

### 2. Neon / PostgreSQL

| Error | Cause | Fix |
|-------|-------|-----|
| `asyncpg.InvalidCatalogNameError: database "neondb" does not exist` | Wrong database name in URL | Check Neon dashboard for correct DB name |
| `asyncpg.ConnectionRefusedError` | Wrong host or Neon instance down | Verify endpoint URL from Neon console |
| `ssl.SSLError: certificate verify failed` | SSL misconfiguration | Use `connect_args={"ssl": True}` not `sslmode=require` |
| `sqlalchemy.exc.ProgrammingError: relation "emergency_sessions" does not exist` | Migrations not run | Run `alembic upgrade head` |
| `asyncpg.TooManyConnectionsError` | Pool exhausted (>30 connections) | Reduce `pool_size`/`max_overflow` or use Neon's pooler endpoint |
| First request takes 2+ seconds | Neon scale-to-zero cold start | Normal. `pool_pre_ping=True` handles reconnection. |

### 3. FastAPI

| Error | Cause | Fix |
|-------|-------|-----|
| `422 Unprocessable Entity` | Request body doesn't match Pydantic schema | Check JSON field names and types match schema |
| `500 Internal Server Error` | Unhandled exception in service layer | Check uvicorn logs for traceback |
| `CORS error in browser` | Frontend origin not in allowed list | Add origin to `CORS_ORIGINS` in `security.py` |
| `TypeError: 'AsyncSession' object is not callable` | Using `db()` instead of `db` in deps | `get_db` is a generator — use `Depends(get_db)` |
| `RuntimeError: Event loop is closed` | Async session used after loop closed | Ensure `await session.close()` in `finally` block |

### 4. Docker

| Error | Cause | Fix |
|-------|-------|-----|
| `swipl: command not found` in container | SWI-Prolog not in Dockerfile | Add `RUN apt-get install -y swi-prolog` |
| `.env not loaded` | Docker doesn't read `.env` by default | Use `env_file: - .env` in docker-compose.yml |
| Port 8000 already in use | Another process on same port | `docker-compose down` then `docker-compose up` |

---

## Log Analysis

### Where Logs Are

| Source | Location | Content |
|--------|----------|---------|
| **Uvicorn** | stdout/stderr | HTTP access logs, startup info |
| **Prolog Engine** | `crisisguard.prolog` logger | KB loading, query execution, errors |
| **SQLAlchemy** | Set `echo=True` in `database.py` | Raw SQL queries |
| **FastAPI** | Exception handlers | Request validation failures, 500 errors |

### Enable Debug Logging

```python
# In config.py or main.py
import logging
logging.basicConfig(level=logging.DEBUG)

# For SQL queries specifically
# In database.py, set:
engine = create_async_engine(DATABASE_URL, echo=True)
```

### Log Format to Look For

```
# Successful KB load
INFO:crisisguard.prolog:Consulting Prolog Knowledge Base: app/knowledge_base/domains/medical.pl

# Successful query
INFO:crisisguard.prolog:Evaluating: medical with 3 facts → severity=critical in 8ms

# Failed query (falls back to safe default)
ERROR:crisisguard.prolog:Prolog execution error: existence_error(procedure, medical_eval/5)
WARNING:crisisguard.prolog:Using safe fallback: call_emergency_services_immediately
```

---

## Frontend Connection Debugging

When the frontend can't reach the backend:

### Symptom: `Network Error` or `ERR_CONNECTION_REFUSED`
```
1. Is backend running? → curl http://localhost:8000/api/v1/health
2. Is VITE_API_URL set correctly? → Check frontend .env or vite.config.ts
3. Is the port correct? → Default is 8000, Vite proxies from 5173
```

### Symptom: `CORS policy: No 'Access-Control-Allow-Origin'`
```
1. Check security.py CORS_ORIGINS includes frontend URL
2. Vite dev server: add http://localhost:5173
3. Production build: add http://localhost:3000
4. Restart backend after changing CORS config
```

### Symptom: `422 Unprocessable Entity`
```
1. Check browser DevTools → Network → Request Payload
2. Compare with Pydantic schema in domain/schemas/
3. Common: snake_case in Python ↔ camelCase in TypeScript
4. Ensure Content-Type: application/json header
```

### Symptom: Evaluate returns fallback ("call_emergency_services_immediately")
```
1. This means Prolog query returned no results or errored
2. Check backend logs for Prolog execution errors
3. Verify facts are in correct Prolog format: key(value)
4. Test directly: swipl -l app/knowledge_base/core/core_rules.pl
   then: ?- evaluate_emergency(medical, [unconscious(true), breathing(none)], A, S, R, P).
```

---

## Testing Commands

```bash
# Run all Python tests
cd backend && python -m pytest tests/ -v

# Run safety invariant tests only
cd backend && python -m pytest tests/test_safety_invariants.py -v

# Run API tests
cd backend && python -m pytest tests/test_api.py -v

# Run Prolog plunit tests
swipl -g "run_tests" -t halt app/knowledge_base/tests/test_medical.pl
swipl -g "run_tests" -t halt app/knowledge_base/tests/test_hazards.pl

# Test single Prolog query manually
swipl -l app/knowledge_base/core/core_rules.pl
# ?- evaluate_emergency(medical, [unconscious(true), breathing(none)], A, S, R, P).
```

---

## Performance Benchmarks (Expected)

| Operation | Expected Latency |
|-----------|-----------------|
| Prolog evaluation (single) | 1-15 ms |
| DB round-trip (Neon, warm) | 20-50 ms |
| DB round-trip (Neon, cold) | 500-2000 ms |
| Full evaluate endpoint | 30-80 ms (warm) |
| CLP(FD) schedule optimization | 5-50 ms |
| Health check | < 5 ms |
