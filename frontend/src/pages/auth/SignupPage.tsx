import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { Button } from "../../components/ui/Button";
import { getApiErrorMessage } from "../../services/apiClient";

/* ── Field lives OUTSIDE the page component so React never remounts it ── */
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

function Field({
  id, label, type = "text", placeholder, value, onChange,
  required, autoComplete, icon: Icon, rightSlot,
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label htmlFor={id} style={{ fontSize: "0.85rem", fontWeight: 600, color: "#8B93B5", letterSpacing: "0.03em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4B5680" }} />
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

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName,       setFirstName]       = useState("");
  const [lastName,        setLastName]         = useState("");
  const [email,           setEmail]            = useState("");
  const [password,        setPassword]         = useState("");
  const [confirmPassword, setConfirmPassword]  = useState("");
  const [showPass,        setShowPass]         = useState(false);
  const [showConfirm,     setShowConfirm]      = useState(false);
  const [error,           setError]            = useState<string | null>(null);
  const [isSubmitting,    setIsSubmitting]     = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Passwords do not match.");             return; }
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

  const eyeBtn = (visible: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#4B5680", padding: 0, display: "flex" }}
    >
      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  const strength = Math.min(Math.floor(password.length / 3), 4);
  const strengthLabel = password.length < 8 ? "Too short" : password.length < 12 ? "Moderate" : password.length < 16 ? "Strong" : "Very strong";
  const strengthColors = ["#F87171", "#FBBF24", "#60A5FA", "#34D399"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#050508", overflow: "hidden", position: "relative" }}>

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ width: "42%", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0a0820 0%, #0f0b2b 50%, #0a0820 100%)" }} />
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,82,240,0.3) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "48px 48px", pointerEvents: "none",
        }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #5B52F0, #7B75FF)", boxShadow: "0 4px 20px rgba(91,82,240,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#EEF2FF", fontFamily: "var(--font-sans)" }}>CloudWise AI</span>
        </div>

        {/* Steps */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 style={{ fontSize: "1.7rem", color: "#EEF2FF", marginBottom: "0.75rem" }}>Get started in minutes</h2>
          <p style={{ fontSize: "0.95rem", color: "#8B93B5", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Connect your AWS account and start finding savings — no credit card required.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { n: "1", title: "Create your account", desc: "Sign up in under 60 seconds." },
              { n: "2", title: "Connect AWS",          desc: "Link via IAM role — read-only, secure." },
              { n: "3", title: "See your savings",     desc: "AI surfaces waste and optimizations instantly." },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(91,82,240,0.3), rgba(123,117,255,0.2))",
                  border: "1px solid rgba(91,82,240,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 700, color: "#7B75FF",
                }}>
                  {n}
                </div>
                <div>
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#EEF2FF", marginBottom: "0.2rem" }}>{title}</p>
                  <p style={{ fontSize: "0.85rem", color: "#8B93B5" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ marginTop: "2.5rem", padding: "1.25rem", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", marginBottom: "0.75rem" }}>
              {["NK", "SR", "AM", "PG"].map((init, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%", marginLeft: i > 0 ? -8 : 0,
                  background: `hsl(${240 + i * 30}, 60%, 55%)`,
                  border: "2px solid #0a0820",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: "#fff",
                }}>
                  {init}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.85rem", color: "#8B93B5" }}>
              Join <strong style={{ color: "#EEF2FF" }}>2,400+ engineers</strong> already optimizing with CloudWise.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "#4B5680" }}>© 2025 CloudWise AI · All rights reserved</p>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto", position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,82,240,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 430, position: "relative", zIndex: 1 }}>
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #5B52F0, #7B75FF)", boxShadow: "0 4px 16px rgba(91,82,240,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#EEF2FF" }}>CloudWise AI</span>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Create account</h2>
            <p className="caption">Start optimizing your cloud costs — free forever.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              <Field id="firstName" label="First name" placeholder="Krisha" icon={User} value={firstName} onChange={setFirstName} autoComplete="given-name" />
              <Field id="lastName"  label="Last name"  placeholder="Kalal"  icon={User} value={lastName}  onChange={setLastName}  autoComplete="family-name" />
            </div>

            <Field
              id="email" label="Email address" type="email"
              placeholder="you@company.com" icon={Mail}
              value={email} onChange={setEmail} required autoComplete="email"
            />

            <Field
              id="password" label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Minimum 8 characters" icon={Lock}
              value={password} onChange={setPassword} required autoComplete="new-password"
              rightSlot={eyeBtn(showPass, () => setShowPass((v) => !v))}
            />

            <Field
              id="confirmPassword" label="Confirm password"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password" icon={Lock}
              value={confirmPassword} onChange={setConfirmPassword} required autoComplete="new-password"
              rightSlot={eyeBtn(showConfirm, () => setShowConfirm((v) => !v))}
            />

            {/* Password strength bar */}
            {password.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 99,
                      background: i < strength ? strengthColors[strength - 1] : "rgba(255,255,255,0.08)",
                      transition: "background 0.3s ease",
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#8B93B5" }}>{strengthLabel}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="animate-fade-in" style={{
                display: "flex", alignItems: "flex-start", gap: "0.6rem",
                padding: "0.85rem 1rem", borderRadius: 12,
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
                color: "#F87171", fontSize: "0.875rem",
              }}>
                <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg" style={{ marginTop: "0.25rem" }}>
              {!isSubmitting && (<>Create Account<ArrowRight className="w-4 h-4 ml-1" /></>)}
            </Button>

            <p style={{ fontSize: "0.75rem", color: "#4B5680", textAlign: "center" }}>
              By creating an account you agree to our{" "}
              <a href="#" style={{ color: "#7B75FF" }}>Terms</a> &amp;{" "}
              <a href="#" style={{ color: "#7B75FF" }}>Privacy Policy</a>
            </p>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: "0.8rem", color: "#4B5680" }}>already have an account?</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          <Link to="/login" className="btn-secondary w-full" style={{ display: "flex", justifyContent: "center" }}>
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
