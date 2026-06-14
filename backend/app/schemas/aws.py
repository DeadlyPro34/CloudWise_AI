"""
Pydantic schemas for AWS and dashboard endpoints.
"""

from pydantic import BaseModel, ConfigDict


# ------------------------------------------------------------
# AWS Connection
# ------------------------------------------------------------
class AWSConnectRequest(BaseModel):
    aws_access_key_id: str
    aws_secret_access_key: str
    region: str = "us-east-1"
    use_localstack: bool = False


class AWSConnectResponse(BaseModel):
    account_id: str
    account_name: str | None = None
    status: str
    environment: str = "aws"


class AWSScanResponse(BaseModel):
    ec2_count: int
    ebs_count: int
    total_resources: int
    status: str


# ------------------------------------------------------------
# Resources
# ------------------------------------------------------------
class ResourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    resource_id: str
    resource_name: str | None = None
    resource_type: str
    region: str
    status: str
    tags: dict | None = None
    metadata_json: dict | None = None
    monthly_cost: float | None = None


# ------------------------------------------------------------
# Dashboard
# ------------------------------------------------------------
class DashboardSummary(BaseModel):
    total_spend: float
    potential_savings: float
    health_score: float
    resource_count: int
    cost_trend: list[dict]


# ------------------------------------------------------------
# Recommendations
# ------------------------------------------------------------
class RecommendationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    resource_id: str
    resource_name: str | None = None
    recommendation_type: str
    title: str
    description: str
    estimated_monthly_savings: float
    confidence_score: float
    risk_level: str
    priority: str
    status: str


# ------------------------------------------------------------
# Health Score
# ------------------------------------------------------------
class HealthScoreOut(BaseModel):
    score: float
    resource_efficiency: float
    cost_efficiency: float
    storage_efficiency: float
    forecast_risk: float


# ------------------------------------------------------------
# Copilot
# ------------------------------------------------------------
class CopilotChatRequest(BaseModel):
    message: str


class CopilotChatResponse(BaseModel):
    response: str
    conversation_id: str


# ------------------------------------------------------------
# Forecast
# ------------------------------------------------------------
class ForecastOut(BaseModel):
    forecast_type: str
    current_cost: float
    predicted_cost: float
    confidence_interval_low: float
    confidence_interval_high: float
