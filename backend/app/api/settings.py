"""
Settings API — update runtime configuration (e.g. Groq API key).

For hackathon MVP: updates the in-memory settings object AND persists
to the .env file so the key survives restarts.
"""

import os
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/settings", tags=["Settings"])


class UpdateApiKeyRequest(BaseModel):
    groq_api_key: str


class ApiKeyStatusResponse(BaseModel):
    is_configured: bool
    masked_key: str | None = None


@router.get("/api-key-status", response_model=ApiKeyStatusResponse)
def get_api_key_status(
    current_user: User = Depends(get_current_user),
):
    """Check if the Groq API key is configured (without revealing it)."""
    key = settings.GROQ_API_KEY
    if key:
        # Show first 4 and last 4 chars only
        masked = key[:4] + "•" * (len(key) - 8) + key[-4:] if len(key) > 8 else "••••"
        return ApiKeyStatusResponse(is_configured=True, masked_key=masked)
    return ApiKeyStatusResponse(is_configured=False, masked_key=None)


@router.put("/api-key")
def update_api_key(
    payload: UpdateApiKeyRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Update the Groq API key.
    Updates both in-memory settings and the .env file for persistence.
    """
    new_key = payload.groq_api_key.strip()
    if not new_key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")

    # Update in-memory
    settings.GROQ_API_KEY = new_key

    # Persist to .env file
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
    try:
        if os.path.exists(env_path):
            content = open(env_path, "r").read()
            # Replace existing GROQ_API_KEY line or add it
            if re.search(r"^GROQ_API_KEY=", content, re.MULTILINE):
                content = re.sub(
                    r"^GROQ_API_KEY=.*$", f"GROQ_API_KEY={new_key}", content, flags=re.MULTILINE
                )
            else:
                content += f"\nGROQ_API_KEY={new_key}\n"
            open(env_path, "w").write(content)
        else:
            open(env_path, "w").write(f"GROQ_API_KEY={new_key}\n")
    except Exception:
        # In-memory update still works even if file write fails
        pass

    return {"status": "ok", "message": "Groq API key updated successfully"}
