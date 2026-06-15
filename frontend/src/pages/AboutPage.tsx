import { Link } from "react-router-dom";
import { Shield, Globe, Lightbulb, Users, ArrowRight, CheckCircle } from "lucide-react";
import { PageShell } from "../components/PageShell";

const VALUES = [
  {
    icon: Shield,
    title: "Trust by Design",
    desc: "Read-only access to your AWS billing data — we never touch your infrastructure. SOC 2 Type II certified from day one.",
    color: "#5B52F0",
  },
  {
    icon: Lightbulb,
    title: "Clarity Over Complexity",
    desc: "No sprawling dashboards. Every insight we surface is actionable, contextual, and tied to real dollar amounts.",
    color: "#7B75FF",
  },
  {
    icon: Globe,
    title: "Remote-First Culture",
    desc: "18 people across San Francisco, London, and Bangalore. Async-first, documentation-driven, results-oriented.",
    color: "#6366f1",
  },
  {
    icon: Users,
    title: "Built for Engineers",
    desc: "We're engineers too. CloudWise speaks your language — tags, ARNs, RIs, Savings Plans — not just business metrics.",
    color: "#818cf8",
  },
];

const TIMELINE = [
  { year: "2024", label: "Idea born inside a $2M/month AWS bill", accent: true },
  { year: "Early 2026", label: "Founded by ex-AWS & ex-Datadog engineers", accent: false },
  { year: "Feb 2026", label: "Public beta launch — Cost Analysis, Forecasting, Health Score", accent: false },
  { year: "Apr 2026", label: "Slack integration and tag-level cost breakdowns ship", accent: false },
  { year: "Jun 2026", label: "Multi-account AWS Organizations support & AI Copilot chaining", accent: true },
];

export function AboutPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "100px 32px 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(91,82,240,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#7B75FF",
              background: "rgba(91,82,240,0.12)",
              border: "1px solid rgba(91,82,240,0.25)",
              borderRadius: 999,
              padding: "0.35rem 1rem",
              marginBottom: "1.5rem",
            }}
          >
            Our Story
          </span>
          <h1
            style={{
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              fontWeight: 800,
              fontFamily: "var(--font-serif)",
              color: "#EEF2FF",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            We built the tool we{" "}
            <span style={{ background: "linear-gradient(135deg,#5B52F0,#A5A0FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              wished existed
            </span>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#8B93B5", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            CloudWise AI was founded in 2026 by a team of ex-AWS and ex-Datadog engineers who were tired of watching
            engineering teams burn millions on cloud waste they didn't know existed.
          </p>
        </div>
      </section>

      {/* Mission card */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(91,82,240,0.15), rgba(123,117,255,0.08))",
            border: "1px solid rgba(91,82,240,0.3)",
            borderRadius: 20,
            padding: "48px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(91,82,240,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7B75FF", marginBottom: "0.75rem" }}>
            Our Mission
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", color: "#EEF2FF", marginBottom: "1rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Make cloud cost intelligence accessible to every engineering team
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#8B93B5", lineHeight: 1.75, maxWidth: 680, margin: 0 }}>
            Not just those with dedicated FinOps consultants and six-figure tooling budgets. We're a remote-first team of 18
            across San Francisco, London, and Bangalore — backed by leading infrastructure-focused investors and committed to
            a strict read-only data philosophy.
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#EEF2FF", fontSize: "clamp(1.6rem, 3vw, 2rem)", marginBottom: "0.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          What we stand for
        </h2>
        <p style={{ textAlign: "center", color: "#8B93B5", maxWidth: 480, margin: "0 auto 3rem", lineHeight: 1.7 }}>
          Four principles that guide every decision we make.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {VALUES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              style={{
                background: "#0e0f1a",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "1.75rem",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(91,82,240,0.35)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${color}20`,
                  border: `1px solid ${color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.1rem",
                }}
              >
                <Icon size={20} color={color} />
              </div>
              <h4 style={{ color: "#EEF2FF", marginBottom: "0.5rem", fontWeight: 600, fontSize: "1rem" }}>{title}</h4>
              <p style={{ color: "#8B93B5", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: "0 32px 80px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#EEF2FF", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", marginBottom: "0.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          How we got here
        </h2>
        <p style={{ textAlign: "center", color: "#8B93B5", marginBottom: "3rem", lineHeight: 1.7 }}>A short journey from pain point to product.</p>
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: "rgba(91,82,240,0.2)", borderRadius: 2 }} />
          {TIMELINE.map(({ year, label, accent }, i) => (
            <div key={i} style={{ position: "relative", marginBottom: "2rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  position: "absolute",
                  left: -25,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: accent ? "#5B52F0" : "#1C2540",
                  border: `2px solid ${accent ? "#7B75FF" : "rgba(255,255,255,0.15)"}`,
                  flexShrink: 0,
                  boxShadow: accent ? "0 0 10px rgba(91,82,240,0.5)" : "none",
                }}
              />
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: accent ? "#7B75FF" : "#4b5563", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {year}
                </span>
                <p style={{ color: "#EEF2FF", margin: "0.2rem 0 0", fontSize: "0.95rem", lineHeight: 1.5 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOC2 badge */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "#0e0f1a",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "rgba(91,82,240,0.15)",
              border: "1px solid rgba(91,82,240,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Shield size={26} color="#7B75FF" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: "#EEF2FF", margin: "0 0 0.3rem", fontWeight: 600 }}>SOC 2 Type II Certified</h4>
            <p style={{ color: "#8B93B5", margin: 0, fontSize: "0.9rem", lineHeight: 1.6 }}>
              CloudWise is SOC 2 Type II certified and operates with a strict read-only data philosophy — we analyse your
              billing data, we never touch your infrastructure. Audit report available on request.
            </p>
          </div>
          <Link
            to="/security"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#7B75FF",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.75")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Security details <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 32px",
          textAlign: "center",
          background: "linear-gradient(180deg, transparent, rgba(91,82,240,0.06))",
        }}
      >
        <h2 style={{ fontSize: "clamp(1.7rem, 3vw, 2.2rem)", color: "#EEF2FF", marginBottom: "0.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Ready to cut cloud waste?
        </h2>
        <p style={{ color: "#8B93B5", fontSize: "1.05rem", marginBottom: "2rem", lineHeight: 1.7 }}>
          Join hundreds of engineering teams saving real money with CloudWise AI.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2.25rem",
              background: "linear-gradient(135deg,#5B52F0,#7B75FF)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "1rem",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Get Started <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.9rem 2.25rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#EEF2FF",
              textDecoration: "none",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "1rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            }}
          >
            Talk to us
          </Link>
        </div>
      </section>

      {/* Checkmarks strip */}
      <section style={{ padding: "0 32px 64px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
          {["No credit card required", "2-minute setup", "Read-only AWS access"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle size={16} color="#5B52F0" />
              <span style={{ color: "#8B93B5", fontSize: "0.9rem" }}>{t}</span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
