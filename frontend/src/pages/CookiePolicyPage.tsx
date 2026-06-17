import { ShieldAlert, Settings, BarChart2, Info } from "lucide-react";
import { PageShell } from "../components/PageShell";

const COOKIE_TYPES = [
  {
    icon: ShieldAlert,
    label: "Strictly Necessary",
    badge: "Required",
    badgeColor: "#F87171",
    badgeBg: "rgba(248,113,113,0.12)",
    badgeBorder: "rgba(248,113,113,0.3)",
    color: "#F87171",
    canDisable: false,
    items: [
      "Session authentication tokens — keep you signed in",
      "CSRF protection tokens — prevent cross-site request forgery",
    ],
    note: "These cookies cannot be disabled. The platform will not function without them.",
  },
  {
    icon: Settings,
    label: "Functional",
    badge: "Optional",
    badgeColor: "#60a5fa",
    badgeBg: "rgba(96,165,250,0.1)",
    badgeBorder: "rgba(96,165,250,0.3)",
    color: "#60a5fa",
    canDisable: true,
    items: [
      "Theme preference (dark / light mode)",
      "Timezone setting for cost reports",
      "Default date range selection in the explorer",
    ],
    note: "Disabling these has no impact on core platform features — only convenience preferences.",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    badge: "Optional",
    badgeColor: "#34D399",
    badgeBg: "rgba(52,211,153,0.1)",
    badgeBorder: "rgba(52,211,153,0.3)",
    color: "#34D399",
    canDisable: true,
    items: [
      "Anonymised usage events sent to our first-party analytics pipeline",
      "Feature interaction tracking to help us improve the product",
    ],
    note: "We never use third-party advertising trackers or share analytics data with ad networks.",
  },
];

export function CookiePolicyPage() {
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
            Cookie Policy
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            Last updated: <strong style={{ color: "#8B93B5" }}>June 15, 2026</strong>
          </p>
          <p style={{ fontSize: "1.05rem", color: "#8B93B5", lineHeight: 1.75, margin: "0 auto", maxWidth: 520 }}>
            CloudWise AI uses cookies to keep you signed in, remember your preferences, and understand how the product is used.
            Here's exactly what we use and why.
          </p>
        </div>
      </section>

      {/* Cookie cards */}
      <section style={{ padding: "0 32px 80px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {COOKIE_TYPES.map(({ icon: Icon, label, badge, badgeColor, badgeBg, badgeBorder, color, canDisable, items, note }) => (
            <div
              key={label}
              style={{
                background: "#0e0f1a",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: `3px solid ${color}`,
                borderRadius: 16,
                padding: "1.75rem 2rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${color}18`,
                    border: `1px solid ${color}35`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ color: "#EEF2FF", margin: 0, fontSize: "1.05rem", fontWeight: 600, flex: 1 }}>{label}</h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: badgeColor,
                    background: badgeBg,
                    border: `1px solid ${badgeBorder}`,
                    borderRadius: 999,
                    padding: "0.2rem 0.7rem",
                  }}
                >
                  {badge}
                </span>
              </div>

              {/* Items */}
              <ul style={{ margin: "0 0 1rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {items.map((item, i) => (
                  <li key={i} style={{ color: "#8B93B5", fontSize: "0.875rem", lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>

              {/* Note */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  background: canDisable ? "rgba(255,255,255,0.03)" : "rgba(248,113,113,0.06)",
                  border: `1px solid ${canDisable ? "rgba(255,255,255,0.07)" : "rgba(248,113,113,0.18)"}`,
                  borderRadius: 8,
                  padding: "0.75rem 1rem",
                }}
              >
                <Info size={14} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ margin: 0, color: "#8B93B5", fontSize: "0.825rem", lineHeight: 1.6 }}>{note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Management note */}
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
          <p style={{ color: "#8B93B5", fontSize: "0.875rem", margin: 0, lineHeight: 1.65 }}>
            Manage cookie preferences in your browser settings or in the{" "}
            <strong style={{ color: "#EEF2FF" }}>Account → Privacy</strong> panel after signing in. Questions?{" "}
            <a href="mailto:cloudwiseai@gmail.com" style={{ color: "#7B75FF", textDecoration: "none" }}>
              cloudwiseai@gmail.com
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
