import { FileText, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { generateReport } from "../services/reports";
import { getApiErrorMessage } from "../services/apiClient";

export function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const blob = await generateReport();

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cloudwise-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-8 h-8 text-(--color-accent)" />
        <h2 className="mb-0">Reports</h2>
      </div>

      <div className="card max-w-2xl">
        <h4 className="mb-2">Executive Summary Report</h4>
        <p className="caption mb-6">
          Generate a comprehensive PDF report containing your cloud health
          score, cost trends, top recommendations, and AI-generated insights.
          Perfect for sharing with stakeholders.
        </p>

        <Button
          onClick={handleGenerate}
          isLoading={loading}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate & Download PDF
        </Button>

        {/* Success message */}
        {success && (
          <div
            className="flex items-center gap-2 mt-4 p-3 rounded-lg animate-[fadeIn_0.3s_ease]"
            style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
          >
            <CheckCircle
              className="w-5 h-5"
              style={{ color: "var(--color-success)" }}
            />
            <span className="text-sm" style={{ color: "var(--color-success)" }}>
              Report downloaded successfully!
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="flex items-center gap-2 mt-4 p-3 rounded-lg animate-[fadeIn_0.3s_ease]"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          >
            <AlertCircle
              className="w-5 h-5"
              style={{ color: "var(--color-danger)" }}
            />
            <span className="text-sm" style={{ color: "var(--color-danger)" }}>
              {error}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
