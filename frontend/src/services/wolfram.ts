import { apiClient } from "./apiClient";

export interface SimulatorInput {
  current_monthly_spend: number;
  instances_to_remove: number;
  storage_reduction_gb: number;
  traffic_growth_percent: number;
}

export interface SimulatorOutput {
  projected_monthly: number;
  projected_annual: number;
  monthly_savings: number;
  annual_savings: number;
  cost_reduction_percent: number;
  wolfram_verification: string;
}

export async function simulateCostImpact(payload: SimulatorInput): Promise<SimulatorOutput> {
  const { data } = await apiClient.post<SimulatorOutput>("/wolfram/simulate", payload);
  return data;
}
