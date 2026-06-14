import { Link } from "react-router-dom";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";

/* ─────────────────────────────────────────────
   NavLink with animated underline — identical to LandingPage
───────────────────────────────────────────── */
function NavAnchor({
  label,
  href,
  badge,
}: {
  label: string;
  href: string;
  badge?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
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
          color: hovered ? "#EEF2FF" : "#8B93B5",
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
      {/* Animated underline */}
      <span
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          height: 1.5,
          borderRadius: 99,
          width: hovered ? "100%" : "0%",
          background: "linear-gradient(90deg,#5B52F0,#7B75FF)",
          transition: "width 0.25s ease",
          display: "block",
        }}
      />
    </a>
  );
}

/* ─────────────────────────────────────────────
   Navbar — identical to LandingPage header
───────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(5,5,8,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header row */}
      <div
        className="header-inner"
        style={{
          height: 64,
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg,#5B52F0,#7B75FF)",
              boxShadow: "0 4px 16px rgba(91,82,240,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Zap size={15} color="#fff" />
          </div>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#EEF2FF",
              fontFamily: "var(--font-sans)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            CloudWise AI
          </span>
        </Link>

        {/* Desktop nav — uses CSS class, hidden on mobile */}
        <nav className="landing-nav-links" style={{ gap: "2.5rem" }}>
          <NavAnchor label="Features"     href="/#features" />
          <NavAnchor label="Why Us"       href="/#why-us" />
          <NavAnchor label="Docs"         href="/#docs" badge="new" />
        </nav>

        {/* Right side: CTAs + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div className="landing-nav-ctas">
            <Link
              to="/login"
              className="btn-secondary"
              style={{ padding: "0.48rem 1.1rem", fontSize: "0.875rem" }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="btn-primary"
              style={{ padding: "0.48rem 1.1rem", fontSize: "0.875rem" }}
            >
              Get Started
            </Link>
          </div>

          {/* Hamburger — CSS class shows it only on mobile */}
          <button
            className="landing-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              color: "#8B93B5",
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(5,5,8,0.98)",
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {[
            { label: "Features", href: "/#features" },
            { label: "Why Us",   href: "/#why-us" },
            { label: "Docs",     href: "/#docs" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ color: "#8B93B5", textDecoration: "none", fontSize: "0.95rem", padding: "0.25rem 0" }}
            >
              {label}
            </a>
          ))}
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0.25rem 0" }} />
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            style={{ color: "#8B93B5", textDecoration: "none", fontSize: "0.95rem", padding: "0.25rem 0" }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.95rem",
              background: "linear-gradient(135deg,#5B52F0,#7B75FF)",
              padding: "0.65rem 1rem",
              borderRadius: 8,
              textAlign: "center",
              fontWeight: 600,
              marginTop: "0.25rem",
            }}
          >
            Get Started
          </Link>
        </nav>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */
function FooterCol({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <p
        style={{
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#4b5563",
          fontWeight: 700,
          margin: "0 0 0.1rem",
        }}
      >
        {heading}
      </p>
      {links.map(({ label, href }) =>
        href.startsWith("/") && !href.startsWith("/#") ? (
          <Link
            key={label}
            to={href}
            style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EEF2FF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9ca3af")}
          >
            {label}
          </Link>
        ) : (
          <a
            key={label}
            href={href}
            style={{ fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EEF2FF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9ca3af")}
          >
            {label}
          </a>
        )
      )}
    </div>
  );
}

function PageFooter() {
  return (
    <footer style={{ background: "#07080f", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "56px 32px 32px" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg,#5B52F0,#7B75FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={13} color="#fff" />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#EEF2FF", letterSpacing: "-0.01em" }}>
              CloudWise AI
            </span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.65, maxWidth: 220, margin: 0 }}>
            Actionable FinOps intelligence for modern engineering teams.
          </p>
        </div>

        <FooterCol
          heading="Quick Links"
          links={[
            { label: "Features",      href: "/#features" },
            { label: "Why Us",        href: "/#why-us" },
            { label: "Documentation", href: "/#docs" },
          ]}
        />
        <FooterCol
          heading="Company"
          links={[
            { label: "About Us", href: "/about" },
            { label: "Contact",  href: "/contact" },
          ]}
        />
        <FooterCol
          heading="Legal"
          links={[
            { label: "Privacy Policy",    href: "/privacy" },
            { label: "Terms of Service",  href: "/terms" },
            { label: "Security (SOC 2)",  href: "/security" },
            { label: "Cookie Policy",     href: "/cookies" },
          ]}
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
          flexWrap: "wrap",
          gap: "0.75rem",
          maxWidth: 1100,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: 0 }}>
          {String.fromCharCode(169)} 2026 CloudWise AI {String.fromCharCode(183)} All rights reserved
        </p>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          {["Twitter", "GitHub", "LinkedIn"].map((s) => (
            <a
              key={s}
              href="#"
              style={{ fontSize: "0.82rem", color: "#6b7280", textDecoration: "none", transition: "color 0.2s" }}
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

/* ─────────────────────────────────────────────
   PageShell — wraps all public info pages
───────────────────────────────────────────── */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#07080f" }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <PageFooter />
    </div>
  );
}
