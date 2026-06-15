import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../services/apiClient";
import { forgotPassword } from "../../services/authService";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    message: string;
    reset_token?: string;
    note?: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await forgotPassword(email);
      setSuccessData(data);
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
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", marginBottom: "0.5rem", color: "#EEF2FF" }}>Reset Password</h2>
            <p className="caption">Enter your email and we'll generate a reset token.</p>
          </div>

          {!successData ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>Email address</label>
                <div style={{ position: "relative" }}>
                  <Mail className="w-4 h-4" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#4B5680", pointerEvents: "none" }} />
                  <input
                    type="email"
                    className="input-field"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: "2.5rem" }}
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
                {!isSubmitting && <><span>Send Reset Token</span><ArrowRight className="w-4 h-4 ml-1" /></>}
              </Button>
            </form>
          ) : (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "1.5rem", borderRadius: 12, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 600 }}>✅ Reset token generated!</h3>
                <p style={{ fontSize: "0.9rem", color: "#A7F3D0", marginBottom: "1rem" }}>Your reset token:</p>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: 8, fontFamily: "monospace", wordBreak: "break-all", fontSize: "0.9rem" }}>
                  {successData.reset_token}
                </div>
                {successData.note && (
                  <p style={{ fontSize: "0.8rem", color: "#6EE7B7", marginTop: "1rem", fontStyle: "italic" }}>Note: {successData.note}</p>
                )}
              </div>
              
              <Link to={`/reset-password?token=${successData.reset_token}`} style={{ textDecoration: "none" }}>
                <Button className="w-full" size="lg">
                  Reset my password <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
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
