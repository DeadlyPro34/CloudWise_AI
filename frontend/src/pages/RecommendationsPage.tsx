import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Server,
  Shield,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { getRecommendations, getDashboard } from "../services/dashboard";
import { Button } from "../components/ui/Button";
import type { Recommendation } from "../types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function getRiskBadge(risk: string) {
  switch (risk) {
    case "LOW":
      return "badge badge-success";
    case "MEDIUM":
      return "badge badge-warning";
    case "HIGH":
      return "badge badge-danger";
    default:
      return "badge badge-accent";
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "HIGH":
      return "badge badge-danger";
    case "MEDIUM":
      return "badge badge-warning";
    case "LOW":
      return "badge badge-accent";
    default:
      return "badge badge-accent";
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case "HIGH":
      return <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-danger)" }} />;
    case "MEDIUM":
      return <Shield className="w-5 h-5" style={{ color: "var(--color-warning)" }} />;
    default:
      return <Lightbulb className="w-5 h-5" style={{ color: "var(--color-accent-hover)" }} />;
  }
}

function groupByPriority(recs: Recommendation[]) {
  const groups: Record<string, Recommendation[]> = { HIGH: [], MEDIUM: [], LOW: [] };
  recs.forEach((r) => {
    const key = r.priority || "LOW";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return groups;
}

export function RecommendationsPage() {
  const navigate = useNavigate();

  const {
    data: recommendations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
  });

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const isConnected = dashboard?.is_connected;

  // Empty / Error state
  if (isError || (!isLoading && (!recommendations || recommendations.length === 0))) {
    return (
      <div className="animate-[fadeIn_0.5s_ease]">
        <h2 className="mb-1">Recommendations</h2>
        <p className="caption mb-6">AI-powered cost optimization insights</p>
        <div className="card text-center py-16 max-w-lg mx-auto">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
          >
            <Lightbulb className="w-10 h-10" style={{ color: "var(--color-accent-hover)" }} />
          </div>
          <h3 className="mb-2">No recommendations yet.</h3>
          <p className="caption mb-6 max-w-sm mx-auto">
            {isConnected
              ? "Your connected account (or LocalStack) has no resources to optimize yet. Create some resources and rescan."
              : "Connect AWS and run a scan to discover cost-saving opportunities."}
          </p>
          {!isConnected && (
            <Button
              onClick={() => navigate("/onboarding")}
              className="flex items-center justify-center gap-2 mx-auto"
            >
              Connect AWS Account <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <h2 className="mb-1">Recommendations</h2>
        <p className="caption mb-6">AI-powered cost optimization insights</p>
        <div className="card mb-6">
          <div className="skeleton h-16 w-full" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-6 w-64 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalSavings = recommendations!.reduce((sum, r) => sum + r.estimated_monthly_savings, 0);
  const grouped = groupByPriority(recommendations!);
  const priorityOrder: Array<"HIGH" | "MEDIUM" | "LOW"> = ["HIGH", "MEDIUM", "LOW"];

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <h2 className="mb-1">Recommendations</h2>
      <p className="caption mb-6">AI-powered cost optimization insights</p>

      {/* Summary Bar */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
            >
              <TrendingDown className="w-7 h-7" style={{ color: "var(--color-success)" }} />
            </div>
            <div>
              <p className="caption text-sm">Total Potential Savings</p>
              <p className="text-3xl font-bold" style={{ color: "var(--color-success)" }}>
                {formatCurrency(totalSavings)}
                <span className="text-sm font-normal" style={{ color: "var(--color-text-secondary)" }}>
                  {" "}/month
                </span>
              </p>
            </div>
          </div>
          <span className="badge badge-accent">
            {recommendations!.length} recommendation{recommendations!.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grouped Recommendations */}
      {priorityOrder.map((priority) => {
        const group = grouped[priority];
        if (!group || group.length === 0) return null;

        return (
          <div key={priority} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {getPriorityIcon(priority)}
              <h4>{priority} Priority</h4>
              <span className={getPriorityBadge(priority)}>{group.length}</span>
            </div>

            <div className="space-y-4">
              {group.map((rec) => (
                <div
                  key={rec.id}
                  className="card transition-all duration-300 hover:scale-[1.01]"
                  style={{ borderColor: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-surface)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg mb-1">{rec.title}</h4>
                      <p
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {rec.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div
                          className="flex items-center gap-1.5 text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          <Server className="w-3.5 h-3.5" />
                          {rec.resource_name}
                        </div>
                        <span className="badge badge-success">
                          Save {formatCurrency(rec.estimated_monthly_savings)}/mo
                        </span>
                        <span className={getRiskBadge(rec.risk_level)}>
                          {rec.risk_level} Risk
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {Math.round(rec.confidence_score * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3" style={{ borderTop: "1px solid var(--color-surface)" }}>
                    <button
                      className="btn-primary flex items-center gap-1.5 text-sm"
                      style={{ padding: "6px 14px", fontSize: "13px" }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Acknowledge
                    </button>
                    <button
                      className="btn-secondary flex items-center gap-1.5 text-sm"
                      style={{ padding: "6px 14px", fontSize: "13px" }}
                    >
                      <X className="w-3.5 h-3.5" />
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
