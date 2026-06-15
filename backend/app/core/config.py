"""
Core application configuration.
Loads settings from environment variables (.env file).
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    # ------------------------------------------------------------
    # App Info
    # ------------------------------------------------------------
    APP_NAME: str = "CloudWise AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development | staging | production
    DEBUG: bool = Field(default=False, env="DEBUG")

    # ------------------------------------------------------------
    # Database
    # ------------------------------------------------------------
    DATABASE_URL: str = Field(default="sqlite:///./cloudwise.db", env="DATABASE_URL")

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
    LOCALSTACK_URL: str = Field(default="http://localhost:4566", env="LOCALSTACK_URL")
    # Optional: for hackathon speed, allow direct access keys as fallback
    # to IAM role assumption (documented as a dev-only shortcut)
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None

    # ------------------------------------------------------------
    # AI / Groq API (Llama)
    # ------------------------------------------------------------
    GROQ_API_KEY: str = Field(..., env="GROQ_API_KEY")
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # ------------------------------------------------------------
    # Wolfram Alpha (optional — for cost simulator verification)
    # ------------------------------------------------------------
    WOLFRAM_APP_ID: str | None = Field(default=None, env="WOLFRAM_APP_ID")

    # ------------------------------------------------------------
    # Rate Limiting
    # ------------------------------------------------------------
    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_REGISTER: str = "5/minute"
    RATE_LIMIT_COPILOT: str = "30/minute"

    # ------------------------------------------------------------
    # Encryption (Fernet symmetric key for at-rest credential storage)
    # Generate with:
    # python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
    # ------------------------------------------------------------
    ENCRYPTION_KEY: str = ""

    # ------------------------------------------------------------
    # Phase 2: Observability & Caching
    # ------------------------------------------------------------
    REDIS_URL: str | None = Field(default=None, env="REDIS_URL")
    SENTRY_DSN: str | None = Field(default=None, env="SENTRY_DSN")
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
