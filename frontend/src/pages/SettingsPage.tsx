import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Key, User, Cloud, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { Button } from "../components/ui/Button";
import { apiClient, getApiErrorMessage } from "../services/apiClient";

export function SettingsPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  
  // AWS Connection State
  const [awsConnected, setAwsConnected] = useState(false);
  const [awsAccountId, setAwsAccountId] = useState<string | null>(null);
  const [isLocalStack, setIsLocalStack] = useState(false);

  // Fetch current key status on mount
  useEffect(() => {
    apiClient
      .get("/settings/api-key-status")
      .then((res) => {
        setIsConfigured(res.data.is_configured);
        setMaskedKey(res.data.masked_key);
      })
      .catch(() => {
        // Not critical — just means we can't check status
      });

    // Fetch AWS connection status
    apiClient
      .get("/aws/resources")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAwsConnected(true);
          setAwsAccountId(res.data[0].account_id);
          // Just infer LocalStack if account_id is 000000000000
          setIsLocalStack(res.data[0].account_id === "000000000000");
        } else {
          setAwsConnected(false);
          setIsLocalStack(false);
        }
      })
      .catch(() => {
        setAwsConnected(false);
      });
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setFeedback(null);
    try {
      await apiClient.put("/settings/api-key", { groq_api_key: apiKey.trim() });
      setFeedback({ type: "success", msg: "Groq API key saved successfully! Copilot is now active." });
      setIsConfigured(true);
      setMaskedKey(apiKey.slice(0, 4) + "••••" + apiKey.slice(-4));
      setApiKey("");
    } catch (err) {
      setFeedback({ type: "error", msg: getApiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setFeedback(null);
    try {
      await apiClient.delete("/aws/disconnect");
      setAwsConnected(false);
      setAwsAccountId(null);
      setFeedback({ type: "success", msg: "AWS account disconnected successfully." });
    } catch (err) {
      setFeedback({ type: "error", msg: getApiErrorMessage(err) || "Failed to disconnect AWS account." });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-8 h-8 text-(--color-accent)" />
        <h2 className="mb-0">Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--color-surface)]">
            <User className="w-5 h-5 text-(--color-accent)" />
            <h4>Profile</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-(--color-text-secondary) mb-1">Email</label>
              <div className="p-2 bg-(--color-surface) rounded-md text-sm">{user?.email || "user@example.com"}</div>
            </div>
            <div>
              <label className="block text-sm text-(--color-text-secondary) mb-1">Name</label>
              <div className="p-2 bg-(--color-surface) rounded-md text-sm">{user?.first_name} {user?.last_name}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--color-surface)]">
            <Cloud className="w-5 h-5 text-(--color-accent)" />
            <h4>AWS Connection</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-(--color-text-secondary) mb-1">Status</label>
              <div className="flex items-center gap-2">
                {awsConnected ? (
                  <>
                    <span className="badge badge-success">Connected</span>
                    {awsAccountId && <span className="text-sm">Account ID: {awsAccountId}</span>}
                    {isLocalStack && <span className="badge bg-indigo-500 text-white ml-2">LocalStack</span>}
                  </>
                ) : (
                  <>
                    <span className="badge bg-gray-500 text-white">Not Connected</span>
                    <Link to="/onboarding" className="text-sm text-(--color-accent) hover:underline ml-2">
                      Connect Account
                    </Link>
                  </>
                )}
              </div>
            </div>
            {awsConnected && (
              <Button variant="secondary" className="w-full" onClick={handleDisconnect} disabled={disconnecting}>
                {disconnecting ? "Disconnecting..." : "Disconnect AWS Account"}
              </Button>
            )}
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--color-surface)]">
            <Key className="w-5 h-5 text-(--color-accent)" />
            <h4>API Configuration</h4>
          </div>

          {/* Status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            {isConfigured ? (
              <>
                <Check className="w-4 h-4 text-green-400 shrink-0" style={{ marginTop: 2 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span className="text-sm text-green-400">Groq API key is configured</span>
                  {maskedKey && (
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary)",
                        marginTop: "0.2rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6,
                        padding: "0.25rem 0.5rem",
                      }}
                      title={maskedKey}
                    >
                      {maskedKey}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" style={{ marginTop: 2 }} />
                <span className="text-sm text-yellow-400" style={{ minWidth: 0 }}>No Groq API key set — Copilot won't work until configured</span>
              </>
            )}
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm text-(--color-text-secondary) mb-1">
                {isConfigured ? "Update Groq API Key" : "Enter Groq API Key"}
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  alignItems: "stretch",
                }}
              >
                <div style={{ position: "relative", flex: "1 1 180px", minWidth: 0 }}>
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="gsk_..."
                    className="input-field w-full pr-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                    style={{ minWidth: 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button onClick={handleSave} disabled={saving || !apiKey.trim()} style={{ flexShrink: 0 }}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
              <p className="text-xs text-(--color-text-secondary) mt-2">
                Get a free API key at{" "}
                <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-(--color-accent) hover:underline">
                  console.groq.com
                </a>
              </p>
            </div>

            {feedback && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  feedback.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {feedback.type === "success" ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                {feedback.msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
