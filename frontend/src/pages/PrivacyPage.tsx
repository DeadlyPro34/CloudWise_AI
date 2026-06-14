import { FileText, Eye, Trash2, Lock } from "lucide-react";
import { PageShell } from "../components/PageShell";

const SECTIONS = [
  {
    icon: FileText,
    title: "Data We Collect",
    color: "#5B52F0",
    items: [
      { label: "Account information", detail: "Name, email address, and company name provided at signup." },
      { label: "Usage telemetry", detail: "Feature interactions and product analytics to help us improve CloudWise." },
      { label: "AWS billing data", detail: "Cost and usage data accessed via a read-only IAM role you authorise — never source code, infrastructure config, or customer PII from your AWS environment." },
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Data",
    color: "#7B75FF",
    items: [
      { label: "Cost analytics & recommendations", detail: "Billing data is processed exclusively to generate the dashboards, forecasts, and savings recommendations you see inside CloudWise." },
      { label: "Product improvement", detail: "Usage telemetry helps us understand which features matter most and where users get stuck." },
      { label: "No data selling", detail: "We never sell, rent, or share your personal or billing data with third parties for advertising or commercial purposes." },
    ],
  },
  {
    icon: Lock,
    title: "Your Rights",
    color: "#6366f1",
    items: [
      { label: "Access & correction", detail: "You may request a copy of your data or ask us to correct inaccuracies at any time." },
      { label: "Deletion", detail: "Email cloudwiseai@gmail.com to request account and data deletion. Data is permanently removed within 30 days of account closure." },
      { label: "Portability", detail: "You can export your cost data in CSV or JSON format from the Reports section at any time." },
    ],
  },
  {
    icon: Trash2,
    title: "Contact & Enquiries",
    color: "#818cf8",
    items: [
      { label: "Privacy contact", detail: "cloudwiseai@gmail.com — we respond to all privacy-related enquiries within 5 business days." },
      { label: "DPA requests", detail: "Enterprise customers requiring a Data Processing Agreement should contact cloudwiseai@gmail.com." },
    ],
  },
];

export function PrivacyPage() {
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
            width: 500,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(91,82,240,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
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
            Legal
          </span>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              fontWeight: 800,
              fontFamily: "var(--font-serif)",
              color: "#EEF2FF",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            Last updated: <strong style={{ color: "#8B93B5" }}>June 1, 2026</strong>
          </p>
          <p style={{ fontSize: "1.05rem", color: "#8B93B5", lineHeight: 1.75, margin: "0 auto", maxWidth: 520 }}>
            CloudWise AI is committed to protecting your personal data. Here's exactly what we collect, why, and what you can do about it.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section style={{ padding: "0 32px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {SECTIONS.map(({ icon: Icon, title, color, items }) => (
            <div
              key={title}
              style={{
                background: "#0e0f1a",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: `3px solid ${color}`,
                borderRadius: 16,
                padding: "1.75rem 2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${color}20`,
                    border: `1px solid ${color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ color: "#EEF2FF", margin: 0, fontSize: "1.05rem", fontWeight: 600 }}>{title}</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {items.map(({ label, detail }) => (
                  <div key={label}>
                    <p style={{ color: "#EEF2FF", margin: "0 0 0.25rem", fontWeight: 500, fontSize: "0.9rem" }}>{label}</p>
                    <p style={{ color: "#8B93B5", margin: 0, fontSize: "0.875rem", lineHeight: 1.65 }}>{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "2rem",
            background: "rgba(91,82,240,0.06)",
            border: "1px solid rgba(91,82,240,0.2)",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#8B93B5", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
            This policy may be updated periodically. We'll notify you of material changes via email or an in-app banner.{" "}
            <a href="mailto:cloudwiseai@gmail.com" style={{ color: "#7B75FF", textDecoration: "none" }}>
              cloudwiseai@gmail.com
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
