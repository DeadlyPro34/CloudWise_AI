import argparse
import uuid
import json
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select, delete

from app.db.session import SessionLocal
from app.models.user import User
from app.models.organization import Organization
from app.models.cloud_account import CloudAccount, CloudProvider, CloudAccountStatus
from app.models.resource_inventory import ResourceInventory, ResourceType, ResourceStatus
from app.models.resource_cost import ResourceCost
from app.models.resource_metric import ResourceMetric
from app.models.recommendation import Recommendation
from app.models.cloud_health_score import CloudHealthScore
from app.services import recommendation_service, health_score_service
from app.services.auth_service import get_user_organization

def run(email=None):
    db = SessionLocal()
    try:
        if email:
            user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
            if not user:
                print(f"User {email} not found.")
                return
        else:
            user = db.execute(select(User)).scalars().first()
            if not user:
                print("No users found in database.")
                return

        print(f"Using user: {user.email}")

        org = get_user_organization(db, user.id)
        if not org:
            print("No organization found for user.")
            return

        account_id = "123456789012"
        account = db.execute(select(CloudAccount).where(
            CloudAccount.organization_id == org.id,
            CloudAccount.account_id == account_id
        )).scalar_one_or_none()

        if not account:
            account = CloudAccount(
                organization_id=org.id,
                provider=CloudProvider.AWS,
                account_id=account_id,
                account_name="ideaforge-demo",
                status=CloudAccountStatus.CONNECTED,
                region="us-east-1",
                is_localstack=False
            )
            db.add(account)
            db.commit()
            db.refresh(account)

        print("Clearing existing demo data...")
        # Get existing resource IDs
        res_ids = list(db.execute(select(ResourceInventory.id).where(ResourceInventory.cloud_account_id == account.id)).scalars().all())
        if res_ids:
            db.execute(delete(CloudHealthScore).where(CloudHealthScore.cloud_account_id == account.id))
            db.execute(delete(Recommendation).where(Recommendation.resource_id.in_(res_ids)))
            db.execute(delete(ResourceCost).where(ResourceCost.resource_id.in_(res_ids)))
            db.execute(delete(ResourceMetric).where(ResourceMetric.resource_id.in_(res_ids)))
            db.execute(delete(ResourceInventory).where(ResourceInventory.cloud_account_id == account.id))
            db.commit()

        print("Seeding new resources...")
        resources_data = [
            ("i-web001", "web-server-1", ResourceType.EC2, ResourceStatus.RUNNING, "t3.medium"),
            ("i-web002", "web-server-2", ResourceType.EC2, ResourceStatus.RUNNING, "t3.medium"),
            ("i-api001", "api-server-1", ResourceType.EC2, ResourceStatus.RUNNING, "t3.small"),
            ("i-worker01", "worker-1", ResourceType.EC2, ResourceStatus.RUNNING, "t3.micro"),
            ("vol-att001", "attached-vol-20gb", ResourceType.EBS, ResourceStatus.IN_USE, "20GB"),
            ("vol-att002", "attached-vol-50gb", ResourceType.EBS, ResourceStatus.IN_USE, "50GB"),
            ("vol-unatt001", "unattached-vol-100gb", ResourceType.EBS, ResourceStatus.AVAILABLE, "100GB"),
        ]

        resources = {}
        for rid, name, rtype, status, size_or_type in resources_data:
            meta = {"InstanceType": size_or_type} if rtype == ResourceType.EC2 else {"Size": int(size_or_type.replace("GB", ""))}
            r = ResourceInventory(
                cloud_account_id=account.id,
                resource_id=rid,
                resource_name=name,
                resource_type=rtype,
                region="us-east-1",
                status=status,
                metadata_json=meta
            )
            db.add(r)
            db.flush()
            resources[rid] = r

        print("Seeding costs...")
        daily_costs = {
            "i-web001": 3.20,
            "i-web002": 3.20,
            "i-api001": 1.60,
            "i-worker01": 0.80,
            "vol-att001": 0.20,
            "vol-att002": 0.50,
            "vol-unatt001": 1.00,
        }

        today = date.today()
        for rid, dcost in daily_costs.items():
            r_id = resources[rid].id
            for i in range(30):
                d = today - timedelta(days=29 - i)
                db.add(ResourceCost(
                    resource_id=r_id,
                    date=d,
                    daily_cost=dcost,
                    monthly_estimate=dcost * 30,
                    service_cost=dcost
                ))

        print("Seeding metrics...")
        metrics_data = {
            "i-web001": 65.0,
            "i-web002": 45.0,
            "i-api001": 32.0,
            "i-worker01": 1.5, # idle recommendation trigger
        }

        now = datetime.now(timezone.utc)
        for rid, val in metrics_data.items():
            r_id = resources[rid].id
            for i in range(8):
                t = now - timedelta(days=7 - i)
                db.add(ResourceMetric(
                    resource_id=r_id,
                    metric_name="CPUUtilization",
                    metric_value=val,
                    metric_unit="Percent",
                    timestamp=t
                ))

        db.commit()

        print("Generating recommendations and health score...")
        recommendation_service.generate_all_recommendations(db, account.id)
        hs_result = health_score_service.calculate_health_score(db, account.id)
        
        recs_count = list(db.execute(select(Recommendation).join(ResourceInventory).where(
            ResourceInventory.cloud_account_id == account.id,
            Recommendation.status == "OPEN"
        )).scalars().all())

        print("\n✅ Demo data seeded!")
        print("📊 Resources: 7 (4 EC2, 3 EBS)")
        print(f"💰 Monthly spend: ~$567/month")
        print(f"⚠️  Recommendations: {len(recs_count)}")
        print(f"🏥 Health Score: {round(hs_result['score'], 1)}/100")

    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", help="User email to seed data for")
    args = parser.parse_args()
    run(args.email)
