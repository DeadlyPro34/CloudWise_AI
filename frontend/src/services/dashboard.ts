/**
 * Dashboard API service - calls backend /api/v1/dashboard, /health-score, /recommendations.
 */

import { apiClient } from "./apiClient";
import type { DashboardSummary, HealthScore, Recommendation } from "../types";

export async function getDashboard(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard");
  return data;
}

export async function getHealthScore(): Promise<HealthScore> {
  const { data } = await apiClient.get<HealthScore>("/health-score");
  return data;
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const { data } = await apiClient.get<Recommendation[]>("/recommendations");
  return data;
}

export async function updateRecommendationStatus(id: string, status: "ACKNOWLEDGED" | "DISMISSED"): Promise<any> {
  const { data } = await apiClient.patch(`/recommendations/${id}/status`, { status });
  return data;
}
