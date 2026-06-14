import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#050508",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ width: "45%", flexShrink: 0 }}
      >
        {/* Deep indigo gradient wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0a0820 0%, #100d2e 50%, #0a0820 100%)",
          }}
        />
        {/* Glowing orb */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(91,82,240,0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        {/* Grid lines overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #5B52F0, #7B75FF)",
              boxShadow: "0 4px 20px rgba(91,82,240,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#EEF2FF", fontFamily: "var(--font-sans)" }}>
            CloudWise AI
          </span>
        </div>

        {/* Center testimonial */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "2rem",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: "#FBBF24", fontSize: "1.1rem" }}>★</span>
              ))}
            </div>
            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.7,
                color: "#C7D2FE",
                fontStyle: "italic",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-serif)",
              }}
            >
              "CloudWise identified $47,000 in unused AWS resources in the first week.
              The AI recommendations were actionable and dead accurate."
            </p>
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #5B52F0, #34D399)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                AK
              </div>
              <div>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#EEF2FF" }}>Arjun Kapoor</p>
                <p style={{ fontSize: "0.8rem", color: "#8B93B5" }}>Head of Infra, TechFlow Inc.</p>
              </div>
            </div>
          </div>

          {/* Feature bullets */}
          <div className="mt-8 flex flex-col gap-3">
            {[
              "Real-time AWS cost monitoring",
              "AI-powered savings recommendations",
              "90-day spend forecasting",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(52,211,153,0.15)",
                    border: "1px solid rgba(52,211,153,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#34D399", fontSize: "0.7rem" }}>✓</span>
                </div>
                <span style={{ fontSize: "0.9rem", color: "#8B93B5" }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "#4B5680" }}>
          © 2025 CloudWise AI · All rights reserved
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Subtle radial glow behind form */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(91,82,240,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="animate-scale-in"
          style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #5B52F0, #7B75FF)",
                boxShadow: "0 4px 16px rgba(91,82,240,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#EEF2FF" }}>CloudWise AI</span>
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Sign in</h2>
            <p className="caption">Welcome back — let's check on your cloud costs.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#4B5680" }}
                />
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

            {/* Password field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: "0.82rem", color: "#7B75FF", fontWeight: 500 }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#4B5680" }}
                />
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
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4B5680",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                  padding: "0.85rem 1rem",
                  borderRadius: 12,
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#F87171",
                  fontSize: "0.875rem",
                }}
              >
                <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
              style={{ marginTop: "0.25rem" }}
            >
              {!isSubmitting && (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
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
            <Link
              to="/signup"
              style={{ color: "#7B75FF", fontWeight: 600, textDecoration: "none" }}
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
