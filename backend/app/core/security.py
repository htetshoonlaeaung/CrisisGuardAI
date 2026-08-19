# backend/app/core/security.py
# Security middleware, CORS headers, request ID tracing, and latency monitoring.

import time
import uuid
from typing import Callable
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings

class SecurityAndTracingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that:
    1. Attaches / propagates X-Request-ID for distributed tracing.
    2. Measures endpoint execution latency and injects X-Process-Time-Ms.
    3. Enforces standard HTTP security response headers.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        # Store in request state for logging / downstream services
        request.state.request_id = request_id

        start_time = time.perf_counter()
        response: Response = await call_next(request)
        process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Tracing headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = str(process_time_ms)

        # Standard Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return response

def setup_cors(app: FastAPI) -> None:
    """Configures CORS with explicit allowed origins and exposed headers."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Process-Time-Ms", "Content-Type", "Authorization"],
        max_age=600,
    )

def setup_security_and_monitoring(app: FastAPI) -> None:
    """Configures security headers and request tracing middleware."""
    app.add_middleware(SecurityAndTracingMiddleware)
