import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Server, Search, CloudOff, ArrowRight } from "lucide-react";
import { getResources } from "../services/aws";
import { getDashboard } from "../services/dashboard";
import { Button } from "../components/ui/Button";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "running" || s === "available" || s === "in-use")
    return "badge badge-success";
  if (s === "stopped" || s === "stopping") return "badge badge-warning";
  if (s === "terminated" || s === "error") return "badge badge-danger";
  return "badge badge-accent";
}

function getTypeBadge(type: string) {
  const t = type.toUpperCase();
  if (t.includes("EC2")) return "badge badge-accent";
  if (t.includes("EBS")) return "badge badge-warning";
  return "badge badge-accent";
}

export function ResourcesPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: resources,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const isConnected = dashboard?.is_connected;

  const filtered = useMemo(() => {
    if (!resources) return [];
    return resources.filter((r) => {
      const matchType =
        typeFilter === "all" ||
        r.resource_type.toUpperCase().includes(typeFilter.toUpperCase());
      const matchStatus =
        statusFilter === "all" ||
        r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        !searchTerm ||
        r.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.resource_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [resources, typeFilter, statusFilter, searchTerm]);

  // Empty / Error state
  if (isError || (!isLoading && (!resources || resources.length === 0))) {
    return (
      <div className="animate-[fadeIn_0.5s_ease]">
        <h2 className="mb-1">Resources</h2>
        <p className="caption mb-6">Manage your AWS resources</p>
        <div className="card text-center py-16 max-w-lg mx-auto">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
          >
            <CloudOff className="w-10 h-10" style={{ color: "var(--color-accent-hover)" }} />
          </div>
          <h3 className="mb-2">No Resources Found</h3>
          <p className="caption mb-6 max-w-sm mx-auto">
            {isConnected
              ? "Your connected account (or LocalStack) doesn't have any EC2 or EBS resources yet. Create some resources and rescan."
              : "No resources found. Connect your AWS account and run a scan to discover your infrastructure."}
          </p>
          {!isConnected && (
            <Button
              onClick={() => navigate("/onboarding")}
              className="flex items-center justify-center gap-2 mx-auto"
            >
              Go to Onboarding <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <h2>Resources</h2>
        {resources && (
          <span className="badge badge-accent">{resources.length} total</span>
        )}
      </div>
      <p className="caption mb-6">Manage your AWS resources</p>

      {/* Filter Bar */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Type
            </label>
            <select
              className="input-field cursor-pointer text-sm"
              style={{ width: "160px", padding: "8px 12px" }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="EC2">EC2</option>
              <option value="EBS">EBS</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Status
            </label>
            <select
              className="input-field cursor-pointer text-sm"
              style={{ width: "160px", padding: "8px 12px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
              <option value="available">Available</option>
              <option value="in-use">In-use</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <label className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
              Search
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-text-secondary)" }}
              />
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="input-field text-sm pl-9"
                style={{ padding: "8px 12px 8px 36px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden" style={{ padding: 0 }}>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton h-5 flex-1" />
                <div className="skeleton h-5 w-20" />
                <div className="skeleton h-5 w-24" />
                <div className="skeleton h-5 w-20" />
                <div className="skeleton h-5 w-24" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--color-text-secondary)" }} />
            <p className="caption">No resources match your filters</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-surface)" }}>
                {["Name", "Type", "Region", "Status", "Monthly Cost"].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((resource) => (
                <tr
                  key={resource.id}
                  className="transition-colors duration-150"
                  style={{ borderBottom: "1px solid var(--color-surface)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(31, 41, 55, 0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Server className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-text-secondary)" }} />
                      <div>
                        <p className="font-medium text-sm">{resource.resource_name}</p>
                        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {resource.resource_id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getTypeBadge(resource.resource_type)}>
                      {resource.resource_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {resource.region}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(resource.status)}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatCurrency(resource.monthly_cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
