# backend/app/core/database.py
# Async SQLAlchemy 2.0 engine and sessionmaker configured for Neon Serverless PostgreSQL.
# Uses asyncpg driver with SSL and pool_pre_ping for scale-to-zero recovery.

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Format URL for asyncpg / async SQLite
raw_url = settings.DATABASE_URL
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif raw_url.startswith("postgresql://") and not raw_url.startswith("postgresql+asyncpg://"):
    raw_url = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif raw_url.startswith("sqlite://") and not raw_url.startswith("sqlite+aiosqlite://"):
    raw_url = raw_url.replace("sqlite://", "sqlite+aiosqlite://", 1)

DATABASE_URL = raw_url

engine_kwargs = {
    "echo": settings.DEBUG,
    "pool_pre_ping": True,
}

connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False
else:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_recycle"] = 300
    if "sslmode=require" in DATABASE_URL or "neon.tech" in DATABASE_URL or "ssl=require" in DATABASE_URL:
        connect_args["ssl"] = True

if connect_args:
    engine_kwargs["connect_args"] = connect_args

engine = create_async_engine(DATABASE_URL, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
