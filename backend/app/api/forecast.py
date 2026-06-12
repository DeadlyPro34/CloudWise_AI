"""
Forecast API route — returns 7 / 30 / 90-day cost predictions.

If there is insufficient historical data (< 7 days of cost records)
or no CloudAccount is connected, returns [] gracefully.
"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cloud_account import CloudAccount
from app.models.forecast import Forecast
from app.services.auth_service import get_user_organization
from app.services import forecast_service

router = APIRouter(prefix="/forecast", tags=["Forecast"])


@router.get("/")
def get_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return cost forecasts for the user's CloudAccount.

    On first call (or if data has changed), forecasts are generated fresh.
    Returns existing stored forecasts if they are already present.
    """
    org = get_user_organization(db, current_user.id)
    if not org:
        return []

    account = db.execute(
        select(CloudAccount).where(CloudAccount.organization_id == org.id)
    ).scalar_one_or_none()

    if not account:
        return []

    # Check for existing forecasts first (avoid re-computing every GET)
    existing = db.execute(
        select(Forecast)
        .where(Forecast.cloud_account_id == account.id)
        .order_by(Forecast.forecast_type)
    ).scalars().all()

    if existing:
        return [
            {
                "forecast_type": f.forecast_type.value,
                "current_cost": float(f.current_cost),
                "predicted_cost": float(f.predicted_cost),
                "confidence_interval_low": float(f.confidence_interval_low),
                "confidence_interval_high": float(f.confidence_interval_high),
            }
            for f in existing
        ]

    # Generate fresh forecasts (returns [] if insufficient data)
    try:
        return forecast_service.generate_forecast(db, account.id)
    except Exception:
        return []
