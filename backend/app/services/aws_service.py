"""
AWS service - boto3 wrapper for connecting, discovering resources,
fetching cost data, and CloudWatch metrics.
"""

import boto3
from datetime import datetime, timedelta, timezone


def connect_aws(access_key: str, secret_key: str, region: str = "us-east-1", use_localstack: bool = False) -> dict:
    """
    Validate AWS credentials via STS and return account info + session.

    Returns:
        dict with keys: account_id, arn, session
    Raises:
        botocore.exceptions.ClientError on bad credentials.
    """
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    )
    endpoint_url = "http://localhost:4566" if use_localstack else None
    sts = session.client("sts", endpoint_url=endpoint_url)
    identity = sts.get_caller_identity()
    return {
        "account_id": identity["Account"],
        "arn": identity["Arn"],
        "session": session,
    }


def discover_ec2(session: boto3.Session, region: str, use_localstack: bool = False) -> list[dict]:
    """Discover EC2 instances and map to ResourceInventory-compatible dicts."""
    endpoint_url = "http://localhost:4566" if use_localstack else None
    ec2 = session.client("ec2", region_name=region, endpoint_url=endpoint_url)
    response = ec2.describe_instances()
    resources: list[dict] = []

    for reservation in response.get("Reservations", []):
        for inst in reservation.get("Instances", []):
            state = inst.get("State", {}).get("Name", "unknown").upper()
            status_map = {
                "RUNNING": "RUNNING",
                "STOPPED": "STOPPED",
                "TERMINATED": "TERMINATED",
            }
            status = status_map.get(state, "UNKNOWN")

            name = None
            tags_dict: dict[str, str] = {}
            for tag in inst.get("Tags", []):
                tags_dict[tag["Key"]] = tag["Value"]
                if tag["Key"] == "Name":
                    name = tag["Value"]

            resources.append(
                {
                    "resource_id": inst["InstanceId"],
                    "resource_name": name,
                    "resource_type": "EC2",
                    "region": region,
                    "arn": inst.get("InstanceId"),
                    "status": status,
                    "tags": tags_dict or None,
                    "metadata_json": {
                        "instance_type": inst.get("InstanceType"),
                        "launch_time": str(inst.get("LaunchTime")),
                        "private_ip": inst.get("PrivateIpAddress"),
                        "public_ip": inst.get("PublicIpAddress"),
                        "vpc_id": inst.get("VpcId"),
                    },
                }
            )
    return resources


def discover_ebs(session: boto3.Session, region: str, use_localstack: bool = False) -> list[dict]:
    """Discover EBS volumes and map to ResourceInventory-compatible dicts."""
    endpoint_url = "http://localhost:4566" if use_localstack else None
    ec2 = session.client("ec2", region_name=region, endpoint_url=endpoint_url)
    response = ec2.describe_volumes()
    resources: list[dict] = []

    for vol in response.get("Volumes", []):
        state = vol.get("State", "unknown").upper()
        if state == "AVAILABLE":
            status = "AVAILABLE"
        elif state == "IN-USE":
            status = "IN_USE"
        else:
            status = "UNKNOWN"

        name = None
        tags_dict: dict[str, str] = {}
        for tag in vol.get("Tags", []):
            tags_dict[tag["Key"]] = tag["Value"]
            if tag["Key"] == "Name":
                name = tag["Value"]

        resources.append(
            {
                "resource_id": vol["VolumeId"],
                "resource_name": name,
                "resource_type": "EBS",
                "region": region,
                "arn": vol.get("VolumeId"),
                "status": status,
                "tags": tags_dict or None,
                "metadata_json": {
                    "volume_type": vol.get("VolumeType"),
                    "size_gb": vol.get("Size"),
                    "iops": vol.get("Iops"),
                    "encrypted": vol.get("Encrypted"),
                    "attachments": [
                        a.get("InstanceId") for a in vol.get("Attachments", [])
                    ],
                },
            }
        )
    return resources


def get_cost_data(session: boto3.Session, region: str, use_localstack: bool = False) -> list[dict]:
    """Get cost data from AWS Cost Explorer for last 30 days, grouped by SERVICE."""
    endpoint_url = "http://localhost:4566" if use_localstack else None
    ce = session.client("ce", region_name="us-east-1", endpoint_url=endpoint_url)  # CE endpoint is always us-east-1
    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=30)

    response = ce.get_cost_and_usage(
        TimePeriod={
            "Start": start.isoformat(),
            "End": end.isoformat(),
        },
        Granularity="DAILY",
        Metrics=["UnblendedCost"],
        GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
    )

    results: list[dict] = []
    for time_period in response.get("ResultsByTime", []):
        period_start = time_period["TimePeriod"]["Start"]
        for group in time_period.get("Groups", []):
            service = group["Keys"][0]
            amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
            results.append(
                {
                    "date": period_start,
                    "service": service,
                    "amount": amount,
                }
            )
    return results


def get_cloudwatch_metrics(
    session: boto3.Session, region: str, instance_ids: list[str], use_localstack: bool = False
) -> dict[str, float]:
    """Get average CPUUtilization over 7 days for each EC2 instance."""
    endpoint_url = "http://localhost:4566" if use_localstack else None
    cw = session.client("cloudwatch", region_name=region, endpoint_url=endpoint_url)
    end = datetime.now(timezone.utc)
    start = end - timedelta(days=7)

    metrics: dict[str, float] = {}
    for instance_id in instance_ids:
        try:
            response = cw.get_metric_statistics(
                Namespace="AWS/EC2",
                MetricName="CPUUtilization",
                Dimensions=[{"Name": "InstanceId", "Value": instance_id}],
                StartTime=start,
                EndTime=end,
                Period=86400,  # 1 day
                Statistics=["Average"],
            )
            datapoints = response.get("Datapoints", [])
            if datapoints:
                avg = sum(dp["Average"] for dp in datapoints) / len(datapoints)
            else:
                avg = 0.0
            metrics[instance_id] = avg
        except Exception:
            metrics[instance_id] = 0.0

    return metrics
