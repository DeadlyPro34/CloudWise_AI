import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  PiggyBank,
  Activity,
  Server,
  TrendingDown,
  CloudOff,
  ArrowRight,
} from "lucide-react";
import { getDashboard, getRecommendations } from "../services/dashboard";
import { scanAWS } from "../services/aws";
import { getApiErrorMessage } from "../services/apiClient";
import { Button } from "../components/ui/Button";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function getHealthColor(score: number): string {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const {
    data: dashboard,
    isLoading: dashLoading,
    isError: dashError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
  });

  // Empty state — no AWS account connected (either error or is_connected false)
  const noAccountConnected =
    dashError ||
    (!dashLoading && dashboard && dashboard.is_connected === false);

  const handleRescan = async () => {
    setScanning(true);
    setScanError(null);
    try {
      await scanAWS();
      queryClient.invalidateQueries();
    } catch (err) {
      setScanError(getApiErrorMessage(err) || "Failed to rescan AWS account.");
    } finally {
      setScanning(false);
    }
  };

  if (noAccountConnected) {
    return (
      <div className="animate-[fadeIn_0.5s_ease]">
        <h2 className="mb-1">Dashboard</h2>
        <p className="caption mb-6">Your cloud cost command center</p>
        <div className="card text-center py-16 max-w-lg mx-auto">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
          >
            <CloudOff className="w-10 h-10" style={{ color: "var(--color-accent-hover)" }} />
          </div>
          <h3 className="mb-2">Connect your AWS account to get started</h3>
          <p className="caption mb-6 max-w-sm mx-auto">
            CloudWise AI will scan your infrastructure, detect waste, and generate optimization recommendations.
          </p>
          <Button
            onClick={() => navigate("/onboarding")}
            className="flex items-center justify-center gap-2 mx-auto"
          >
            Connect AWS Account <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  const topRecs = recommendations?.slice(0, 3) ?? [];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="caption">Your cloud cost command center</p>
        </div>
        {!noAccountConnected && (
          <div className="flex flex-col items-end">
            <Button onClick={handleRescan} disabled={scanning || dashLoading}>
              {scanning ? "Scanning..." : "Rescan Data"}
            </Button>
            {scanError && <span className="text-red-400 text-xs mt-1">{scanError}</span>}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="kpi-card">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-32" />
            </div>
          ))
        ) : (
          <>
            <div
              className="kpi-card group cursor-default transition-all duration-300 hover:scale-[1.02]"
              style={{ borderColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div className="flex items-center justify-between">
                <p className="caption">Current Spend</p>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
                >
                  <DollarSign className="w-5 h-5" style={{ color: "var(--color-accent-hover)" }} />
                </div>
              </div>
              <h3>{formatCurrency(dashboard?.total_spend ?? 0)}</h3>
            </div>

            <div
              className="kpi-card transition-all duration-300 hover:scale-[1.02]"
              style={{ borderColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-success)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div className="flex items-center justify-between">
                <p className="caption">Potential Savings</p>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
                >
                  <PiggyBank className="w-5 h-5" style={{ color: "var(--color-success)" }} />
                </div>
              </div>
              <h3 style={{ color: "var(--color-success)" }}>
                {formatCurrency(dashboard?.potential_savings ?? 0)}
              </h3>
            </div>

            <div
              className="kpi-card transition-all duration-300 hover:scale-[1.02]"
              style={{ borderColor: "transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = getHealthColor(dashboard?.health_score ?? 0))
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div className="flex items-center justify-between">
                <p className="caption">Health Score</p>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}
                >
                  <Activity className="w-5 h-5" style={{ color: "var(--color-warning)" }} />
                </div>
              </div>
              <h3>
                <span style={{ color: getHealthColor(dashboard?.health_score ?? 0) }}>
                  {dashboard?.health_score ?? 0}
                </span>
                <span className="text-base font-normal" style={{ color: "var(--color-text-secondary)" }}>
                  /100
                </span>
              </h3>
            </div>

            <div
              className="kpi-card transition-all duration-300 hover:scale-[1.02]"
              style={{ borderColor: "transparent" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              <div className="flex items-center justify-between">
                <p className="caption">Total Resources</p>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
                >
                  <Server className="w-5 h-5" style={{ color: "var(--color-accent-hover)" }} />
                </div>
              </div>
              <h3>{dashboard?.resource_count ?? 0}</h3>
            </div>
          </>
        )}
      </div>

      {/* Cost Trend Chart */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4>Cost Trend</h4>
          <span className="badge badge-accent">Last 30 days</span>
        </div>
        {dashLoading ? (
          <div className="skeleton h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dashboard?.cost_trend ?? []}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#1F2937" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#1F2937" }}
                tickLine={false}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #1F2937",
                  borderRadius: 12,
                  color: "#F9FAFB",
                }}
                labelStyle={{ color: "#9CA3AF" }}
                formatter={(value) => [formatCurrency(Number(value)), "Cost"]}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#costGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Recommendations */}
      {topRecs.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" style={{ color: "var(--color-success)" }} />
              <h4>Top Recommendations</h4>
            </div>
            <button
              onClick={() => navigate("/recommendations")}
              className="text-sm font-medium flex items-center gap-1 transition-colors duration-200"
              style={{ color: "var(--color-accent-hover)" }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {topRecs.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-[1.01]"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div className="flex-1">
                  <p className="font-medium mb-1">{rec.title}</p>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {rec.resource_name}
                  </p>
                </div>
                <span className="badge badge-success">
                  {formatCurrency(rec.estimated_monthly_savings)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
