import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Lightbulb,
  MessageSquareText,
  FileText,
  Settings,

  X,
  Calculator,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { to: "/resources",       label: "Resources",       icon: Server },
  { to: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/copilot",         label: "AI Copilot",      icon: MessageSquareText },
  { to: "/simulator",       label: "Simulator",       icon: Calculator },
  { to: "/reports",         label: "Reports",         icon: FileText },
  { to: "/settings",        label: "Settings",        icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay (mobile only) */}
      <div
        className={`sidebar-overlay${isOpen ? " overlay-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar w-[240px] h-screen flex flex-col px-3 py-5 shrink-0${isOpen ? " sidebar-open" : ""}`}
        style={{
          background: "rgba(8, 12, 24, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo + close (mobile) */}
        <div className="flex items-center gap-2.5 px-3 py-2 mb-7">
          <div className="h-8 sm:h-9 shrink-0 flex items-center justify-center bg-transparent">
            <img src="/logo.png" alt="CloudWise AI logo" className="h-full w-auto object-contain drop-shadow-sm" />
          </div>
          <span
            className="text-[1rem] font-semibold tracking-tight flex-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            CloudWise AI
          </span>
          {/* Close button — only visible on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="show-mobile"
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-secondary)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: 6,
                display: "none", /* overridden by show-mobile class on mobile */
              }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav label */}
        <p
          className="px-4 mb-2 text-[0.7rem] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          Navigation
        </p>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item-active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="flex items-center justify-center w-5 h-5 shrink-0"
                    style={{ color: isActive ? "var(--color-accent-hover)" : "inherit" }}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom version tag */}
        <p
          className="px-4 py-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          CloudWise AI v1.0
        </p>
      </aside>
    </>
  );
}
