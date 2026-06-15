import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, ArrowRight, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../services/apiClient";
import { resetPassword } from "../../services/authService";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#050508", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,82,240,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "2.25rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", boxShadow: "0 4px 20px rgba(91,82,240,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", marginBottom: "0.5rem", color: "#EEF2FF" }}>Set New Password</h2>
            <p className="caption">Enter your reset token and choose a new password.</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>Reset Token</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Paste your reset token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <Lock className="w-4 h-4" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#4B5680", pointerEvents: "none" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-field"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#4B5680", padding: 0, display: "flex" }}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <Lock className="w-4 h-4" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#4B5680", pointerEvents: "none" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-field"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
                  />
                </div>
              </div>

              {error && (
                <div
                  className="animate-fade-in"
                  style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.85rem 1rem", borderRadius: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171", fontSize: "0.875rem" }}
                >
                  <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg" style={{ marginTop: "0.25rem" }}>
                {!isSubmitting && <><span>Reset Password</span><ArrowRight className="w-4 h-4 ml-1" /></>}
              </Button>
            </form>
          ) : (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1.5rem", borderRadius: 12, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontWeight: 600 }}>✅ Password reset successfully!</h3>
                <p style={{ fontSize: "0.9rem", color: "#A7F3D0" }}>Redirecting to login...</p>
              </div>
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", color: "#8B93B5", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EEF2FF")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#8B93B5")}>
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
