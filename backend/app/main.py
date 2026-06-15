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
from app.core.middleware import SecurityHeadersMiddleware, LoggingMiddleware
from app.core.logging import setup_logging

logger = setup_logging(settings.LOG_LEVEL)

# Routers
from app.api import auth as auth_router
from app.api import aws as aws_router
from app.api import dashboard as dashboard_router
from app.api import copilot as copilot_router
from app.api import forecast as forecast_router
from app.api import reports as reports_router
from app.api import settings as settings_router
from app.api import wolfram as wolfram_router

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
    if settings.DEBUG:
        tb_str = "".join(traceback.format_tb(exc.__traceback__))
        return JSONResponse(
            status_code=500,
            content={
                "detail": f"Error: {str(exc)}\n{tb_str}"
            }
        )
    else:
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

# ------------------------------------------------------------
# Security Headers & Logging
# ------------------------------------------------------------
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(LoggingMiddleware)

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
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
app.include_router(wolfram_router.router, prefix=API_PREFIX)


# ------------------------------------------------------------
# Health Check & Startup
# ------------------------------------------------------------
@app.on_event("startup")
async def startup():
    logger.info("application_starting", extra={
        "environment": settings.ENVIRONMENT,
        "version": settings.APP_VERSION,
    })
    
    from app.core.startup import validate_production_settings
    validate_production_settings()
    
    # Initialize Cache Manager
    from redis import Redis
    import app.core.cache as cache_module
    try:
        redis_client = Redis.from_url(settings.REDIS_URL)
        redis_client.ping()
        cache_module.cache_manager = cache_module.CacheManager(redis_client)
        logger.info("✅ Cache manager initialized with Redis")
    except Exception as e:
        logger.warning(f"⚠️ Cache unavailable: {e}. Caching disabled.")
        cache_module.cache_manager = cache_module.CacheManager(None)

    # Initialize Sentry
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    
    if not settings.DEBUG and settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            integrations=[
                FastApiIntegration(),
                SqlalchemyIntegration(),
            ],
            traces_sample_rate=0.1,
            profiles_sample_rate=0.1,
            environment=settings.ENVIRONMENT,
            release=settings.APP_VERSION,
            max_breadcrumbs=50,
            attach_stacktrace=True,
        )
        logger.info("✅ Sentry initialized")
    elif settings.SENTRY_DSN and settings.DEBUG:
        logger.warning("⚠️ Sentry DSN configured but DEBUG=True. Sentry disabled.")
    else:
        logger.info("ℹ️ Sentry not configured. Error monitoring disabled.")

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
