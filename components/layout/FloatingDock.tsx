"use client";

/**
 * Collapsible Sidebar Navigation
 *
 * A responsive sidebar navigation that expands from an icon rail to a full menu.
 * Features role-gated items, grouped sections, and badge indicators for alerts/watchlist.
 */

import { motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Crown,
  Eye,
  FlaskConical,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Orbit,
  Satellite,
  Settings,
  ShieldAlert,
  Telescope,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermission } from "@/lib/hooks/usePermission";
import type { Action, Resource } from "@/lib/rbac";
import { useAlertsStore } from "@/stores/alerts-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useWatchlistStore } from "@/stores/watchlist-store";
import type { Role } from "@/types";

// ── Types ───────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /**
   * Permission gate — item is visible only when the user has
   * this (resource, action) in the RBAC matrix.
   * If omitted, the item is visible to all authenticated users.
   */
  permission?: { resource: Resource; action: Action };
  color?: string;
  /** Store key for badge count */
  badge?: "alerts" | "watchlist";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// ── Nav structure ───────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Data",
    items: [
      { href: "/neo", label: "NEO Feed", icon: Telescope },
      { href: "/risk", label: "Risk Analysis", icon: ShieldAlert, color: "text-danger" },
      { href: "/cneos", label: "CNEOS / Sentry", icon: Satellite, color: "text-purple-400" },
      { href: "/space-weather", label: "Space Weather", icon: CloudSun, color: "text-amber-400" },
      { href: "/apod", label: "APOD", icon: ImageIcon, color: "text-sky-400" },
      { href: "/explore", label: "3D Explorer", icon: Globe },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { href: "/watchlist", label: "Watchlist", icon: Eye, color: "text-info", badge: "watchlist" },
      { href: "/alerts", label: "Alerts", icon: Bell, color: "text-warning", badge: "alerts" },
    ],
  },
  {
    title: "Social",
    items: [{ href: "/chat", label: "Live Chat", icon: MessageSquare, color: "text-emerald-400" }],
  },
  {
    title: "System",
    items: [
      {
        href: "/admin",
        label: "Admin Panel",
        icon: Settings,
        permission: { resource: "admin_panel", action: "read" },
        color: "text-amber-400",
      },
    ],
  },
];

const ROLE_STYLE: Record<Role, { icon: typeof User; color: string; bg: string }> = {
  ADMIN: { icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  RESEARCHER: {
    icon: FlaskConical,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  USER: { icon: User, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
};

const COLLAPSED_W = "w-[52px]";
const EXPANDED_W = "w-[220px]";

// ── Component ───────────────────────────────────────────

export default function Sidebar() {
  const expanded = useUIStore((s) => s.sidebarExpanded);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { role, can } = usePermission();
  const unreadCount = useAlertsStore((s) => s.unreadCount);
  const watchlistCount = useWatchlistStore((s) => s.items.length);

  const badgeCounts: Record<string, number> = {
    alerts: unreadCount,
    watchlist: watchlistCount,
  };

  const rs = ROLE_STYLE[role ?? "USER"];
  const RoleIcon = rs.icon;

  return (
    <motion.aside
      className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-black/70 backdrop-blur-2xl border-r border-white/[0.06] transition-[width] duration-300 ease-in-out ${
        expanded ? EXPANDED_W : COLLAPSED_W
      }`}
    >
      {/* ── Logo / Brand ───────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-3 h-14 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center">
          <Orbit className="h-5 w-5 text-accent animate-pulse" />
        </div>
        {expanded && (
          <motion.span
            className="font-bold text-sm tracking-tight text-foreground whitespace-nowrap overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Cosmic<span className="text-accent">Watch</span>
          </motion.span>
        )}
      </div>

      {/* ── Nav Groups ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4 scrollbar-thin">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || can(item.permission.resource, item.permission.action)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              {/* Section label */}
              {expanded && (
                <motion.p
                  className="text-[9px] uppercase tracking-[0.12em] text-white/25 font-body px-2 mb-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  {group.title}
                </motion.p>
              )}

              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  const count = item.badge ? badgeCounts[item.badge] : 0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-150 ${
                        isActive
                          ? "bg-accent/[0.12] text-accent"
                          : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                      }`}
                      title={!expanded ? item.label : undefined}
                    >
                      {/* Active bar */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-accent"
                          layoutId="sidebar-active"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive ? (item.color ?? "text-accent") : ""
                        }`}
                      />

                      {expanded && (
                        <span
                          className={`text-[11px] font-body whitespace-nowrap flex-1 ${
                            isActive ? "text-accent font-medium" : "text-white/60"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* Badge */}
                      {count > 0 && (
                        <span
                          className={`flex-shrink-0 tabular-nums font-body font-medium rounded-full ${
                            expanded
                              ? "text-[9px] px-1.5 py-0.5"
                              : "absolute -top-0.5 -right-0.5 text-[8px] min-w-[14px] h-[14px] flex items-center justify-center px-0.5"
                          } ${
                            item.badge === "alerts"
                              ? "bg-warning/20 text-warning border border-warning/30"
                              : "bg-info/20 text-info border border-info/30"
                          }`}
                        >
                          {count > 99 ? "99+" : count}
                        </span>
                      )}

                      {/* Tooltip (collapsed) */}
                      {!expanded && (
                        <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-black/95 border border-white/10 text-[10px] text-white/80 font-body whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] shadow-xl">
                          {item.label}
                          {count > 0 && <span className="ml-1.5 text-warning">({count})</span>}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Bottom section ─────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] px-2 py-2 space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-150"
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
          {expanded && <span className="text-[11px] font-body whitespace-nowrap">Collapse</span>}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-white/30 hover:text-danger hover:bg-danger/[0.06] transition-all duration-150"
          title={!expanded ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {expanded && <span className="text-[11px] font-body whitespace-nowrap">Logout</span>}
        </button>
      </div>

      {/* ── User card ──────────────────────────────────── */}
      {user && (
        <div className="flex-shrink-0 border-t border-white/[0.06] px-2 py-2.5">
          <div className="flex items-center gap-2.5 px-1">
            {/* Avatar */}
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-display border ${rs.bg} ${rs.color}`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                user.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              )}
            </div>

            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-body text-white/70 truncate leading-tight">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <RoleIcon className={`h-2.5 w-2.5 ${rs.color}`} />
                  <span className={`text-[9px] font-body ${rs.color}`}>{role}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
