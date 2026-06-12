"""
Dashboard API routes — KPI summary, health score, and recommendations.

All queries scope data to the current user's organization's CloudAccount(s).
If no CloudAccount exists, returns zeros/empty to preserve the frontend
empty-state behaviour.
"""

from datetime import date, timedelta
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select, func, case
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cloud_account import CloudAccount
from app.models.resource_inventory import ResourceInventory
from app.models.resource_cost import ResourceCost
from app.models.recommendation import Recommendation, RecommendationStatus, Priority
from app.models.cloud_health_score import CloudHealthScore
from app.services.auth_service import get_user_organization
from app.services import health_score_service

router = APIRouter(tags=["Dashboard"])


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _get_account_ids(db: Session, user: User) -> list[uuid.UUID]:
    """Return all CloudAccount IDs belonging to the user's org."""
    org = get_user_organization(db, user.id)
    if not org:
        return []
    return list(
        db.execute(
            select(CloudAccount.id).where(CloudAccount.organization_id == org.id)
        ).scalars().all()
    )


def _account_resource_ids_subquery(account_ids: list[uuid.UUID]):
    """Subquery: resource UUIDs belonging to any of *account_ids*."""
    return select(ResourceInventory.id).where(
        ResourceInventory.cloud_account_id.in_(account_ids)
    )


# ------------------------------------------------------------------
# GET /dashboard  (Item 4)
# ------------------------------------------------------------------

@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    KPI summary for the dashboard hero cards + cost trend chart.

    Returns zeros / empty list when no CloudAccount is connected so
    the frontend can show its 'Connect AWS' empty state.
    """
    account_ids = _get_account_ids(db, current_user)
    if not account_ids:
        return {
            "total_spend": 0,
            "potential_savings": 0,
            "health_score": 0,
            "resource_count": 0,
            "cost_trend": [],
        }

    res_ids_sq = _account_resource_ids_subquery(account_ids)
    thirty_days_ago = date.today() - timedelta(days=30)

    # ── Total spend (last 30 days) ────────────────────────────
    total_spend = float(
        db.execute(
            select(func.sum(ResourceCost.daily_cost)).where(
                ResourceCost.resource_id.in_(res_ids_sq),
                ResourceCost.date >= thirty_days_ago,
            )
        ).scalar() or 0
    )

    # ── Potential savings (open recommendations) ──────────────
    potential_savings = float(
        db.execute(
            select(func.sum(Recommendation.estimated_monthly_savings)).where(
                Recommendation.resource_id.in_(res_ids_sq),
                Recommendation.status == RecommendationStatus.OPEN,
            )
        ).scalar() or 0
    )

    # ── Health score (latest) ─────────────────────────────────
    latest_hs = db.execute(
        select(CloudHealthScore.score)
        .where(CloudHealthScore.cloud_account_id.in_(account_ids))
        .order_by(CloudHealthScore.calculated_at.desc())
    ).scalar()

    if latest_hs is not None:
        health_score = float(latest_hs)
    else:
        # Calculate on the fly if none exists yet
        try:
            result = health_score_service.calculate_health_score(db, account_ids[0])
            health_score = result["score"]
        except Exception:
            health_score = 0

    # ── Resource count ────────────────────────────────────────
    resource_count = db.execute(
        select(func.count(ResourceInventory.id)).where(
            ResourceInventory.cloud_account_id.in_(account_ids)
        )
    ).scalar() or 0

    # ── Cost trend (daily aggregates, last 30 days) ───────────
    trend_rows = db.execute(
        select(
            ResourceCost.date,
            func.sum(ResourceCost.daily_cost).label("cost"),
        )
        .where(
            ResourceCost.resource_id.in_(res_ids_sq),
            ResourceCost.date >= thirty_days_ago,
        )
        .group_by(ResourceCost.date)
        .order_by(ResourceCost.date)
    ).all()

    cost_trend = [
        {"date": str(row.date), "cost": round(float(row.cost), 2)}
        for row in trend_rows
    ]

    return {
        "total_spend": round(total_spend, 2),
        "potential_savings": round(potential_savings, 2),
        "health_score": round(health_score, 2),
        "resource_count": resource_count,
        "cost_trend": cost_trend,
    }


# ------------------------------------------------------------------
# GET /health-score  (Item 5)
# ------------------------------------------------------------------

@router.get("/health-score")
def get_health_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return the latest Cloud Health Score breakdown."""
    account_ids = _get_account_ids(db, current_user)
    if not account_ids:
        return {
            "score": 0,
            "resource_efficiency": 0,
            "cost_efficiency": 0,
            "storage_efficiency": 0,
            "forecast_risk": 0,
        }

    latest = db.execute(
        select(CloudHealthScore)
        .where(CloudHealthScore.cloud_account_id.in_(account_ids))
        .order_by(CloudHealthScore.calculated_at.desc())
    ).scalar_one_or_none()

    if latest:
        return {
            "score": float(latest.score),
            "resource_efficiency": float(latest.resource_efficiency),
            "cost_efficiency": float(latest.cost_efficiency),
            "storage_efficiency": float(latest.storage_efficiency),
            "forecast_risk": float(latest.forecast_risk),
        }

    # Calculate on the fly if none exists yet
    try:
        return health_score_service.calculate_health_score(db, account_ids[0])
    except Exception:
        return {
            "score": 0,
            "resource_efficiency": 0,
            "cost_efficiency": 0,
            "storage_efficiency": 0,
            "forecast_risk": 0,
        }


# ------------------------------------------------------------------
# GET /recommendations  (Item 6)
# ------------------------------------------------------------------

@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List open recommendations joined with resource_inventory for display.

    Ordered by priority (HIGH → MEDIUM → LOW) then by estimated savings
    descending, matching the frontend's expected sort order.
    """
    account_ids = _get_account_ids(db, current_user)
    if not account_ids:
        return []

    res_ids_sq = _account_resource_ids_subquery(account_ids)

    # SQLite doesn't support native enum ordering, so use CASE for priority
    priority_order = case(
        (Recommendation.priority == Priority.HIGH, 1),
        (Recommendation.priority == Priority.MEDIUM, 2),
        (Recommendation.priority == Priority.LOW, 3),
        else_=4,
    )

    rows = db.execute(
        select(Recommendation, ResourceInventory.resource_id, ResourceInventory.resource_name)
        .join(ResourceInventory, Recommendation.resource_id == ResourceInventory.id)
        .where(
            Recommendation.resource_id.in_(res_ids_sq),
            Recommendation.status == RecommendationStatus.OPEN,
        )
        .order_by(priority_order, Recommendation.estimated_monthly_savings.desc())
    ).all()

    return [
        {
            "id": str(rec.id),
            "resource_id": aws_resource_id,          # AWS ID (i-xxx, vol-xxx)
            "resource_name": resource_name,
            "recommendation_type": rec.recommendation_type.value,
            "title": rec.title,
            "description": rec.description,
            "estimated_monthly_savings": float(rec.estimated_monthly_savings),
            "confidence_score": float(rec.confidence_score),
            "risk_level": rec.risk_level.value,
            "priority": rec.priority.value,
            "status": rec.status.value,
        }
        for rec, aws_resource_id, resource_name in rows
    ]
