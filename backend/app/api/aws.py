"""
AWS API routes — connect, scan, and resource listing.

Design decisions (hackathon MVP):
- Credentials are stored in cloud_accounts.aws_access_key_enc / aws_secret_key_enc
  so the user doesn't have to re-enter them for every /scan.  In production these
  MUST move to a vault (AWS Secrets Manager, HashiCorp Vault, etc.).
- Cost Explorer data is distributed evenly across resources of the matching type
  (EC2, EBS) because CE returns service-level granularity, not per-resource.
"""

from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.cloud_account import CloudAccount, CloudProvider, CloudAccountStatus
from app.models.resource_inventory import ResourceInventory, ResourceType, ResourceStatus
from app.models.resource_cost import ResourceCost
from app.models.resource_metric import ResourceMetric
from app.schemas.aws import AWSConnectRequest
from app.services.auth_service import get_user_organization
from app.services import aws_service
from app.services import recommendation_service
from app.services import health_score_service

router = APIRouter(prefix="/aws", tags=["AWS"])

# Maps AWS Cost Explorer service names (prefix match) to our ResourceType enum.
_SERVICE_TYPE_MAP = {
    "Amazon Elastic Compute Cloud": ResourceType.EC2,
    "EC2 - Other": ResourceType.EC2,
    "Amazon Elastic Block Store": ResourceType.EBS,
}


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _get_user_cloud_account(db: Session, user: User) -> CloudAccount | None:
    """Return the first CONNECTED CloudAccount for the user's org, or None."""
    org = get_user_organization(db, user.id)
    if not org:
        return None
    return db.execute(
        select(CloudAccount).where(
            CloudAccount.organization_id == org.id,
            CloudAccount.status == CloudAccountStatus.CONNECTED,
        )
    ).scalar_one_or_none()


def _raise_aws_error(e: Exception) -> None:
    """Convert boto3 / botocore errors into user-friendly HTTP 400 responses."""
    msg = str(e)
    if "InvalidClientTokenId" in msg or "AuthFailure" in msg or "SignatureDoesNotMatch" in msg:
        raise HTTPException(status_code=400, detail="Invalid AWS credentials. Please check your Access Key ID and Secret Access Key.")
    if "AccessDenied" in msg:
        raise HTTPException(status_code=400, detail="Access denied. Ensure the IAM user has at least read-only permissions.")
    if "ExpiredToken" in msg:
        raise HTTPException(status_code=400, detail="Your AWS credentials have expired. Please generate new credentials.")
    raise HTTPException(status_code=400, detail=f"AWS error: {msg}")


def _map_service_to_type(service_name: str) -> ResourceType | None:
    """Prefix-match an AWS Cost Explorer service name to a ResourceType."""
    for prefix, rtype in _SERVICE_TYPE_MAP.items():
        if service_name.startswith(prefix):
            return rtype
    return None


def _store_cost_data(
    db: Session,
    cloud_account_id: uuid.UUID,
    cost_data: list[dict],
) -> None:
    """
    Persist Cost Explorer data into resource_costs.

    Assumption: CE returns service-level daily costs.  We distribute each
    service's daily cost evenly across all discovered resources of the
    matching type (EC2 costs ÷ N_ec2 instances, EBS costs ÷ N_ebs volumes).
    This is a reasonable hackathon approximation; production would use
    per-resource cost allocation tags or AWS CUR.
    """
    # Group raw CE data → {date_str: {ResourceType: total_amount}}
    daily_type_costs: dict[str, dict[ResourceType, float]] = defaultdict(lambda: defaultdict(float))
    for entry in cost_data:
        rtype = _map_service_to_type(entry["service"])
        if rtype is not None:
            daily_type_costs[entry["date"]][rtype] += entry["amount"]

    # Load inventory grouped by type for this account
    resources_by_type: dict[ResourceType, list[uuid.UUID]] = defaultdict(list)
    rows = db.execute(
        select(ResourceInventory.id, ResourceInventory.resource_type).where(
            ResourceInventory.cloud_account_id == cloud_account_id
        )
    ).all()
    for row in rows:
        resources_by_type[row.resource_type].append(row.id)

    # Distribute & upsert
    for date_str, type_costs in daily_type_costs.items():
        cost_date = date.fromisoformat(date_str)
        for rtype, total_cost in type_costs.items():
            targets = resources_by_type.get(rtype, [])
            if not targets:
                continue
            per_resource = total_cost / len(targets)
            for inv_id in targets:
                existing = db.execute(
                    select(ResourceCost).where(
                        ResourceCost.resource_id == inv_id,
                        ResourceCost.date == cost_date,
                    )
                ).scalar_one_or_none()
                if existing:
                    existing.daily_cost = per_resource
                    existing.monthly_estimate = per_resource * 30
                    existing.service_cost = total_cost
                else:
                    db.add(ResourceCost(
                        resource_id=inv_id,
                        date=cost_date,
                        daily_cost=per_resource,
                        monthly_estimate=per_resource * 30,
                        service_cost=total_cost,
                    ))


