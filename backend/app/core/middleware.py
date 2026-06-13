"""
Security headers middleware.
Per Security Policy: mitigates clickjacking, MIME attacks, XSS, transport downgrade.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        if settings.ENVIRONMENT != "development":
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        # CSP kept permissive for API responses (mainly JSON); tighten if serving HTML.
        response.headers["Content-Security-Policy"] = "default-src 'self'"

        return response
