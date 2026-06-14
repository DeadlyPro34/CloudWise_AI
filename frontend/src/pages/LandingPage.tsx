import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  TrendingUp, Lightbulb, MessageSquareText,
  Activity, Zap, ArrowRight, CheckCircle, Cloud, X, Menu,
} from "lucide-react";

/* -------------------------------------------------
   Typewriter hook
------------------------------------------------- */
function useTypewriter(
  phrases: string[],
  typingSpeed = 55,
  pauseMs = 1800,
  deleteSpeed = 30,
) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = phrases[phraseIdx];
    if (timeout.current) clearTimeout(timeout.current);

    if (paused) {
      timeout.current = setTimeout(() => {
        setPaused(false);
        setDeleting(true);
      }, pauseMs);
    } else if (!deleting) {
      timeout.current = setTimeout(() => {
        const next = charIdx + 1;
        setDisplayed(current.slice(0, next));
        if (next > current.length) setPaused(true);
        else setCharIdx(next);
      }, typingSpeed);
    } else {
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

/* -------------------------------------------------
   NavAnchor — animated underline
------------------------------------------------- */
function NavAnchor({
  label, href, badge, isActive, onClick,
}: {
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = isActive || hovered;

  return (
    <a
      href={href}
      onClick={onClick}
      style={{ position: "relative", textDecoration: "none", paddingBottom: 2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.95rem",
          fontWeight: 500,
          color: lit ? "#EEF2FF" : "#8B93B5",
          transition: "color 0.2s ease",
        }}
      >
        {label}
        {badge && (
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              padding: "0.12rem 0.38rem",
              borderRadius: 99,
              background: "rgba(52,211,153,0.14)",
              color: "#34D399",
              border: "1px solid rgba(52,211,153,0.25)",
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        )}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          height: 1.5,
          borderRadius: 99,
          width: lit ? "100%" : "0%",
          background: "linear-gradient(90deg,#5B52F0,#7B75FF)",
          transition: "width 0.25s ease",
          display: "block",
        }}
      />
    </a>
  );
}

