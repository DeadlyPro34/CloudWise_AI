import boto3

def run():
    print("Connecting to LocalStack (http://localhost:4566)...")
    ec2 = boto3.client(
        "ec2",
        endpoint_url="http://localhost:4566",
        region_name="us-east-1",
        aws_access_key_id="test",
        aws_secret_access_key="test"
    )

    print("Creating EC2 instances...")
    ec2_ids = []
    
    # 1. web-server-1 (t3.medium)
    res = ec2.run_instances(
        ImageId="ami-00000000",
        InstanceType="t3.medium",
        MinCount=1,
        MaxCount=1,
        TagSpecifications=[{
            'ResourceType': 'instance',
            'Tags': [{'Key': 'Name', 'Value': 'web-server-1'}]
        }]
    )
    ec2_ids.append(res["Instances"][0]["InstanceId"])

    # 2. web-server-2 (t3.medium)
    res = ec2.run_instances(
        ImageId="ami-00000000",
        InstanceType="t3.medium",
        MinCount=1,
        MaxCount=1,
        TagSpecifications=[{
            'ResourceType': 'instance',
            'Tags': [{'Key': 'Name', 'Value': 'web-server-2'}]
        }]
    )
    ec2_ids.append(res["Instances"][0]["InstanceId"])

    # 3. api-server-1 (t3.small)
    res = ec2.run_instances(
        ImageId="ami-00000000",
        InstanceType="t3.small",
        MinCount=1,
        MaxCount=1,
        TagSpecifications=[{
            'ResourceType': 'instance',
            'Tags': [{'Key': 'Name', 'Value': 'api-server-1'}]
        }]
    )
    ec2_ids.append(res["Instances"][0]["InstanceId"])

    # 4. worker-1 (t3.micro)
    res = ec2.run_instances(
        ImageId="ami-00000000",
        InstanceType="t3.micro",
        MinCount=1,
        MaxCount=1,
        TagSpecifications=[{
            'ResourceType': 'instance',
            'Tags': [{'Key': 'Name', 'Value': 'worker-1'}]
        }]
    )
    ec2_ids.append(res["Instances"][0]["InstanceId"])

    print("Creating EBS volumes...")
    ebs_ids = []

    # 1. 20 GB attached volume (Simulated as just creating it for now, LocalStack attachment is complex)
    res = ec2.create_volume(
        AvailabilityZone="us-east-1a",
        Size=20,
        VolumeType="gp2",
        TagSpecifications=[{
            'ResourceType': 'volume',
            'Tags': [{'Key': 'Name', 'Value': 'attached-vol-20gb'}]
        }]
    )
    ebs_ids.append(res["VolumeId"])

    # 2. 50 GB attached volume
    res = ec2.create_volume(
        AvailabilityZone="us-east-1b",
        Size=50,
        VolumeType="gp2",
        TagSpecifications=[{
            'ResourceType': 'volume',
            'Tags': [{'Key': 'Name', 'Value': 'attached-vol-50gb'}]
        }]
    )
    ebs_ids.append(res["VolumeId"])
    
    # 3. 100 GB unattached volume
    res = ec2.create_volume(
        AvailabilityZone="us-east-1a",
        Size=100,
        VolumeType="gp2",
        TagSpecifications=[{
            'ResourceType': 'volume',
            'Tags': [{'Key': 'Name', 'Value': 'unattached-vol-100gb'}]
        }]
    )
    ebs_ids.append(res["VolumeId"])

    print("\n✅ LocalStack resources created!")
    print(f"EC2: {', '.join(ec2_ids)}")
    print(f"EBS: {', '.join(ebs_ids)}")
    print("\nNext: Set USE_LOCALSTACK=true in .env")
    print("      In onboarding: key=test, secret=test, region=us-east-1")
    print("      Connect → Scan → Dashboard")

if __name__ == "__main__":
    run()
