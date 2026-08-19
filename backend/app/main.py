# backend/app/main.py
# FastAPI application entrypoint
# Initializes the app, registers routers, configures security/CORS, and manages lifecycle.

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.security import setup_cors, setup_security_and_monitoring
from app.core.database import engine, Base
from app.db.base import *  # noqa: F401, F403
from app.api.v1.api_router import api_router
from app.prolog.engine import prolog_bridge

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("crisisguard.app")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle manager for startup and shutdown procedures.
    """
    logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION}...")

    # 1. Ensure DB schema exists if running in dev/sqlite/test
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema verified successfully.")
    except Exception as exc:
        logger.warning(f"Database table verification deferred or handled by migrations: {exc}")

    # 2. Prolog engine readiness check
    logger.info(f"Prolog engine status: ready={prolog_bridge.is_ready} (loaded {prolog_bridge.kb_count} rulesets)")

    yield

    # 3. Clean up database engine connections on shutdown
    logger.info("Shutting down engine connection pools...")
    await engine.dispose()

tags_metadata = [
    {
        "name": "Crisis Triage",
        "description": "Deterministic First-Order Logic triage evaluation and action recommendations.",
    },
    {
        "name": "Emergency Sessions",
        "description": "Lifecycle management and audit history for active crisis sessions.",
    },
    {
        "name": "Emergency Shelters",
        "description": "Geolocation shelter discovery and capacity monitoring via Haversine distance.",
    },
    {
        "name": "Rescue Scheduler",
        "description": "Resource allocation and rescue dispatch optimization using CLP(FD) constraints.",
    },
    {
        "name": "Health",
        "description": "System readiness, uptime, and embedded Prolog engine health status.",
    },
]

app = FastAPI(
    title=settings.APP_NAME,
    description="Intelligent Crisis Decision Support System powered by SWI-Prolog and Neon PostgreSQL",
    version=settings.VERSION,
    lifespan=lifespan,
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. Setup Request Tracing & Security Headers Middleware
setup_security_and_monitoring(app)

# 2. Setup CORS Middleware
setup_cors(app)

# 3. Global Exception Handlers for Clean API Error Responses
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "detail": exc.detail,
            "request_id": getattr(request.state, "request_id", None)
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
            "detail": exc.errors(),
            "request_id": getattr(request.state, "request_id", None)
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "detail": f"Internal server error: {str(exc)}",
            "request_id": getattr(request.state, "request_id", None)
        }
    )

# 4. Register API routers
app.include_router(api_router)

@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to interactive API documentation."""
    return RedirectResponse(url="/docs")

@app.get("/health", include_in_schema=False)
async def root_health():
    """Root health alias."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
