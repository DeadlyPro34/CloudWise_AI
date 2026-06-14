import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Cloud, TrendingUp, Lightbulb, MessageSquareText,
  Activity, Zap, ArrowRight, CheckCircle,
} from "lucide-react";

/* ── Typewriter hook ── */
function useTypewriter(phrases: string[], typingSpeed = 55, pauseMs = 1800, deleteSpeed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [deleting, setDeleting]   = useState(false);
  const [paused, setPaused]       = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = phrases[phraseIdx];
    if (timeout.current) clearTimeout(timeout.current);

    if (paused) {
      // waiting before we start deleting
      timeout.current = setTimeout(() => {
        setPaused(false);
        setDeleting(true);
      }, pauseMs);
    } else if (!deleting) {
      // typing
      timeout.current = setTimeout(() => {
        const next = charIdx + 1;
        setDisplayed(current.slice(0, next));
        if (next > current.length) {
          setPaused(true);
        } else {
          setCharIdx(next);
        }
      }, typingSpeed);
    } else {
      // deleting
      timeout.current = setTimeout(() => {
        const next = charIdx - 1;
        if (next < 0) {
          setDeleting(false);
          setCharIdx(0);
          setDisplayed("");
          setPhraseIdx((p) => (p + 1) % phrases.length);
        } else {
          setDisplayed(current.slice(0, next));
          setCharIdx(next);
        }
      }, deleteSpeed);
    }

    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, [charIdx, deleting, paused, phraseIdx, phrases, typingSpeed, pauseMs, deleteSpeed]);

  return displayed;
}

/* ── Nav link with animated underline ── */
function NavLink({ label, href, badge, isActive, onClick }: { label: string; href: string; badge?: string; isActive?: boolean; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;
  return (
    <a
      href={href}
      onClick={onClick}
      style={{ position: "relative", textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        fontSize: "0.9rem", fontWeight: 500,
        color: active ? "#EEF2FF" : "#8B93B5",
        transition: "color 0.2s ease",
      }}>
        {label}
        {badge && (
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em",
            padding: "0.15rem 0.4rem", borderRadius: 99,
            background: "rgba(52,211,153,0.15)", color: "#34D399",
            border: "1px solid rgba(52,211,153,0.25)", textTransform: "uppercase",
          }}>
            {badge}
          </span>
        )}
      </span>
      {/* Animated underline */}
      <span style={{
        position: "absolute", bottom: -3, left: 0,
        height: 1.5, borderRadius: 99,
        width: active ? "100%" : "0%",
        background: "linear-gradient(90deg, #5B52F0, #7B75FF)",
        transition: "width 0.25s ease",
        display: "block",
      }} />
    </a>
  );
}

