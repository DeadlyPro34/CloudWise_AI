import { FileText, AlertTriangle, Ban, RefreshCw } from "lucide-react";
import { PageShell } from "../components/PageShell";

const SECTIONS = [
  {
    icon: FileText,
    title: "1. Agreement to Terms",
    color: "#5B52F0",
    paras: [
      "By accessing or using CloudWise AI (the \"Service\") you agree to be bound by these Terms of Service. Please read them carefully before using the platform.",
      "If you are using the Service on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms. In that case, \"you\" and \"your\" refer to that entity.",
    ],
  },
  {
    icon: Ban,
    title: "2. Permitted Use",
    color: "#7B75FF",
    paras: [
      "The Service is provided for lawful FinOps and cloud cost management purposes only. You agree not to use CloudWise AI to:",
    ],
    bullets: [
      "Reverse-engineer, decompile, or disassemble any part of the Service",
      "Resell, sublicense, or commercially redistribute the Service or its outputs",
      "Build competing products or services using insights derived from the platform",
      "Upload malicious code, interfere with, or disrupt the integrity of the Service",
    ],
  },
  {
    icon: AlertTriangle,
    title: "3. Limitation of Liability",
    color: "#FBBF24",
    paras: [
      "CloudWise AI provides cost analytics and recommendations as informational guidance only. Actual savings depend on your specific infrastructure, usage patterns, and business decisions.",
      "To the fullest extent permitted by law, CloudWise is not liable for any indirect, incidental, special, consequential, or punitive damages arising from: your use of the Service; reliance on any cost recommendation or forecast; or any interruption or cessation of the Service.",
    ],
  },
  {
    icon: RefreshCw,
    title: "4. Changes to Terms",
    color: "#818cf8",
    paras: [
      "We may update these Terms from time to time. When we make material changes, we'll notify you via email and/or a prominent in-app notice at least 14 days before the changes take effect.",
      "Continued use of the Service after the effective date constitutes your acceptance of the revised Terms. If you do not agree, you may close your account before the changes take effect.",
    ],
  },
];

export function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            Effective: <strong style={{ color: "#8B93B5" }}>June 15, 2026</strong>
          </p>
          <p style={{ fontSize: "1.05rem", color: "#8B93B5", lineHeight: 1.75, margin: "0 auto", maxWidth: 520 }}>
            By using CloudWise AI you agree to these terms. Here's what that means in plain English.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section style={{ padding: "0 32px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {SECTIONS.map(({ icon: Icon, title, color, paras, bullets }) => (
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
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {paras.map((p, i) => (
                  <p key={i} style={{ color: "#8B93B5", margin: 0, fontSize: "0.9rem", lineHeight: 1.7 }}>
                    {p}
                  </p>
                ))}
                {bullets && (
                  <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {bullets.map((b, i) => (
                      <li key={i} style={{ color: "#8B93B5", fontSize: "0.875rem", lineHeight: 1.6 }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
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
            Questions about these Terms? Contact us at{" "}
            <a href="mailto:cloudwiseai@gmail.com" style={{ color: "#7B75FF", textDecoration: "none" }}>
              cloudwiseai@gmail.com
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
