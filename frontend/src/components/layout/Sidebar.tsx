import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Lightbulb,
  MessageSquareText,
  FileText,
  Settings,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard",       label: "Dashboard",       icon: LayoutDashboard },
  { to: "/resources",       label: "Resources",       icon: Server },
  { to: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { to: "/copilot",         label: "AI Copilot",      icon: MessageSquareText },
  { to: "/reports",         label: "Reports",         icon: FileText },
  { to: "/settings",        label: "Settings",        icon: Settings },
];

export function Sidebar() {
  return (
    <aside
      className="w-[240px] h-screen flex flex-col px-3 py-5 shrink-0"
      style={{
        background: "rgba(8, 12, 24, 0.9)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-2 mb-7">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, #5B52F0, #7B75FF)",
            boxShadow: "0 4px 16px rgba(91,82,240,0.4)",
          }}
        >
          <Zap className="w-4.5 h-4.5 text-white" />
        </div>
        <span
          className="text-[1rem] font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          CloudWise AI
        </span>
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
  );
}
