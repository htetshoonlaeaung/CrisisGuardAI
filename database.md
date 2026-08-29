# 🗄️ CrisisGuard AI — Database Architecture

> **Context File** — PostgreSQL schema, Neon Serverless config, ORM models, migrations.  
> See also: [api.md](file:///C:/Users/USER/Downloads/CrisisGuardAI/api.md) · [structure.md](file:///C:/Users/USER/Downloads/CrisisGuardAI/structure.md)

---

## Stack

- **PostgreSQL** on **Neon Serverless** (cloud-hosted, autoscaling, connection pooling)
- **Async SQLAlchemy 2.0** with **asyncpg** driver
- **Alembic** for schema migrations (not yet initialized)

---

## ER Diagram

```mermaid
erDiagram
    emergency_sessions ||--o{ session_facts : "has many"
    emergency_sessions ||--o{ triage_audit_trails : "has many"
    emergency_shelters }o--|| emergency_shelters : "standalone"

    emergency_sessions {
        UUID id PK
        VARCHAR(64) session_token UK
        domain_type domain
        severity_level current_severity
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    session_facts {
        BIGSERIAL id PK
        UUID session_id FK
        VARCHAR(100) fact_key
        VARCHAR(100) fact_value
        TIMESTAMPTZ created_at
    }

    triage_audit_trails {
        BIGSERIAL id PK
        UUID session_id FK
        VARCHAR(255) recommended_action
        severity_level severity
        JSONB reasons
        JSONB prohibited_actions
        INTEGER evaluation_latency_ms
        TIMESTAMPTZ created_at
    }

    emergency_shelters {
        SERIAL id PK
        VARCHAR(255) name
        domain_type disaster_type
        DOUBLE_PRECISION latitude
        DOUBLE_PRECISION longitude
        INTEGER capacity
        INTEGER current_occupancy
        VARCHAR(50) contact_phone
        BOOLEAN is_open
    }
```

---

## DDL (Full Schema)

```sql
-- Custom ENUM types
CREATE TYPE severity_level AS ENUM ('critical', 'high', 'moderate', 'low', 'informational');
CREATE TYPE domain_type AS ENUM ('medical', 'natural_disaster', 'fire_hazard', 'road_accident');

-- Sessions: one per emergency interaction
CREATE TABLE emergency_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(64) NOT NULL UNIQUE,
    domain domain_type NOT NULL,
    current_severity severity_level DEFAULT 'moderate' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_sessions_token ON emergency_sessions(session_token);

-- Facts: append-only key-value pairs per session
CREATE TABLE session_facts (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES emergency_sessions(id) ON DELETE CASCADE NOT NULL,
    fact_key VARCHAR(100) NOT NULL,
    fact_value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_facts_session ON session_facts(session_id);

-- Audit trails: immutable log of every Prolog evaluation result
CREATE TABLE triage_audit_trails (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES emergency_sessions(id) ON DELETE CASCADE NOT NULL,
    recommended_action VARCHAR(255) NOT NULL,
    severity severity_level NOT NULL,
    reasons JSONB NOT NULL,
    prohibited_actions JSONB NOT NULL,
    evaluation_latency_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_audits_session ON triage_audit_trails(session_id);

-- Shelters: geo-located emergency shelters
CREATE TABLE emergency_shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    disaster_type domain_type NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0 NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE NOT NULL
);
```

---

## Async SQLAlchemy Configuration

`backend/app/core/database.py`:

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Neon connection string: postgresql+asyncpg://user:pass@ep-xxx.neon.tech/neondb?ssl=require
DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,              # Set True for SQL debugging
    pool_size=10,            # Base pool connections
    max_overflow=20,         # Burst capacity (total max: 30)
    pool_recycle=300,        # Recycle connections every 5 min
    pool_pre_ping=True,      # Handle Neon scale-to-zero recovery
    connect_args={"ssl": True}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession,
    expire_on_commit=False, autocommit=False, autoflush=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

## ORM Models

### EmergencySession (`backend/app/db/models/session.py`)

```python
class EmergencySession(Base):
    __tablename__ = "emergency_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_token = Column(String(64), unique=True, nullable=False, index=True)
    domain = Column(String(50), nullable=False)
    current_severity = Column(String(20), default="moderate", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    facts = relationship("SessionFact", back_populates="session", cascade="all, delete-orphan")
    audits = relationship("TriageAuditTrail", back_populates="session", cascade="all, delete-orphan")
```

### SessionFact (`backend/app/db/models/fact.py`)

```python
class SessionFact(Base):
    __tablename__ = "session_facts"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("emergency_sessions.id", ondelete="CASCADE"))
    fact_key = Column(String(100), nullable=False)
    fact_value = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    session = relationship("EmergencySession", back_populates="facts")
```

### TriageAuditTrail (`backend/app/db/models/audit.py`)

```python
class TriageAuditTrail(Base):
    __tablename__ = "triage_audit_trails"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("emergency_sessions.id", ondelete="CASCADE"))
    recommended_action = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False)
    reasons = Column(JSONB, nullable=False)
    prohibited_actions = Column(JSONB, nullable=False)
    evaluation_latency_ms = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    session = relationship("EmergencySession", back_populates="audits")
```

### EmergencyShelter (`backend/app/db/models/shelter.py`)

```python
class EmergencyShelter(Base):
    __tablename__ = "emergency_shelters"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    disaster_type = Column(String(50), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)
    current_occupancy = Column(Integer, default=0)
    contact_phone = Column(String(50), nullable=False)
    is_open = Column(Boolean, default=True)
```

---

## Neon Serverless Considerations

| Consideration | Solution |
|---|---|
| **Scale-to-zero** | Neon suspends idle DBs. `pool_pre_ping=True` auto-reconnects on cold start (500ms-2s first request). |
| **SSL required** | `connect_args={"ssl": True}` in asyncpg. Neon rejects non-SSL. |
| **Connection pooling** | Neon has built-in pooler. Our SQLAlchemy pool (10+20) sits on top. Use Neon's pooled connection string for production. |
| **Branch-based staging** | Neon supports database branching. Create a branch for testing without affecting production. |
| **Connection string format** | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require` → replace `postgresql://` with `postgresql+asyncpg://` |

---

## Migration Setup (TODO)

Alembic is listed in `requirements.txt` but not yet initialized. Steps needed:

```bash
cd backend

# 1. Initialize Alembic
alembic init alembic

# 2. Edit alembic.ini — set sqlalchemy.url (or use env.py to read from settings)

# 3. Edit alembic/env.py — configure async support:
#    - Import async engine
#    - Set target_metadata = Base.metadata
#    - Use run_async_migrations() pattern

# 4. Generate initial migration
alembic revision --autogenerate -m "create_initial_tables"

# 5. Run migration
alembic upgrade head
```

---

## Query Patterns Used by Services

### TriageService — `evaluate_and_persist()`
```python
# Fetch session by token
stmt = select(EmergencySession).where(EmergencySession.session_token == token)
session = (await db.execute(stmt)).scalar_one_or_none()

# Insert new facts (append-only)
db.add(SessionFact(session_id=session.id, fact_key=key, fact_value=value))

# Load ALL cumulative facts for Prolog
facts_stmt = select(SessionFact).where(SessionFact.session_id == session.id)
all_facts = (await db.execute(facts_stmt)).scalars().all()

# Insert audit trail (immutable)
db.add(TriageAuditTrail(session_id=session.id, ...))
await db.commit()
```

### ShelterService — `find_nearby()`
```python
# Query open shelters by disaster type
stmt = select(EmergencyShelter).where(
    EmergencyShelter.disaster_type == disaster_type,
    EmergencyShelter.is_open == True
)
# Distance calculation done in Python (Haversine) or PostGIS if added later
```

---

## What Frontend Receives from Each Table

| Table | Frontend Use | Data Shape |
|-------|-------------|------------|
| `emergency_sessions` | Session lifecycle | `{session_token, domain, severity, is_active, created_at}` |
| `session_facts` | Not directly exposed | Facts are internal; frontend only sends them, doesn't read raw facts |
| `triage_audit_trails` | Evaluation history, XAI reasoning | `{action, severity, reasons[], prohibited_actions[], latency_ms}` |
| `emergency_shelters` | Shelter locator map | `{name, lat, lng, capacity, occupancy, phone, is_open}` |
