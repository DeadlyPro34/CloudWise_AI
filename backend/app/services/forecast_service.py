"""
Forecast service — generates 7 / 30 / 90-day cost predictions.

Strategy:
  1. Pull daily cost history from resource_costs for the account.
  2. If < 7 days of data → return [] (insufficient history).
  3. Try Facebook Prophet for proper time-series forecasting.
  4. If Prophet is unavailable or fails, fall back to a simple
     average-daily-cost linear projection.
  5. Persist forecasts to the ``forecasts`` table and return them.
"""

import uuid
from datetime import date, timedelta

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.resource_inventory import ResourceInventory
from app.models.resource_cost import ResourceCost
from app.models.forecast import Forecast, ForecastType


# Mapping of forecast horizons to (ForecastType enum, days ahead)
_HORIZONS = [
    (ForecastType.SEVEN_DAY, 7),
    (ForecastType.THIRTY_DAY, 30),
    (ForecastType.NINETY_DAY, 90),
]


def _get_daily_costs(db: Session, cloud_account_id: uuid.UUID) -> list[dict]:
    """
    Aggregate resource_costs into daily totals for the account.
    Returns list of {"ds": date, "y": float} dicts (Prophet naming).
    """
    res_ids_sq = select(ResourceInventory.id).where(
        ResourceInventory.cloud_account_id == cloud_account_id
    )

    rows = db.execute(
        select(
            ResourceCost.date,
            func.sum(ResourceCost.daily_cost).label("total"),
        )
        .where(ResourceCost.resource_id.in_(res_ids_sq))
        .group_by(ResourceCost.date)
        .order_by(ResourceCost.date)
    ).all()

    return [{"ds": row.date, "y": float(row.total)} for row in rows]


def _prophet_forecast(daily: list[dict], horizon_days: int) -> dict:
    """
    Use Prophet for a single horizon.  Returns {"predicted": float,
    "low": float, "high": float} or raises on failure.
    """
    import pandas as pd
    from prophet import Prophet

    df = pd.DataFrame(daily)
    df["ds"] = pd.to_datetime(df["ds"])

    m = Prophet(daily_seasonality=False, yearly_seasonality=False)
    m.fit(df)

    future = m.make_future_dataframe(periods=horizon_days)
    fc = m.predict(future)

    # Sum predicted daily costs over the horizon period
    forecast_rows = fc.tail(horizon_days)
    predicted = float(forecast_rows["yhat"].sum())
    low = float(forecast_rows["yhat_lower"].sum())
    high = float(forecast_rows["yhat_upper"].sum())

    return {"predicted": max(predicted, 0), "low": max(low, 0), "high": high}


def _simple_forecast(daily: list[dict], horizon_days: int) -> dict:
    """Fallback: average daily cost × horizon days, ±20% confidence band."""
    avg_daily = sum(d["y"] for d in daily) / len(daily)
    predicted = avg_daily * horizon_days
    return {
        "predicted": round(predicted, 2),
        "low": round(predicted * 0.8, 2),
        "high": round(predicted * 1.2, 2),
    }


def generate_forecast(db: Session, cloud_account_id: uuid.UUID) -> list[dict]:
    """
    Generate 7 / 30 / 90-day forecasts, persist to DB, and return results.

    Returns [] if insufficient historical data (< 7 days).
    """
    daily = _get_daily_costs(db, cloud_account_id)

    if len(daily) < 7:
        return []

    # Current 30-day spend (for reference)
    current_30d_cost = sum(d["y"] for d in daily[-30:])

    results: list[dict] = []

    for forecast_type, horizon_days in _HORIZONS:
        try:
            fc = _prophet_forecast(daily, horizon_days)
        except Exception:
            fc = _simple_forecast(daily, horizon_days)

        # Persist (replace any prior forecast of same type for this account)
        existing = db.execute(
            select(Forecast).where(
                Forecast.cloud_account_id == cloud_account_id,
                Forecast.forecast_type == forecast_type,
            )
        ).scalar_one_or_none()

        if existing:
            existing.current_cost = current_30d_cost
            existing.predicted_cost = fc["predicted"]
            existing.confidence_interval_low = fc["low"]
            existing.confidence_interval_high = fc["high"]
        else:
            db.add(Forecast(
                cloud_account_id=cloud_account_id,
                forecast_type=forecast_type,
                current_cost=current_30d_cost,
                predicted_cost=fc["predicted"],
                confidence_interval_low=fc["low"],
                confidence_interval_high=fc["high"],
            ))

        results.append({
            "forecast_type": forecast_type.value,
            "current_cost": round(current_30d_cost, 2),
            "predicted_cost": round(fc["predicted"], 2),
            "confidence_interval_low": round(fc["low"], 2),
            "confidence_interval_high": round(fc["high"], 2),
        })

    db.commit()
    return results
