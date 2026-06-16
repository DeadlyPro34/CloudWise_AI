import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft, Shield, Zap as ZapIcon, TrendingUp } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../services/apiClient";

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
  icon: React.ElementType;
  rightSlot?: React.ReactNode;
}

function Field({ id, label, type = "text", placeholder, value, onChange, required, autoComplete, icon: Icon, rightSlot }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label htmlFor={id} style={{ fontSize: "0.82rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon className="w-4 h-4" style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#4B5680", pointerEvents: "none" }} />
        <input
          id={id}
          type={type}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete={autoComplete}
          style={{ paddingLeft: "2.5rem", paddingRight: rightSlot ? "2.75rem" : undefined }}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

const PERKS = [
  { icon: ZapIcon, title: "Setup in 2 minutes", desc: "Connect your AWS account with a read-only IAM role. No code changes." },
  { icon: TrendingUp, title: "Instant cost insights", desc: "Your first dashboard populates within minutes of connecting." },
  { icon: Shield, title: "SOC 2 Type II secure", desc: "We never write to your AWS account. Your data stays yours." },
];

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName,       setFirstName]      = useState("");
  const [lastName,        setLastName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8)          { setError("Password must be at least 8 characters."); return; }
    setIsSubmitting(true);
    try {
      await register({ email, password, first_name: firstName || undefined, last_name: lastName || undefined });
      navigate("/onboarding");
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
          width: "42%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #060412 0%, #0d0a28 50%, #060412 100%)" }} />
        <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,82,240,0.3) 0%,transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", boxShadow: "0 4px 20px rgba(91,82,240,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#EEF2FF", fontFamily: "var(--font-sans)" }}>CloudWise AI</span>
        </div>

        {/* Perks */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#EEF2FF", marginBottom: "0.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Start saving in minutes
          </h2>
          <p style={{ color: "#8B93B5", lineHeight: 1.65, marginBottom: "2.5rem", fontSize: "0.95rem" }}>
            Join engineering teams who've reduced their AWS bills by an average of 48%.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(91,82,240,0.15)", border: "1px solid rgba(91,82,240,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="#7B75FF" />
                </div>
                <div>
                  <p style={{ color: "#EEF2FF", fontWeight: 600, margin: "0 0 0.2rem", fontSize: "0.9rem" }}>{title}</p>
                  <p style={{ color: "#8B93B5", fontSize: "0.825rem", margin: 0, lineHeight: 1.55 }}>{desc}</p>
                </div>
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
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,82,240,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

          {/* Mobile logo */}
          <div
            className="show-mobile"
            style={{ display: "none", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", boxShadow: "0 4px 16px rgba(91,82,240,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#EEF2FF" }}>CloudWise AI</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              to="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "1.25rem", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EEF2FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)")}
            >
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2rem)", marginBottom: "0.4rem", color: "#EEF2FF" }}>Create your account</h2>
            <p className="caption">Free forever · No credit card required</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <Field id="firstName" label="First name" placeholder="Jane" value={firstName} onChange={setFirstName} autoComplete="given-name" icon={User} />
              <Field id="lastName"  label="Last name"  placeholder="Smith" value={lastName}  onChange={setLastName}  autoComplete="family-name" icon={User} />
            </div>

            <Field
              id="email" label="Email address" type="email"
              placeholder="you@company.com" value={email} onChange={setEmail}
              required autoComplete="email" icon={Mail}
            />

            <Field
              id="password" label="Password" type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters" value={password} onChange={setPassword}
              required autoComplete="new-password" icon={Lock}
              rightSlot={
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4B5680", padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Field
              id="confirmPassword" label="Confirm password" type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password" value={confirmPassword} onChange={setConfirmPassword}
              required autoComplete="new-password" icon={Lock}
              rightSlot={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4B5680", padding: 0, display: "flex" }}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

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

            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg" style={{ marginTop: "0.25rem" }}>
              {!isSubmitting && <><span>Create Account</span><ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>

            <p style={{ fontSize: "0.75rem", color: "#4B5680", textAlign: "center", lineHeight: 1.5, margin: "0.25rem 0" }}>
              By creating an account you agree to our{" "}
              <Link to="/terms" style={{ color: "#7B75FF", textDecoration: "none" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy" style={{ color: "#7B75FF", textDecoration: "none" }}>Privacy Policy</Link>.
            </p>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "0.8rem", color: "#4B5680" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#8B93B5" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#7B75FF", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
