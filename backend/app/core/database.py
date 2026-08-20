# backend/app/core/database.py
# Async SQLAlchemy 2.0 engine and sessionmaker configured for Neon Serverless PostgreSQL.
# Uses asyncpg driver with SSL, pool_pre_ping for scale-to-zero recovery, and PgBouncer compatibility.

import ssl
from typing import AsyncGenerator
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

def normalize_database_url(raw_url: str) -> tuple[str, dict]:
    """
    Normalizes standard PostgreSQL connection strings (e.g. from Neon dashboard)
    into asyncpg-compatible dialect URLs and configures SSL context.
    """
    connect_args = {}
    
    if raw_url.startswith("sqlite"):
        if not raw_url.startswith("sqlite+aiosqlite://"):
            raw_url = raw_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
        connect_args["check_same_thread"] = False
        return raw_url, connect_args

    parsed = urlparse(raw_url)
    scheme = "postgresql+asyncpg"
    query_params = parse_qs(parsed.query)

    is_neon = "neon.tech" in (parsed.hostname or "") or "sslmode" in query_params or "ssl" in query_params

    # Remove query params that asyncpg expects via connect_args or doesn't support directly
    query_params.pop("sslmode", None)
    query_params.pop("channel_binding", None)
    
    new_query = urlencode(query_params, doseq=True)
    clean_url = urlunparse((
        scheme,
        parsed.netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))

    if is_neon or "ssl" in raw_url:
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ssl_ctx
        # PgBouncer transaction pooling compatibility
        connect_args["statement_cache_size"] = 0

    return clean_url, connect_args

DATABASE_URL, connect_args = normalize_database_url(settings.DATABASE_URL)

engine_kwargs = {
    "echo": settings.DEBUG,
    "pool_pre_ping": True,
}

if "sqlite" not in DATABASE_URL:
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_recycle"] = 300
    engine_kwargs["pool_timeout"] = 30

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

