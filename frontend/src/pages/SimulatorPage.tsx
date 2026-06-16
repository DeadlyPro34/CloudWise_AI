import { useState, useEffect } from "react";
import { Calculator, ArrowRight, DollarSign, Activity, HardDrive, Zap, CheckCircle2, TrendingDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { simulateCostImpact } from "../services/wolfram";
import type { SimulatorInput, SimulatorOutput } from "../services/wolfram";
import { getDashboard } from "../services/dashboard";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage } from "../services/apiClient";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function SimulatorPage() {
  const [formData, setFormData] = useState<SimulatorInput>({
    current_monthly_spend: 0,
    instances_to_remove: 0,
    storage_reduction_gb: 0,
    traffic_growth_percent: 0,
  });

  const [result, setResult] = useState<SimulatorOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill current spend from dashboard data if available
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  useEffect(() => {
    if (dashboard?.total_spend) {
      setFormData((prev) => ({
        ...prev,
        current_monthly_spend: dashboard.total_spend,
      }));
    }
  }, [dashboard]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await simulateCostImpact(formData);
      setResult(data);
    } catch (err) {
      setError(getApiErrorMessage(err) || "Failed to calculate simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease] pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/20">
            <Calculator className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cloud Cost Impact Simulator</h1>
            <p className="text-sm font-medium text-text-secondary mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Powered by Wolfram Computational Intelligence
            </p>
          </div>
        </div>
        <p className="text-text-secondary max-w-2xl mt-4">
          Model potential infrastructure changes and immediately see the projected financial impact.
          Enter your planned optimizations below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="card h-full">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
              <Zap className="w-5 h-5 text-accent" />
              Simulation Parameters
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary block">
                  Current Monthly Spend ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type="number"
                    name="current_monthly_spend"
                    value={formData.current_monthly_spend || ""}
                    onChange={handleChange}
                    className="w-full bg-surface-hover border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary block">
                  Instances to Remove
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Activity className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type="number"
                    name="instances_to_remove"
                    value={formData.instances_to_remove || ""}
                    onChange={handleChange}
                    className="w-full bg-surface-hover border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary block">
                  Storage Reduction (GB)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HardDrive className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type="number"
                    name="storage_reduction_gb"
                    value={formData.storage_reduction_gb || ""}
                    onChange={handleChange}
                    className="w-full bg-surface-hover border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary block">
                  Expected Traffic Growth (%)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-text-muted text-sm">%</span>
                  </div>
                  <input
                    type="number"
                    name="traffic_growth_percent"
                    value={formData.traffic_growth_percent || ""}
                    onChange={handleChange}
                    className="w-full bg-surface-hover border border-white/10 rounded-lg py-2.5 px-4 pr-9 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full mt-4 py-3 flex justify-center items-center gap-2 text-base"
              >
                Calculate Impact <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <div className="card h-full animate-[fadeIn_0.5s_ease] border-accent/20 bg-gradient-to-br from-surface to-accent/5 p-[20px_18px] sm:p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Simulation Results
              </h3>
              
              <div className="grid grid-cols-2 gap-[10px] sm:gap-4 mb-8">
                <div className="bg-surface-hover rounded-xl p-[14px_10px] sm:p-5 border border-white/5 min-w-0">
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">Projected Monthly</p>
                  <p className="text-[22px] sm:text-3xl font-bold font-sans tracking-tight whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
                    {formatCurrency(result.projected_monthly)}
                  </p>
                </div>
                <div className="bg-surface-hover rounded-xl p-[14px_10px] sm:p-5 border border-white/5 min-w-0">
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">Projected Annual</p>
                  <p className="text-[22px] sm:text-3xl font-bold font-sans tracking-tight whitespace-nowrap overflow-hidden text-ellipsis tabular-nums">
                    {formatCurrency(result.projected_annual)}
                  </p>
                </div>
              </div>

              <div className="bg-success/10 border border-success/20 rounded-xl p-6 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <p className="text-sm font-medium text-success mb-2 uppercase tracking-wider">Estimated Savings</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-[32px] sm:text-4xl font-black text-success tracking-tight tabular-nums">
                      {formatCurrency(result.monthly_savings)}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-success/70 ml-1">/mo</span>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-success/20"></div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-[32px] sm:text-4xl font-black text-success tracking-tight tabular-nums">
                      {formatCurrency(result.annual_savings)}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-success/70 ml-1">/yr</span>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  {result.cost_reduction_percent}% Reduction
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                {result.wolfram_verification && !result.wolfram_verification.includes("unavailable") && (
                  <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm border border-[#333] shadow-inner overflow-x-auto whitespace-pre-wrap">
                    <p className="caption text-text-muted mb-2">
                      📊 Wolfram Computational Intelligence
                    </p>
                    <p className="text-(--color-success) font-medium">
                      {result.wolfram_verification}
                    </p>
                  </div>
                )}
                
                {result.wolfram_verification && result.wolfram_verification.includes("unavailable") && (
                  <p className="caption text-center mt-2 text-text-muted">
                    Add WOLFRAM_APP_ID to enable computational verification
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/10 bg-transparent">
              <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Awaiting Parameters</h3>
              <p className="text-text-secondary max-w-sm">
                Enter your current spend and expected infrastructure changes to generate a detailed cost impact simulation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
