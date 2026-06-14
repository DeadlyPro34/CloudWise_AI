import { Search, Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../store/AuthContext";

export function TopNav() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
      user.email[0].toUpperCase()
    : "?";

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : user?.email ?? "";

  return (
    <header
      className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{
        background: "rgba(8, 12, 24, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 w-80 max-w-full transition-all duration-200 focus-within:ring-2"
        style={{
          background: "rgba(22, 30, 48, 0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "10px",
          outline: "none",
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-accent)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(91,82,240,0.2)";
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <Search className="w-4 h-4 shrink-0" style={{ color: "var(--color-text-muted)" }} />
        <input
          type="text"
          placeholder="Search resources, recommendations…"
          className="bg-transparent outline-none text-sm w-full"
          style={{
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-sans)",
          }}
        />
        <kbd
          className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0"
          style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-text-muted)" }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "var(--color-text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
          }}
        >
          <Bell className="w-4.5 h-4.5" />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--color-accent-hover)" }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* User row */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200 group"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
          }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[0.8rem] font-bold shrink-0"
            style={{
              background: "linear-gradient(135deg, #5B52F0, #7B75FF)",
              boxShadow: "0 2px 8px rgba(91,82,240,0.35)",
            }}
          >
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold truncate max-w-[120px]" style={{ color: "var(--color-text-primary)" }}>
              {displayName}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: "var(--color-text-muted)" }} />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Log out"
          className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(248,113,113,0.06)",
            border: "1px solid rgba(248,113,113,0.12)",
            color: "var(--color-text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-danger)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.12)";
          }}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