/* ── Main page ── */
export function LandingPage() {
  const typed = useTypewriter([
    "Cloud Intelligence",
    "Cloud Savings",
    "Cloud Clarity",
    "Cloud Efficiency",
  ]);

  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-65px 0px -50% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#050508" }}>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,82,240,0.11) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
      </div>

      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      {/* ── STICKY GLASSY HEADER ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8"
        style={{
          height: 60,
          background: "rgba(5,5,8,0.8)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #5B52F0, #7B75FF)",
            boxShadow: "0 4px 14px rgba(91,82,240,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#EEF2FF", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
            CloudWise AI
          </span>
        </div>

        {/* Styled nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink label="Features" href="#features" isActive={activeSection === "features"} onClick={(e) => scrollToSection(e, "features")} />
          <NavLink label="Pricing"  href="#pricing" isActive={activeSection === "pricing"} onClick={(e) => scrollToSection(e, "pricing")} />
          <NavLink label="Docs"     href="#docs"    badge="new" isActive={activeSection === "docs"} onClick={(e) => scrollToSection(e, "docs")} />
        </nav>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "0.65rem" }}>
          <Link to="/login"  className="btn-secondary" style={{ padding: "0.45rem 1rem", fontSize: "0.875rem" }}>Log In</Link>
          <Link to="/signup" className="btn-primary"   style={{ padding: "0.45rem 1rem", fontSize: "0.875rem" }}>Get Started</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
      >
        {/* Badge */}
        <div
          className="badge badge-accent animate-fade-up"
          style={{ marginBottom: "1.5rem", animationDelay: "0.05s" }}
        >
          <Zap className="w-3 h-3" />
          AI-Powered FinOps Copilot
        </div>

        {/* Heading — static first line + typewriter second line */}
        <h1
          className="animate-fade-up"
          style={{ maxWidth: 780, marginBottom: "1.5rem", animationDelay: "0.1s", lineHeight: 1.15 }}
        >
          Turn Cloud Costs Into
          <br />
          <span style={{
            background: "linear-gradient(135deg, #7B75FF 30%, #34D399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
            minWidth: "4ch",        /* prevents layout shift */
          }}>
            {typed}
          </span>
          {/* blinking cursor */}
          <span
            style={{
              display: "inline-block",
              width: "3px",
              height: "0.85em",
              background: "linear-gradient(180deg,#7B75FF,#34D399)",
              borderRadius: 2,
              marginLeft: 4,
              verticalAlign: "middle",
              animation: "blink 1.1s step-start infinite",
            }}
          />
        </h1>

        {/* Sub-copy */}
        <p
          className="animate-fade-up"
          style={{
            maxWidth: 540, fontSize: "1.1rem", lineHeight: 1.75,
            color: "#8B93B5", marginBottom: "2.75rem", animationDelay: "0.2s",
          }}
        >
          CloudWise AI connects to your AWS account, discovers waste, forecasts spending,
          and explains exactly what to fix — in plain English.
        </p>

        {/* CTA row */}
        <div
          className="flex items-center flex-wrap justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.3s", marginBottom: "4.5rem" }}
        >
          <Link
            to="/signup"
            className="btn-primary"
            style={{ padding: "0.875rem 2.25rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary"
            style={{ padding: "0.875rem 2.25rem", fontSize: "1rem" }}
          >
            Connect AWS
          </Link>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-center flex-wrap gap-12 animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          {[
            { value: "48%",    label: "Avg. cost reduction" },
            { value: "$2.3M",  label: "Savings identified"  },
            { value: "< 5 min", label: "Setup time"         },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: "1.9rem", fontWeight: 800, color: "#EEF2FF",
                fontFamily: "var(--font-sans)", lineHeight: 1.05,
              }}>
                {value}
              </p>
              <p style={{ fontSize: "0.82rem", color: "#8B93B5", marginTop: "0.3rem", letterSpacing: "0.02em" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="relative z-10 px-6 py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>Everything you need</h2>
            <p style={{ fontSize: "1.05rem", color: "#8B93B5", maxWidth: 480, margin: "0 auto" }}>
              One platform to monitor, forecast, and optimize all your AWS costs.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(168px, 1fr))",
            gap: "1rem",
          }}>
            {[
              { icon: Activity,         title: "Cost Analysis",      desc: "Real-time visibility into AWS spend" },
              { icon: TrendingUp,        title: "Forecasting",        desc: "Predict spend 7/30/90 days ahead" },
              { icon: Lightbulb,         title: "Savings Tips",       desc: "Actionable optimization suggestions" },
              { icon: MessageSquareText, title: "AI Copilot",         desc: "Ask questions in plain English" },
              { icon: Cloud,             title: "Health Score",       desc: "One number for cloud efficiency" },
            ].map(({ icon: Icon, title, desc }) => (
              <FeatureCard key={title} Icon={Icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section
        id="pricing"
        className="relative z-10 px-6 py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>Why teams choose CloudWise</h2>
          <p style={{ fontSize: "1rem", color: "#8B93B5", marginBottom: "3rem" }}>
            Built for engineers who care about cost, not just DevOps accountants.
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem", textAlign: "left",
          }}>
            {[
              "Read-only IAM access — we never touch your infrastructure",
              "No per-seat pricing — one flat rate for the whole team",
              "SOC 2 Type II certified infrastructure",
              "Works with all AWS regions and multi-account setups",
            ].map((point) => (
              <div key={point} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#34D399" }} />
                <p style={{ fontSize: "0.9rem", color: "#8B93B5", lineHeight: 1.6 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section
        id="docs"
        className="relative z-10 px-6 py-20 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          style={{
            maxWidth: 600, margin: "0 auto",
            padding: "3.5rem 2rem",
            background: "rgba(91,82,240,0.07)",
            border: "1px solid rgba(91,82,240,0.18)",
            borderRadius: 24,
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="badge badge-accent" style={{ marginBottom: "1.5rem" }}>
            <Zap className="w-3 h-3" /> Limited Beta
          </div>
          <h2 style={{ marginBottom: "0.75rem" }}>Ready to cut your AWS bill?</h2>
          <p style={{ color: "#8B93B5", marginBottom: "2rem" }}>
            Join Us Here.
          </p>
          <Link
            to="/signup"
            className="btn-primary"
            style={{ padding: "0.9rem 2.25rem", fontSize: "1.05rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Blink keyframe injected inline */}
      <style>{`
        html { scroll-behavior: smooth; }
        #features, #pricing, #docs { scroll-margin-top: 64px; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ Icon, title, desc }: { Icon: any; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="card"
      style={{
        transition: "all 0.3s ease", cursor: "default",
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
        borderColor: hovered ? "rgba(91,82,240,0.35)" : "rgba(255,255,255,0.07)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.4)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, marginBottom: "1.1rem",
        background: hovered ? "rgba(91,82,240,0.2)" : "rgba(91,82,240,0.1)",
        border: `1px solid ${hovered ? "rgba(91,82,240,0.35)" : "rgba(91,82,240,0.18)"}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        transition: "all 0.3s ease",
      }}>
        <Icon className="w-5 h-5" style={{ color: hovered ? "#A5A0FF" : "#7B75FF", transition: "color 0.3s" }} />
      </div>
      <h4 style={{ marginBottom: "0.4rem" }}>{title}</h4>
      <p className="caption" style={{ lineHeight: 1.55 }}>{desc}</p>
    </div>
  );
}