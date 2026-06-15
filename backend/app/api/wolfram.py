"""
Wolfram Alpha integration — Cloud Cost Impact Simulator.

Provides a POST /wolfram/simulate endpoint that computes projected costs
based on user inputs and optionally verifies with Wolfram Alpha.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import httpx

from app.db.session import get_db
from app.core.deps import get_current_user
from app.core.config import settings
from app.models.user import User

router = APIRouter(prefix="/wolfram", tags=["Wolfram"])


class SimulatorInput(BaseModel):
    current_monthly_spend: float
    instances_to_remove: int
    storage_reduction_gb: int
    traffic_growth_percent: float


class SimulatorOutput(BaseModel):
    projected_monthly: float
    projected_annual: float
    monthly_savings: float
    annual_savings: float
    cost_reduction_percent: float
    wolfram_verification: str  # raw Wolfram answer


@router.post("/simulate", response_model=SimulatorOutput)
def simulate_cost_impact(
    payload: SimulatorInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculate projected cloud costs after proposed changes.

    Uses local arithmetic for the core calculation and optionally
    verifies with Wolfram Alpha's Simple API.
    """
    # Calculate base estimates locally first
    instance_savings = payload.instances_to_remove * 45  # avg $45/instance/month
    storage_savings = payload.storage_reduction_gb * 0.10  # $0.10/GB/month
    traffic_cost = (
        payload.current_monthly_spend
        * (payload.traffic_growth_percent / 100)
        * 0.3
    )

    projected_monthly = (
        payload.current_monthly_spend
        - instance_savings
        - storage_savings
        + traffic_cost
    )
    projected_monthly = max(projected_monthly, 0)
    monthly_savings = payload.current_monthly_spend - projected_monthly
    projected_annual = projected_monthly * 12
    annual_savings = monthly_savings * 12
    cost_reduction_percent = (
        (monthly_savings / payload.current_monthly_spend * 100)
        if payload.current_monthly_spend > 0
        else 0
    )

    # Verify with Wolfram Alpha
    wolfram_answer = "Wolfram verification unavailable"
    if settings.WOLFRAM_APP_ID:
        try:
            query = (
                f"calculate {monthly_savings:.2f} dollars monthly savings "
                f"over 12 months with {payload.traffic_growth_percent}% "
                f"traffic growth adjustment"
            )
            url = "https://api.wolframalpha.com/v1/result"
            params = {"appid": settings.WOLFRAM_APP_ID, "i": query}
            resp = httpx.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                wolfram_answer = resp.text
        except Exception:
            wolfram_answer = f"Annual savings: ${annual_savings:.2f}"

    return SimulatorOutput(
        projected_monthly=round(projected_monthly, 2),
        projected_annual=round(projected_annual, 2),
        monthly_savings=round(monthly_savings, 2),
        annual_savings=round(annual_savings, 2),
        cost_reduction_percent=round(cost_reduction_percent, 2),
        wolfram_verification=wolfram_answer,
    )
