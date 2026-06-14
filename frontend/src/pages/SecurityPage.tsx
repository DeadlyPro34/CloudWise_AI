import { Shield, Lock, Server, Globe, Eye, FileCheck, ArrowRight } from "lucide-react";
import { PageShell } from "../components/PageShell";

const FEATURES = [
  {
    icon: Shield,
    title: "Read-Only AWS Access",
    desc: "We connect via a read-only IAM role you create. CloudWise never writes to, modifies, or deletes anything in your AWS account.",
    color: "#5B52F0",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    desc: "All billing data is encrypted at rest using AES-256 and in transit using TLS 1.3. No exceptions.",
    color: "#7B75FF",
  },
  {
    icon: FileCheck,
    title: "SOC 2 Type II Certified",
    desc: "We've completed a full SOC 2 Type II audit covering the Security, Availability, and Confidentiality trust service criteria.",
    color: "#6366f1",
  },
  {
    icon: Eye,
    title: "Annual Pen Testing",
    desc: "An independent third-party security firm conducts annual penetration tests across our entire platform and API surface.",
    color: "#818cf8",
  },
  {
    icon: Server,
    title: "Role-Based Access Control",
    desc: "Granular RBAC across all admin actions, with a full audit trail stored for 12 months and available on request.",
    color: "#a5b4fc",
  },
  {
    icon: Globe,
    title: "Data Residency Options",
    desc: "Choose where your data lives: US (us-east-1) or EU (eu-west-1). We comply with GDPR, CCPA, and regional data laws.",
    color: "#c7d2fe",
  },
];

export function SecurityPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "100px 32px 64px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            width: 600,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(91,82,240,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          {/* SOC 2 badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#34D399",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: 999,
              padding: "0.35rem 1rem",
              marginBottom: "1.5rem",
            }}
          >
            <Shield size={13} />
            SOC 2 Type II Certified
          </div>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              fontFamily: "var(--font-serif)",
              color: "#EEF2FF",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            Security &{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#5B52F0,#A5A0FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Compliance
            </span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#8B93B5", lineHeight: 1.75, margin: "0 auto", maxWidth: 560 }}>
            Security is foundational to CloudWise. We've completed a SOC 2 Type II audit covering Security, Availability, and
            Confidentiality trust service criteria — and we take this responsibility seriously every day.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              style={{
                background: "#0e0f1a",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "1.75rem",
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${color}55`;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = `0 0 40px ${color}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: `${color}20`,
                  border: `1px solid ${color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.1rem",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color={color} />
              </div>
              <h4 style={{ color: "#EEF2FF", margin: "0 0 0.5rem", fontWeight: 600, fontSize: "0.95rem" }}>{title}</h4>
              <p style={{ color: "#8B93B5", margin: 0, fontSize: "0.875rem", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOC 2 deep-dive */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(91,82,240,0.12), rgba(99,102,241,0.06))",
            border: "1px solid rgba(91,82,240,0.25)",
            borderRadius: 20,
            padding: "48px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: -60,
              width: 250,
              height: 250,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(91,82,240,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "rgba(91,82,240,0.2)",
                border: "1px solid rgba(91,82,240,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileCheck size={30} color="#7B75FF" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#EEF2FF", marginBottom: "0.75rem", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
                Request the SOC 2 Report
              </h2>
              <p style={{ color: "#8B93B5", marginBottom: "1.25rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
                Our full SOC 2 Type II audit report is available to enterprise customers and prospects under NDA. We can also
                provide completed security questionnaires in your preferred format.
              </p>
              <a
                href="mailto:cloudwiseai@gmail.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg,#5B52F0,#7B75FF)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 9,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                Request Report <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "0 32px 100px", textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Found a security issue?{" "}
          <a
            href="mailto:cloudwiseai@gmail.com"
            style={{ color: "#7B75FF", textDecoration: "none", fontWeight: 500 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
          >
            Disclose it responsibly
          </a>{" "}
          — we respond to all security reports within 24 hours.
        </p>
      </section>
    </PageShell>
  );
}
