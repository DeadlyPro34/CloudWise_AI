"""
CloudWise AI - Backend Entry Point

FastAPI application setup: middleware, routers, rate limiting, CORS.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.core.config import settings
from app.core.limiter import limiter
from app.core.middleware import SecurityHeadersMiddleware

# Routers
from app.api import auth as auth_router
from app.api import aws as aws_router
from app.api import dashboard as dashboard_router
from app.api import copilot as copilot_router
from app.api import forecast as forecast_router
from app.api import reports as reports_router
from app.api import settings as settings_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered FinOps Copilot for AWS infrastructure cost optimization.",
)

# ------------------------------------------------------------
# Rate Limiting
# ------------------------------------------------------------
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
def debug_exception_handler(request: Request, exc: Exception):
    tb_str = "".join(traceback.format_tb(exc.__traceback__))
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal Server Error: {str(exc)}\n{tb_str}"
        }
    )

# ------------------------------------------------------------
# Security Headers
# ------------------------------------------------------------
app.add_middleware(SecurityHeadersMiddleware)

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# Routers
# ------------------------------------------------------------
API_PREFIX = "/api/v1"

app.include_router(auth_router.router, prefix=API_PREFIX)
app.include_router(aws_router.router, prefix=API_PREFIX)
app.include_router(dashboard_router.router, prefix=API_PREFIX)
app.include_router(copilot_router.router, prefix=API_PREFIX)
app.include_router(forecast_router.router, prefix=API_PREFIX)
app.include_router(reports_router.router, prefix=API_PREFIX)
app.include_router(settings_router.router, prefix=API_PREFIX)


# ------------------------------------------------------------
# Health Check
# ------------------------------------------------------------
@app.get("/", tags=["Health"])
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "ok",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
