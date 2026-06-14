/**
 * Shared TypeScript types.
 * Mirrors backend Pydantic schemas (app/schemas/*.py) to keep
 * frontend/backend contracts in sync.
 */

// ------------------------------------------------------------
// Auth (app/schemas/auth.py)
// ------------------------------------------------------------
export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ------------------------------------------------------------
// API Error shape (FastAPI HTTPException / Pydantic validation)
// ------------------------------------------------------------
export interface ApiErrorDetail {
  detail: string | { msg: string; loc: string[] }[];
}

// ------------------------------------------------------------
// AWS (app/schemas/aws.py)
// ------------------------------------------------------------
export interface AWSConnectPayload {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  region: string;
  use_localstack?: boolean;
}

export interface AWSConnectResponse {
  account_id: string;
  account_name: string;
  status: string;
  environment: "aws" | "localstack";
}

export interface AWSScanResponse {
  ec2_count: number;
  ebs_count: number;
  total_resources: number;
  status: string;
}

// ------------------------------------------------------------
// Resources (app/schemas/resource.py)
// ------------------------------------------------------------
export interface Resource {
  id: string;
  resource_id: string;
  resource_name: string;
  resource_type: string;
  region: string;
  status: string;
  tags: Record<string, string> | null;
  metadata_json: Record<string, unknown> | null;
  monthly_cost: number;
}

// ------------------------------------------------------------
// Dashboard (app/schemas/dashboard.py)
// ------------------------------------------------------------
export interface CostTrendPoint {
  date: string;
  cost: number;
}

export interface DashboardSummary {
  total_spend: number;
  potential_savings: number;
  health_score: number;
  resource_count: number;
  cost_trend: CostTrendPoint[];
}

// ------------------------------------------------------------
// Recommendations (app/schemas/recommendation.py)
// ------------------------------------------------------------
export interface Recommendation {
  id: string;
  resource_id: string;
  resource_name: string;
  recommendation_type: string;
  title: string;
  description: string;
  estimated_monthly_savings: number;
  confidence_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: string;
}

// ------------------------------------------------------------
// Health Score (app/schemas/health.py)
// ------------------------------------------------------------
export interface HealthScore {
  score: number;
  resource_efficiency: number;
  cost_efficiency: number;
  storage_efficiency: number;
  forecast_risk: number;
}

// ------------------------------------------------------------
// Copilot (app/schemas/copilot.py)
// ------------------------------------------------------------
export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface CopilotChatPayload {
  message: string;
}

export interface CopilotChatResponse {
  response: string;
  conversation_id: string;
}

// ------------------------------------------------------------
// Forecast (app/schemas/forecast.py)
// ------------------------------------------------------------
export interface ForecastData {
  forecast_type: string;
  current_cost: number;
  predicted_cost: number;
  confidence_interval_low: number;
  confidence_interval_high: number;
}
