import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../services/apiClient";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#050508", overflow: "hidden", position: "relative" }}>

      {/* ── Left panel (hidden on mobile via CSS class) ── */}
      <div
        className="auth-left-panel"
        style={{
          width: "45%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0820 0%, #100d2e 50%, #0a0820 100%)" }} />
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,82,240,0.35) 0%,transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", boxShadow: "0 4px 20px rgba(91,82,240,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#EEF2FF", fontFamily: "var(--font-sans)" }}>CloudWise AI</span>
        </div>

        {/* Testimonial */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "2rem", backdropFilter: "blur(16px)", marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
              {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FBBF24", fontSize: "1.1rem" }}>★</span>)}
            </div>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#C7D2FE", fontStyle: "italic", marginBottom: "1.5rem", fontFamily: "var(--font-serif)" }}>
              "CloudWise identified $47,000 in unused AWS resources in the first week. The AI recommendations were actionable and dead accurate."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#5B52F0,#34D399)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>AK</div>
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#EEF2FF", margin: 0 }}>Arjun Kapoor</p>
                <p style={{ fontSize: "0.8rem", color: "#8B93B5", margin: 0 }}>Head of Infra, TechFlow Inc.</p>
              </div>
            </div>
          </div>

          {/* Feature bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["Real-time AWS cost monitoring", "AI-powered savings recommendations", "90-day spend forecasting"].map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#34D399", fontSize: "0.7rem" }}>✓</span>
                </div>
                <span style={{ fontSize: "0.9rem", color: "#8B93B5" }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "#4B5680" }}>© 2026 CloudWise AI · All rights reserved</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div
        className="auth-right-panel"
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
        {/* Glow behind form */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,82,240,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

          {/* Mobile logo (only visible when left panel is hidden) */}
          <div
            className="show-mobile"
            style={{ display: "none", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", boxShadow: "0 4px 16px rgba(91,82,240,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#EEF2FF" }}>CloudWise AI</span>
          </div>

          {/* Back link + heading */}
          <div style={{ marginBottom: "2.25rem" }}>
            <Link
              to="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "1.5rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EEF2FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", marginBottom: "0.5rem", color: "#EEF2FF" }}>Sign in</h2>
            <p className="caption">Welcome back — let's check on your cloud costs.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
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
                  autoComplete="email"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "#7B75FF", fontWeight: 500, textDecoration: "none" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock className="w-4 h-4" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#4B5680", pointerEvents: "none" }} />
                <input
                  type={showPass ? "text" : "password"}
                  className="input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in"
                style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.85rem 1rem", borderRadius: 12, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#F87171", fontSize: "0.875rem" }}
              >
                <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg" style={{ marginTop: "0.25rem" }}>
              {!isSubmitting && <><span>Sign In</span><ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.75rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "0.8rem", color: "#4B5680" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#8B93B5" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#7B75FF", fontWeight: 600, textDecoration: "none" }}>Create one free</Link>
          </p>

          {/* Trust badges on mobile */}
          <div
            className="show-mobile"
            style={{ display: "none", flexDirection: "column", gap: "0.5rem", marginTop: "2rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {["Real-time AWS cost monitoring", "SOC 2 Type II certified", "2-minute setup"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle size={14} color="#34D399" />
                <span style={{ fontSize: "0.8rem", color: "#8B93B5" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