# ------------------------------------------------------------------
# POST /aws/connect  (Item 1)
# ------------------------------------------------------------------

@router.post("/connect")
def connect_aws(
    payload: AWSConnectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Validate AWS credentials via STS and create/update a CloudAccount row."""
    org = get_user_organization(db, current_user.id)
    if not org:
        raise HTTPException(status_code=400, detail="No organization found for this user.")

    # Validate against AWS STS
    try:
        result = aws_service.connect_aws(
            access_key=payload.aws_access_key_id,
            secret_key=payload.aws_secret_access_key,
            region=payload.region,
        )
    except Exception as e:
        _raise_aws_error(e)

    aws_account_id = result["account_id"]
    account_name = result.get("arn", "").split("/")[-1] or None

    # Upsert: update existing or create new
    existing = db.execute(
        select(CloudAccount).where(
            CloudAccount.organization_id == org.id,
            CloudAccount.account_id == aws_account_id,
        )
    ).scalar_one_or_none()

    if existing:
        existing.status = CloudAccountStatus.CONNECTED
        existing.account_name = account_name
        existing.aws_access_key_enc = payload.aws_access_key_id
        existing.aws_secret_key_enc = payload.aws_secret_access_key
        existing.region = payload.region
        existing.updated_at = datetime.now(timezone.utc)
        account = existing
    else:
        account = CloudAccount(
            organization_id=org.id,
            provider=CloudProvider.AWS,
            account_id=aws_account_id,
            account_name=account_name,
            status=CloudAccountStatus.CONNECTED,
            aws_access_key_enc=payload.aws_access_key_id,
            aws_secret_key_enc=payload.aws_secret_access_key,
            region=payload.region,
        )
        db.add(account)

    db.commit()
    db.refresh(account)

    return {
        "account_id": account.account_id,
        "account_name": account.account_name,
        "status": account.status.value,
    }


# ------------------------------------------------------------------
# POST /aws/scan  (Item 2)
# ------------------------------------------------------------------

@router.post("/scan")
def scan_aws(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Full infrastructure scan: discover resources, pull costs & metrics,
    generate recommendations, and calculate health score.
    """
    account = _get_user_cloud_account(db, current_user)
    if not account:
        raise HTTPException(status_code=400, detail="No AWS account connected. Use POST /aws/connect first.")

    if not account.aws_access_key_enc or not account.aws_secret_key_enc:
        raise HTTPException(status_code=400, detail="AWS credentials not available. Please reconnect your account.")

    region = account.region or "us-east-1"

    try:
        # Re-establish boto3 session via STS validation
        aws_result = aws_service.connect_aws(
            account.aws_access_key_enc, account.aws_secret_key_enc, region
        )
        session = aws_result["session"]

        # ── Discover resources ──────────────────────────────────
        ec2_resources = aws_service.discover_ec2(session, region)
        ebs_resources = aws_service.discover_ebs(session, region)
        all_discovered = ec2_resources + ebs_resources

        # Upsert into resource_inventory
        # resource_map: AWS resource_id (e.g. "i-abc123") → internal UUID
        resource_map: dict[str, uuid.UUID] = {}

        for r in all_discovered:
            existing = db.execute(
                select(ResourceInventory).where(
                    ResourceInventory.cloud_account_id == account.id,
                    ResourceInventory.resource_id == r["resource_id"],
                )
            ).scalar_one_or_none()

            if existing:
                existing.resource_name = r.get("resource_name")
                existing.status = ResourceStatus(r["status"])
                existing.tags = r.get("tags")
                existing.metadata_json = r.get("metadata_json")
                existing.updated_at = datetime.now(timezone.utc)
                db.flush()
                resource_map[r["resource_id"]] = existing.id
            else:
                new_res = ResourceInventory(
                    cloud_account_id=account.id,
                    resource_id=r["resource_id"],
                    resource_name=r.get("resource_name"),
                    resource_type=ResourceType(r["resource_type"]),
                    region=r.get("region", region),
                    arn=r.get("arn"),
                    status=ResourceStatus(r["status"]),
                    tags=r.get("tags"),
                    metadata_json=r.get("metadata_json"),
                )
                db.add(new_res)
                db.flush()
                resource_map[r["resource_id"]] = new_res.id

        # ── Cost data (Cost Explorer) ──────────────────────────
        try:
            cost_data = aws_service.get_cost_data(session, region)
            _store_cost_data(db, account.id, cost_data)
        except Exception:
            pass  # CE may not be enabled — skip gracefully

        # ── CloudWatch metrics ─────────────────────────────────
        ec2_ids = [r["resource_id"] for r in ec2_resources]
        if ec2_ids:
            try:
                cw_metrics = aws_service.get_cloudwatch_metrics(session, region, ec2_ids)
                for instance_id, avg_cpu in cw_metrics.items():
                    inv_id = resource_map.get(instance_id)
                    if inv_id is None:
                        continue
                    db.add(ResourceMetric(
                        resource_id=inv_id,
                        metric_name="CPUUtilization",
                        metric_value=avg_cpu,
                        metric_unit="Percent",
                        timestamp=datetime.now(timezone.utc),
                    ))
            except Exception:
                pass  # CloudWatch might not have data yet

        db.commit()

        # ── Post-scan analysis ─────────────────────────────────
        recommendation_service.generate_all_recommendations(db, account.id)
        health_score_service.calculate_health_score(db, account.id)

        # Update sync timestamp
        account.last_sync_at = datetime.now(timezone.utc)
        db.commit()

        return {
            "ec2_count": len(ec2_resources),
            "ebs_count": len(ebs_resources),
            "total_resources": len(all_discovered),
            "status": "SUCCESS",
        }

    except HTTPException:
        raise
    except Exception as e:
        _raise_aws_error(e)


# ------------------------------------------------------------------
# GET /aws/resources  (Item 3)
# ------------------------------------------------------------------

@router.get("/resources")
def get_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all discovered resources for the user's connected AWS account(s)."""
    org = get_user_organization(db, current_user.id)
    if not org:
        return []

    # Get all cloud account IDs for this org
    account_ids = db.execute(
        select(CloudAccount.id).where(CloudAccount.organization_id == org.id)
    ).scalars().all()

    if not account_ids:
        return []

    thirty_days_ago = date.today() - timedelta(days=30)

    resources = db.execute(
        select(ResourceInventory).where(
            ResourceInventory.cloud_account_id.in_(account_ids)
        )
    ).scalars().all()

    result = []
    for r in resources:
        # Calculate monthly cost from last 30 days of cost data
        monthly_cost_raw = db.execute(
            select(func.sum(ResourceCost.daily_cost)).where(
                ResourceCost.resource_id == r.id,
                ResourceCost.date >= thirty_days_ago,
            )
        ).scalar()
        monthly_cost = float(monthly_cost_raw) if monthly_cost_raw else None

        result.append({
            "id": str(r.id),
            "resource_id": r.resource_id,
            "resource_name": r.resource_name,
            "resource_type": r.resource_type.value,
            "region": r.region,
            "status": r.status.value,
            "tags": r.tags,
            "metadata_json": r.metadata_json,
            "monthly_cost": monthly_cost,
        })

    return result
