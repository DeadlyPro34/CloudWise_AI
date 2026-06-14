"""
Recommendation service - rule-based engine for cost optimization recommendations.

Rules:
- Idle EC2: average CPU < 5% → DELETE_RESOURCE (if < 1%) or RESIZE_INSTANCE
- Unattached EBS: status == AVAILABLE → DELETE_RESOURCE
"""

import uuid

from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models.resource_inventory import ResourceInventory, ResourceType, ResourceStatus
from app.models.resource_metric import ResourceMetric
from app.models.resource_cost import ResourceCost
from app.models.recommendation import (
    Recommendation,
    RecommendationType,
    RiskLevel,
    Priority,
    RecommendationStatus,
)


def analyze_idle_ec2(db: Session, cloud_account_id: uuid.UUID) -> list[Recommendation]:
    """Find EC2 instances with avg CPU < 5% and create recommendations."""
    ec2_resources = (
        db.execute(
            select(ResourceInventory).where(
                ResourceInventory.cloud_account_id == cloud_account_id,
                ResourceInventory.resource_type == ResourceType.EC2,
                ResourceInventory.status == ResourceStatus.RUNNING,
            )
        )
        .scalars()
        .all()
    )

    new_recs: list[Recommendation] = []
    for resource in ec2_resources:
        # Skip if an open recommendation already exists
        existing = db.execute(
            select(Recommendation).where(
                Recommendation.resource_id == resource.id,
                Recommendation.status == RecommendationStatus.OPEN,
            )
        ).scalar_one_or_none()
        if existing:
            continue

        # Get average CPU metric
        avg_cpu_raw = db.execute(
            select(func.avg(ResourceMetric.metric_value)).where(
                ResourceMetric.resource_id == resource.id,
                ResourceMetric.metric_name == "CPUUtilization",
            )
        ).scalar()

        if avg_cpu_raw is None:
            continue

        avg_cpu = float(avg_cpu_raw)
        if avg_cpu >= 5.0:
            continue

        # Estimate monthly cost from actual cost data or fallback
        avg_daily_cost_raw = db.execute(
            select(func.avg(ResourceCost.daily_cost)).where(
                ResourceCost.resource_id == resource.id,
            )
        ).scalar()

        monthly_cost = 0.0
        if avg_daily_cost_raw is not None and float(avg_daily_cost_raw) > 0:
            monthly_cost = float(avg_daily_cost_raw) * 30
        else:
            # Fallback to instance type lookup
            instance_type = "unknown"
            if resource.metadata_json and "instance_type" in resource.metadata_json:
                instance_type = resource.metadata_json["instance_type"]
            
            # Simple fallback dict
            fallback_costs = {
                "t2.micro": 8.00,
                "t3.micro": 8.00,
                "t3.medium": 30.00,
                "t3.large": 60.00,
                "m5.large": 70.00,
                "m5.xlarge": 140.00,
                "c5.large": 60.00,
            }
            monthly_cost = fallback_costs.get(instance_type, 30.00) # default to $30 if unknown

        if avg_cpu < 1.0:
            rec_type = RecommendationType.DELETE_RESOURCE
            title = f"Terminate idle EC2 instance {resource.resource_id}"
            description = (
                f"Instance {resource.resource_id} "
                f"({resource.resource_name or 'unnamed'}) "
                f"has an average CPU utilization of {avg_cpu:.1f}% over the past 7 days. "
                f"Consider terminating this instance to save costs."
            )
            savings = monthly_cost
            risk = RiskLevel.MEDIUM
            priority = Priority.HIGH
            confidence = 0.90
        else:
            rec_type = RecommendationType.RESIZE_INSTANCE
            title = f"Downsize underutilized EC2 instance {resource.resource_id}"
            description = (
                f"Instance {resource.resource_id} "
                f"({resource.resource_name or 'unnamed'}) "
                f"has an average CPU utilization of {avg_cpu:.1f}% over the past 7 days. "
                f"Consider downsizing to a smaller instance type."
            )
            savings = monthly_cost * 0.5
            risk = RiskLevel.LOW
            priority = Priority.MEDIUM
            confidence = 0.80

        rec = Recommendation(
            resource_id=resource.id,
            recommendation_type=rec_type,
            title=title,
            description=description,
            estimated_monthly_savings=savings,
            confidence_score=confidence,
            risk_level=risk,
            priority=priority,
        )
        db.add(rec)
        new_recs.append(rec)

    return new_recs


def analyze_unattached_ebs(
    db: Session, cloud_account_id: uuid.UUID
) -> list[Recommendation]:
    """Find EBS volumes with status AVAILABLE (unattached) and create recommendations."""
    ebs_resources = (
        db.execute(
            select(ResourceInventory).where(
                ResourceInventory.cloud_account_id == cloud_account_id,
                ResourceInventory.resource_type == ResourceType.EBS,
                ResourceInventory.status == ResourceStatus.AVAILABLE,
            )
        )
        .scalars()
        .all()
    )

    new_recs: list[Recommendation] = []
    for resource in ebs_resources:
        existing = db.execute(
            select(Recommendation).where(
                Recommendation.resource_id == resource.id,
                Recommendation.status == RecommendationStatus.OPEN,
            )
        ).scalar_one_or_none()
        if existing:
            continue

        # Calculate savings from actual costs or fallback
        avg_daily_cost_raw = db.execute(
            select(func.avg(ResourceCost.daily_cost)).where(
                ResourceCost.resource_id == resource.id,
            )
        ).scalar()

        estimated_savings = 0.0
        size_gb = 0
        if resource.metadata_json and "size_gb" in resource.metadata_json:
            size_gb = resource.metadata_json["size_gb"]
        if avg_daily_cost_raw is not None and float(avg_daily_cost_raw) > 0:
            estimated_savings = float(avg_daily_cost_raw) * 30
        else:
            estimated_savings = float(size_gb) * 0.10  # ~$0.10/GB/month for gp2

        rec = Recommendation(
            resource_id=resource.id,
            recommendation_type=RecommendationType.DELETE_RESOURCE,
            title=f"Delete unattached EBS volume {resource.resource_id}",
            description=(
                f"EBS volume {resource.resource_id} "
                f"({resource.resource_name or 'unnamed'}) "
                f"is not attached to any instance. Size: {size_gb}GB. "
                f"Consider deleting to save approximately ${estimated_savings:.2f}/month."
            ),
            estimated_monthly_savings=estimated_savings,
            confidence_score=0.95,
            risk_level=RiskLevel.LOW,
            priority=Priority.HIGH,
        )
        db.add(rec)
        new_recs.append(rec)

    return new_recs


def generate_all_recommendations(db: Session, cloud_account_id: uuid.UUID) -> int:
    """Run all recommendation analyzers and return total count of new recommendations."""
    idle_recs = analyze_idle_ec2(db, cloud_account_id)
    ebs_recs = analyze_unattached_ebs(db, cloud_account_id)
    db.commit()
    return len(idle_recs) + len(ebs_recs)