/* -------------------------------------------------
   FeatureCard
------------------------------------------------- */
function FeatureCard({
  Icon,
  title,
  desc,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="card"
      style={{
        transition: "all 0.3s ease",
        cursor: "default",
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
        borderColor: hovered ? "rgba(91,82,240,0.35)" : "rgba(255,255,255,0.07)",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.4)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          marginBottom: "1.1rem",
          background: hovered ? "rgba(91,82,240,0.2)" : "rgba(91,82,240,0.1)",
          border: `1px solid ${hovered ? "rgba(91,82,240,0.35)" : "rgba(91,82,240,0.18)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.3s ease",
        }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: hovered ? "#A5A0FF" : "#7B75FF", transition: "color 0.3s" }}
        />
      </div>
      <h4 style={{ marginBottom: "0.4rem" }}>{title}</h4>
      <p className="caption" style={{ lineHeight: 1.55 }}>
        {desc}
      </p>
    </div>
  );
}

/* -------------------------------------------------
   Modal types
------------------------------------------------- */
type ModalKey =
  | "Features" | "Changelog" | "Documentation"
  | "About Us" | "Careers" | "Blog" | "Contact"
  | "Privacy Policy" | "Terms of Service" | "Security (SOC 2)" | "Cookie Policy"
  | null;

/* -------------------------------------------------
   FooterModal
------------------------------------------------- */
const MODAL_DATA: Record<Exclude<ModalKey, null>, { heading: string; bullets: string[]; paras: string[] }> = {
  Features: {
    heading: "Platform Features",
    bullets: [
      "Cost Analysis — Real-time dashboards by service, region, account, and tag.",
      "AI Forecasting — ML projections for 7, 30, and 90 days ahead.",
      "Savings Tips — Right-sizing, Reserved Instance, and Savings Plans recommendations.",
      "AI Copilot — Ask questions in plain English about your spend.",
      "Health Score — A single 0–100 efficiency score tracking team progress.",
      "Anomaly Alerts — Instant Slack/email alerts on spend deviations.",
    ],
    paras: [
      "CloudWise AI is an end-to-end FinOps platform built for engineering teams who want clear, actionable insight into their AWS spend.",
      "All features work from day one with a read-only IAM role — no agents, no instrumentation, no code changes required.",
    ],
  },
  Changelog: {
    heading: "Changelog",
    bullets: [
      "v1.2.0 (Jun 2026): Multi-account aggregated view for AWS Organizations.",
      "v1.2.0 (Jun 2026): AI Copilot follow-up question chaining.",
      "v1.2.0 (Jun 2026): Forecast accuracy improved 18% with updated ARIMA model.",
      "v1.1.0 (Apr 2026): Slack integration for anomaly alerts.",
      "v1.1.0 (Apr 2026): Tag-level cost breakdown in the explorer.",
      "v1.0.0 (Feb 2026): Initial public beta launch with Cost Analysis, Forecasting, Health Score.",
    ],
    paras: [],
  },
  Documentation: {
    heading: "Documentation — Getting Started",
    bullets: [
      "1. Sign up at app.cloudwise.ai and create a workspace.",
      "2. Go to Settings > AWS Integration.",
      "3. Deploy the provided CloudFormation template (creates a read-only IAM role).",
      "4. Paste the generated Role ARN and click Verify Connection.",
      "5. Wait ~2 minutes for your first dashboard to appear.",
    ],
    paras: [
      "Full API reference, Terraform module docs, and advanced configuration guides are in the documentation portal.",
      "Questions? Reach us at support@cloudwise.ai",
    ],
  },
  "About Us": {
    heading: "About CloudWise AI",
    bullets: [],
    paras: [
      "CloudWise AI was founded in 2025 by a team of ex-AWS and ex-Datadog engineers who were tired of watching engineering teams burn millions on cloud waste they did not know existed.",
      "Our mission: make cloud cost intelligence accessible to every engineering team, not just those with dedicated FinOps consultants.",
      "We are a remote-first team of 18 across San Francisco, London, and Bangalore, backed by leading infrastructure-focused investors.",
      "CloudWise is SOC 2 Type II certified and operates with a strict read-only data philosophy — we analyse your billing data, we never touch your infrastructure.",
    ],
  },
  Careers: {
    heading: "Careers at CloudWise",
    bullets: [
      "Senior Full-Stack Engineer — Product — Remote (US/EU)",
      "ML Engineer (Forecasting) — AI — Remote (Global)",
      "Developer Advocate — Growth — Remote (US)",
      "Senior Product Designer — Design — Remote (Global)",
    ],
    paras: [
      "We are a remote-first company that hires for impact, not pedigree. If you love solving hard infrastructure and data problems, we want to hear from you.",
      "Send your CV and a short note to careers@cloudwise.ai",
    ],
  },
  Blog: {
    heading: "Blog",
    bullets: [
      "Jun 8 2026 — How We Cut a $400k/yr AWS Bill by 40% in 3 Weeks",
      "May 21 2026 — The Hidden Cost of EC2 Data Transfer You Are Probably Ignoring",
      "Apr 14 2026 — FinOps in 2026: Why Plain-English AI Is Replacing Dashboards",
    ],
    paras: [
      "Read these and more on our blog at blog.cloudwise.ai",
    ],
  },
  Contact: {
    heading: "Contact Us",
    bullets: [
      "General enquiries: hello@cloudwise.ai",
      "Technical support: support@cloudwise.ai",
      "Security disclosures: security@cloudwise.ai",
      "Press and partnerships: press@cloudwise.ai",
    ],
    paras: [
      "We are a small team and we read every message. Expect a reply within one business day.",
      "Support hours: Monday to Friday, 09:00 to 18:00 UTC. Emergency incident support is available 24/7 for paid plans.",
    ],
  },
  "Privacy Policy": {
    heading: "Privacy Policy",
    bullets: [],
    paras: [
      "Last updated: June 1, 2026.",
      "CloudWise AI is committed to protecting your personal data. We collect account information (name, email, company), usage telemetry, and AWS billing data you authorise us to read via a read-only IAM role. We do not collect application data, source code, or customer PII from your AWS environment.",
      "Billing data is used solely to generate cost analytics and recommendations. Usage telemetry improves the product. We never sell data to third parties.",
      "You may request access, correction, or deletion of your data at any time by emailing privacy@cloudwise.ai. Data is deleted within 30 days of account closure.",
    ],
  },
  "Terms of Service": {
    heading: "Terms of Service",
    bullets: [],
    paras: [
      "Effective: February 15, 2026.",
      "By accessing or using CloudWise AI (the Service) you agree to be bound by these Terms. If you are using the Service on behalf of a company, you represent that you have authority to bind that company.",
      "Permitted use: The Service is provided for lawful FinOps and cloud cost management purposes only. You may not reverse-engineer, resell, or use the Service to build competing products.",
      "Limitation of liability: CloudWise is not liable for any indirect, incidental, or consequential damages arising from use of the Service or reliance on any cost recommendations.",
    ],
  },
  "Security (SOC 2)": {
    heading: "Security and Compliance",
    bullets: [
      "Read-only AWS IAM access — we never write to your infrastructure",
      "All data encrypted at rest (AES-256) and in transit (TLS 1.3)",
      "SOC 2 Type II certified — audit report available on request",
      "Annual penetration testing by independent third-party firm",
      "Role-based access control with audit logging on all admin actions",
      "Data residency options: US (us-east-1) and EU (eu-west-1)",
    ],
    paras: [
      "Security is foundational to CloudWise. We have completed a SOC 2 Type II audit covering Security, Availability, and Confidentiality trust service criteria.",
      "To request our SOC 2 report or security questionnaire, contact security@cloudwise.ai",
    ],
  },
  "Cookie Policy": {
    heading: "Cookie Policy",
    bullets: [
      "Strictly necessary: Session authentication and CSRF protection tokens. Cannot be disabled.",
      "Functional: Preference cookies (theme, timezone, date range). Disabling has no impact on core features.",
      "Analytics: Anonymised usage events to our first-party pipeline. No third-party ad tracking.",
    ],
    paras: [
      "Last updated: March 10, 2026.",
      "CloudWise AI uses cookies to keep you signed in, remember preferences, and understand product usage.",
      "Manage cookie preferences in your browser settings or the Account Privacy panel after signing in.",
    ],
  },
};

function FooterModal({ modalKey, onClose }: { modalKey: ModalKey; onClose: () => void }) {
  useEffect(() => {
    if (!modalKey) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalKey, onClose]);

  if (!modalKey) return null;
  const { heading, bullets, paras } = MODAL_DATA[modalKey];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#0e0f1a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "2rem 2rem 2.25rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#8B93B5",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heading */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#EEF2FF", marginBottom: "1.25rem", paddingRight: "2.5rem", lineHeight: 1.3 }}>
          {heading}
        </h3>

        {/* Paragraphs above bullets */}
        {paras.length > 0 && modalKey !== "Changelog" && modalKey !== "Documentation" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: bullets.length ? "1rem" : 0 }}>
            {paras.map((p, i) => (
              <p key={i} style={{ color: "#8B93B5", lineHeight: 1.7, margin: 0 }}>{p}</p>
            ))}
          </div>
        )}

        {/* Bullets */}
        {bullets.length > 0 && (
          <ul style={{ color: "#9ca3af", lineHeight: 1.85, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: paras.length ? "1rem" : 0 }}>
            {bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}

        {/* Paragraphs below bullets for Documentation / Changelog / others */}
        {(modalKey === "Documentation" || modalKey === "Changelog") && paras.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {paras.map((p, i) => (
              <p key={i} style={{ color: "#8B93B5", lineHeight: 1.7, margin: 0 }}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------
   FooterCol
------------------------------------------------- */
function FooterCol({
  heading,
  links,
  onLinkClick,
}: {
  heading: string;
  links: { label: string }[];
  onLinkClick: (key: ModalKey) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "#4b5563", marginBottom: "0.25rem", fontWeight: 700 }}>
        {heading}
      </p>
      {links.map(({ label }) => (
        <button
          key={label}
          onClick={() => onLinkClick(label as ModalKey)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            textAlign: "left",
            cursor: "pointer",
            fontSize: "0.95rem",
            color: "#9ca3af",
            transition: "color 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ffffff")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9ca3af")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------
   Footer
------------------------------------------------- */
function Footer({ onLinkClick }: { onLinkClick: (key: ModalKey) => void }) {
  return (
    <footer
      style={{
        background: "#07080f",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "56px 64px 32px",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "2.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.1rem" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#EEF2FF", letterSpacing: "-0.01em" }}>CloudWise AI</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "1.0rem", lineHeight: 1.6, maxWidth: 240 }}>
            Actionable FinOps intelligence for modern engineering teams.
          </p>
        </div>

        <FooterCol
          heading="Product"
          links={[{ label: "Features" }, { label: "Changelog" }, { label: "Documentation" }]}
          onLinkClick={onLinkClick}
        />
        <FooterCol
          heading="Company"
          links={[{ label: "About Us" }, { label: "Careers" }, { label: "Blog" }, { label: "Contact" }]}
          onLinkClick={onLinkClick}
        />
        <FooterCol
          heading="Legal"
          links={[{ label: "Privacy Policy" }, { label: "Terms of Service" }, { label: "Security (SOC 2)" }, { label: "Cookie Policy" }]}
          onLinkClick={onLinkClick}
        />
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          marginTop: "2.5rem",
          paddingTop: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1100,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          {String.fromCharCode(169)} 2026 CloudWise AI {String.fromCharCode(183)} All rights reserved
        </p>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          {["Twitter", "GitHub", "LinkedIn"].map((s) => (
            <a
              key={s}
              href="#"
              style={{ fontSize: "0.9rem", color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#9ca3af")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#6b7280")}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------
   Main page
------------------------------------------------- */
export function LandingPage() {
  const typed = useTypewriter([
    "Cloud Intelligence",
    "Cloud Savings",
    "Cloud Clarity",
    "Cloud Efficiency",
  ]);

  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalKey, setModalKey] = useState<ModalKey>(null);

  const openModal = useCallback((key: ModalKey) => setModalKey(key), []);
  const closeModal = useCallback(() => setModalKey(null), []);

  /* Intersection observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-65px 0px -50% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Close mobile menu at md breakpoint */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobileMenuOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#050508" }}>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(91,82,240,0.11) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(52,211,153,0.06) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      {/* HEADER */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(5,5,8,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Header row */}
        <div
          className="header-inner"
          style={{ height: 72, padding: "0 3rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#5B52F0,#7B75FF)", boxShadow: "0 4px 16px rgba(91,82,240,0.45)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#EEF2FF", fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
              CloudWise AI
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: "2.5rem" }}>
            <NavAnchor label="Features" href="#features" isActive={activeSection === "features"} onClick={(e) => scrollTo(e, "features")} />
            <NavAnchor label="Why Us"   href="#why"      isActive={activeSection === "why"}      onClick={(e) => scrollTo(e, "why")} />
            <NavAnchor label="Docs"     href="#docs"     badge="new" isActive={activeSection === "docs"} onClick={(e) => scrollTo(e, "docs")} />
          </nav>

          {/* Right: CTA + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link to="/login"  className="btn-secondary" style={{ padding: "0.55rem 1.25rem", fontSize: "0.9rem" }}>Log In</Link>
            <Link to="/signup" className="btn-primary"   style={{ padding: "0.55rem 1.25rem", fontSize: "0.9rem" }}>Get Started</Link>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "#8B93B5",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(5,5,8,0.97)",
              padding: "1rem 1.5rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <NavAnchor label="Features" href="#features" isActive={activeSection === "features"} onClick={(e) => scrollTo(e, "features")} />
            <NavAnchor label="Why Us"   href="#why"      isActive={activeSection === "why"}      onClick={(e) => scrollTo(e, "why")} />
            <NavAnchor label="Docs"     href="#docs"     badge="new" isActive={activeSection === "docs"} onClick={(e) => scrollTo(e, "docs")} />
          </nav>
        )}
      </header>

      {/* HERO */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 hero-section"
        style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
      >
        <div className="badge badge-accent animate-fade-up" style={{ marginBottom: "1.5rem", animationDelay: "0.05s" }}>
          <Zap className="w-3 h-3" />
          AI-Powered FinOps Copilot
        </div>

        <h1
          className="animate-fade-up hero-h1"
          style={{ maxWidth: 780, marginBottom: "1.5rem", animationDelay: "0.1s", lineHeight: 1.20 }}
        >
          Turn Cloud Costs Into
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#7B75FF 30%,#34D399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
              minWidth: "4ch",
            }}
          >
            {typed}
          </span>
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: "0.85em",
              background: "linear-gradient(180deg,#7B75FF,#34D399)",
              borderRadius: 2,
              marginLeft: 4,
              verticalAlign: "middle",
              animation: "blink 1.1s step-start infinite",
            }}
          />
        </h1>

        <p
          className="animate-fade-up"
          style={{ maxWidth: 540, fontSize: "1.1rem", lineHeight: 1.75, color: "#8B93B5", marginBottom: "2.75rem", animationDelay: "0.2s" }}
        >
          CloudWise AI connects to your AWS account, discovers waste, forecasts spending,
          and explains exactly what to fix in plain English.
        </p>

        <div
          className="flex items-center flex-wrap justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "0.3s", marginBottom: "4.5rem" }}
        >
          <Link to="/signup" className="btn-primary"   style={{ padding: "0.875rem 2.25rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login"  className="btn-secondary" style={{ padding: "0.875rem 2.25rem", fontSize: "1rem" }}>
            Connect AWS
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-row animate-fade-up" style={{ animationDelay: "0.45s" }}>
          {[
            { value: "48%",     label: "Avg. cost reduction" },
            { value: "$2.3M",   label: "Savings identified"  },
            { value: "< 5 min", label: "Setup time"          },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.9rem", fontWeight: 800, color: "#EEF2FF", fontFamily: "var(--font-sans)", lineHeight: 1.05 }}>{value}</p>
              <p style={{ fontSize: "0.82rem", color: "#8B93B5", marginTop: "0.3rem", letterSpacing: "0.02em" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative z-10 px-6 py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", scrollMarginTop: 58 }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>Everything you need</h2>
            <p style={{ fontSize: "1.05rem", color: "#8B93B5", maxWidth: 480, margin: "0 auto" }}>
              One platform to monitor, forecast, and optimize all your AWS costs.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(168px, 1fr))", gap: "1rem" }}>
            {[
              { Icon: Activity,         title: "Cost Analysis",  desc: "Real-time visibility into AWS spend" },
              { Icon: TrendingUp,        title: "Forecasting",    desc: "Predict spend 7/30/90 days ahead" },
              { Icon: Lightbulb,         title: "Savings Tips",   desc: "Actionable optimization suggestions" },
              { Icon: MessageSquareText, title: "AI Copilot",     desc: "Ask questions in plain English" },
              { Icon: Cloud,             title: "Health Score",   desc: "One number for cloud efficiency" },
            ].map(({ Icon, title, desc }) => (
              <FeatureCard key={title} Icon={Icon} title={title} desc={desc} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section
        id="why"
        className="relative z-10 px-6 py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", scrollMarginTop: 58 }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ marginBottom: "1rem" }}>Why teams choose CloudWise</h2>
          <p style={{ fontSize: "1rem", color: "#8B93B5", marginBottom: "3rem" }}>
            Built for engineers who care about cost, not just DevOps accountants.
          </p>
          <div className="why-grid">
            {[
              "Read-only IAM access — we never touch your infrastructure",
              "No per-seat pricing — one flat rate for the whole team",
              "SOC 2 Type II certified infrastructure",
              "Works with all AWS regions and multi-account setups",
            ].map((point) => (
              <div
                key={point}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: "1rem",
                }}
              >
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#34D399" }} />
                <p style={{ fontSize: "0.875rem", color: "#8B93B5", lineHeight: 1.6, margin: 0 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / DOCS */}
      <section
        id="docs"
        className="relative z-10 px-6 text-center cta-section"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", scrollMarginTop: 58, paddingTop: "5rem", paddingBottom: "5rem" }}
      >
        <div
          className="cta-card"
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "3.5rem 2.5rem",
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
          <p style={{ color: "#8B93B5", marginBottom: "2rem" }}>Join CloudWise AI now.</p>
          <Link
            to="/signup"
            className="btn-primary"
            style={{ padding: "0.9rem 2.25rem", fontSize: "1.05rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer onLinkClick={openModal} />

      {/* MODAL */}
      <FooterModal modalKey={modalKey} onClose={closeModal} />

      {/* Global styles */}
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .hero-h1 { font-size: clamp(2rem, 6vw, 3.5rem); }
        .stats-row { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 3rem; }
        .why-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; text-align: left; max-width: 700px; margin: 0 auto; }
        @media (max-width: 768px) {
          .header-inner { padding: 0 1.25rem !important; }
          .hero-section { padding-top: 4rem !important; padding-bottom: 4rem !important; }
          .stats-row { display: grid !important; grid-template-columns: repeat(3,1fr); gap: 1.5rem !important; }
          .cta-section { padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .cta-card { padding: 2rem 1.5rem !important; }
          footer { padding: 48px 28px 28px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .stats-row { display: grid !important; grid-template-columns: 1fr !important; gap: 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          footer > div:last-child { flex-direction: column; gap: 0.75rem; text-align: center; }
        }
      `}</style>
    </div>
  );
}
