import io
import uuid
from datetime import date, timedelta
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet

from app.models.cloud_account import CloudAccount
from app.models.resource_inventory import ResourceInventory
from app.models.resource_cost import ResourceCost
from app.models.recommendation import Recommendation, RecommendationStatus
from app.models.cloud_health_score import CloudHealthScore
from app.models.forecast import Forecast

def generate_report(db: Session, cloud_account_id: uuid.UUID | None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph("CloudWise AI — Cloud Optimization Report", styles['Title']))
    elements.append(Paragraph(f"Date: {date.today().isoformat()}", styles['Normal']))
    elements.append(Spacer(1, 20))

    if not cloud_account_id:
        elements.append(Paragraph("No AWS Account Connected.", styles['Heading2']))
        elements.append(Paragraph("Please connect an AWS account to view insights.", styles['Normal']))
        doc.build(elements)
        return buffer.getvalue()

    account = db.execute(select(CloudAccount).where(CloudAccount.id == cloud_account_id)).scalar_one_or_none()
    if not account:
        elements.append(Paragraph("AWS Account not found.", styles['Heading2']))
        doc.build(elements)
        return buffer.getvalue()

    # Executive Summary
    elements.append(Paragraph("Executive Summary", styles['Heading2']))
    
    thirty_days_ago = date.today() - timedelta(days=30)
    res_ids_sq = select(ResourceInventory.id).where(ResourceInventory.cloud_account_id == cloud_account_id)
    
    total_spend = db.execute(
        select(func.sum(ResourceCost.daily_cost)).where(
            ResourceCost.resource_id.in_(res_ids_sq),
            ResourceCost.date >= thirty_days_ago
        )
    ).scalar() or 0.0

    potential_savings = db.execute(
        select(func.sum(Recommendation.estimated_monthly_savings)).where(
            Recommendation.resource_id.in_(res_ids_sq),
            Recommendation.status == RecommendationStatus.OPEN
        )
    ).scalar() or 0.0

    latest_hs = db.execute(
        select(CloudHealthScore)
        .where(CloudHealthScore.cloud_account_id == cloud_account_id)
        .order_by(CloudHealthScore.calculated_at.desc())
    ).scalar_one_or_none()

    hs_val = float(latest_hs.score) if latest_hs else 0.0

    exec_data = [
        ["Total Spend (30 days)", f"${total_spend:,.2f}"],
        ["Potential Monthly Savings", f"${potential_savings:,.2f}"],
        ["Cloud Health Score", f"{hs_val}/100"]
    ]
    t = Table(exec_data, colWidths=[200, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 20))

    # Resource Overview
    elements.append(Paragraph("Resource Overview", styles['Heading2']))
    type_counts = db.execute(
        select(ResourceInventory.resource_type, func.count(ResourceInventory.id))
        .where(ResourceInventory.cloud_account_id == cloud_account_id)
        .group_by(ResourceInventory.resource_type)
    ).all()

    if type_counts:
        res_data = [["Resource Type", "Count"]]
        for rt, cnt in type_counts:
            rt_val = rt.value if hasattr(rt, 'value') else str(rt)
            res_data.append([rt_val, str(cnt)])
        
        t = Table(res_data, colWidths=[200, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
        ]))
        elements.append(t)
    else:
        elements.append(Paragraph("No resources found.", styles['Normal']))
    
    elements.append(Spacer(1, 20))

    # Top Recommendations
    elements.append(Paragraph("Top Recommendations", styles['Heading2']))
    recs = db.execute(
        select(Recommendation, ResourceInventory.resource_name)
        .join(ResourceInventory, Recommendation.resource_id == ResourceInventory.id)
        .where(ResourceInventory.cloud_account_id == cloud_account_id, Recommendation.status == RecommendationStatus.OPEN)
        .order_by(Recommendation.estimated_monthly_savings.desc())
        .limit(5)
    ).all()

    if recs:
        rec_data = [["Resource", "Issue", "Savings/mo"]]
        for rec, r_name in recs:
            rec_data.append([r_name, rec.title, f"${rec.estimated_monthly_savings:,.2f}"])
        
        t = Table(rec_data, colWidths=[150, 200, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
        ]))
        elements.append(t)
    else:
        elements.append(Paragraph("No open recommendations.", styles['Normal']))
    
    elements.append(Spacer(1, 20))

    # Cost Forecast
    elements.append(Paragraph("Cost Forecast", styles['Heading2']))
    forecasts = db.execute(
        select(Forecast)
        .where(Forecast.cloud_account_id == cloud_account_id)
        .order_by(Forecast.forecast_date.asc())
    ).scalars().all()

    if forecasts:
        fc_data = [["Date", "Predicted Cost"]]
        for fc in forecasts:
            fc_data.append([fc.forecast_date.isoformat(), f"${fc.predicted_cost:,.2f}"])
        
        t = Table(fc_data, colWidths=[150, 150])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
        ]))
        elements.append(t)
    else:
        elements.append(Paragraph("Insufficient data for forecasts.", styles['Normal']))

    doc.build(elements)
    return buffer.getvalue()
