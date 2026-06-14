import { Mail, Headphones, Shield, Megaphone, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: "General Enquiries",
    email: "cloudwiseai@gmail.com",
    desc: "Questions about the product, pricing, or partnerships? Start here.",
    color: "#5B52F0",
  },
  {
    icon: Headphones,
    label: "Technical Support",
    email: "cloudwiseai@gmail.com",
    desc: "Stuck on an integration or seeing unexpected data? We've got you.",
    color: "#7B75FF",
  },
  {
    icon: Shield,
    label: "Security Disclosures",
    email: "cloudwiseai@gmail.com",
    desc: "Found a vulnerability? We take all security reports seriously and respond fast.",
    color: "#6366f1",
  },
  {
    icon: Megaphone,
    label: "Press & Partnerships",
    email: "cloudwiseai@gmail.com",
    desc: "Media enquiries, co-marketing, and strategic partnerships.",
    color: "#818cf8",
  },
];

export function ContactPage() {
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
            background: "radial-gradient(ellipse, rgba(91,82,240,0.18) 0%, transparent 70%)",
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
            Get in Touch
          </span>
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
            We read{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#5B52F0,#A5A0FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              every message
            </span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#8B93B5", lineHeight: 1.75, margin: "0 auto" }}>
            We're a small team and we take every message seriously. Expect a reply within one business day.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {CONTACT_CARDS.map(({ icon: Icon, label, email, desc, color }) => (
            <a
              key={email}
              href={`mailto:${email}`}
              style={{
                background: "#0e0f1a",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "1.75rem",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${color}55`;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4)`;
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
                  width: 48,
                  height: 48,
                  borderRadius: 13,
                  background: `${color}20`,
                  border: `1px solid ${color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color={color} />
              </div>
              <div>
                <h4 style={{ color: "#EEF2FF", margin: "0 0 0.3rem", fontWeight: 600, fontSize: "0.95rem" }}>{label}</h4>
                <p style={{ color: "#8B93B5", margin: "0 0 0.6rem", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: color,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  {email} <ArrowRight size={13} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Support hours */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "#0e0f1a",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(91,82,240,0.15)",
              border: "1px solid rgba(91,82,240,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <Clock size={24} color="#7B75FF" />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h4 style={{ color: "#EEF2FF", margin: "0 0 0.75rem", fontWeight: 600 }}>Support Hours</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#5B52F0",
                    background: "rgba(91,82,240,0.12)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: 6,
                    border: "1px solid rgba(91,82,240,0.25)",
                  }}
                >
                  Standard
                </span>
                <p style={{ margin: 0, color: "#8B93B5", fontSize: "0.9rem" }}>
                  Monday – Friday, 09:00 – 18:00 UTC
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#34D399",
                    background: "rgba(52,211,153,0.1)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: 6,
                    border: "1px solid rgba(52,211,153,0.25)",
                  }}
                >
                  Emergency
                </span>
                <p style={{ margin: 0, color: "#8B93B5", fontSize: "0.9rem" }}>
                  24/7 incident support for paid plans
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extra nudge */}
      <section style={{ padding: "0 32px 100px", textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Prefer async?{" "}
          <a
            href="mailto:cloudwiseai@gmail.com"
            style={{ color: "#7B75FF", textDecoration: "none", fontWeight: 500 }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
          >
            Email us directly
          </a>{" "}
          and we'll get back to you within one business day.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link
            to="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 2rem",
              background: "linear-gradient(135deg,#5B52F0,#7B75FF)",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Try CloudWise for free <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
