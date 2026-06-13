"""
Core application configuration.
Loads settings from environment variables (.env file).
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    # ------------------------------------------------------------
    # App Info
    # ------------------------------------------------------------
    APP_NAME: str = "CloudWise AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development | staging | production
    DEBUG: bool = True

    # ------------------------------------------------------------
    # Database
    # ------------------------------------------------------------
    DATABASE_URL: str = "sqlite:///./cloudwise.db"

    # ------------------------------------------------------------
    # JWT Authentication
    # ------------------------------------------------------------
    JWT_SECRET: str = "CHANGE_THIS_IN_PRODUCTION_USE_RANDOM_64_CHAR_STRING"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for hackathon demo ease

    # ------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:5174,http://127.0.0.1:5174"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS env var (comma-separated) into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # ------------------------------------------------------------
    # AWS (for demo / IAM role assumption)
    # ------------------------------------------------------------
    AWS_REGION: str = "us-east-1"
    # Optional: for hackathon speed, allow direct access keys as fallback
    # to IAM role assumption (documented as a dev-only shortcut)
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None

    # ------------------------------------------------------------
    # AI / Claude API
    # ------------------------------------------------------------
    ANTHROPIC_API_KEY: str | None = None
    CLAUDE_MODEL: str = "claude-sonnet-4-6"

    # ------------------------------------------------------------
    # Rate Limiting
    # ------------------------------------------------------------
    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_REGISTER: str = "5/minute"
    RATE_LIMIT_COPILOT: str = "30/minute"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
