/**
 * useRole Hook
 *
 * Maps backend RBAC permissions to frontend UI gating logic.
 * Provides boolean flags for common access checks.
 */

import { useAuthStore } from "@/stores/auth-store";
import type { Role } from "@/types";

type Action = "create" | "read" | "update" | "delete" | "manage";
type Resource =
  | "users"
  | "watchlist"
  | "alerts"
  | "neo_data"
  | "chat"
  | "admin_panel"
  | "risk_analysis";

/** Mirrors the backend RBAC permission matrix exactly */
const PERMISSIONS: Record<Role, Partial<Record<Resource, Action[]>>> = {
  ADMIN: {
    users: ["create", "read", "update", "delete", "manage"],
    watchlist: ["create", "read", "update", "delete", "manage"],
    alerts: ["create", "read", "update", "delete", "manage"],
    neo_data: ["read", "manage"],
    chat: ["create", "read", "update", "delete", "manage"],
    admin_panel: ["read", "manage"],
    risk_analysis: ["read", "manage"],
  },
  RESEARCHER: {
    users: ["read", "update"],
    watchlist: ["create", "read", "update", "delete"],
    alerts: ["create", "read", "update", "delete"],
    neo_data: ["read"],
    chat: ["create", "read"],
    risk_analysis: ["read"],
  },
  USER: {
    users: ["read", "update"],
    watchlist: ["create", "read", "delete"],
    alerts: ["read", "update"],
    neo_data: ["read"],
    chat: ["create", "read"],
    risk_analysis: ["read"],
  },
};

function checkPermission(role: Role, resource: Resource, action: Action): boolean {
  const actions = PERMISSIONS[role]?.[resource];
  if (!actions) return false;
  return actions.includes(action) || actions.includes("manage");
}

export function useRole() {
  const { user } = useAuthStore();
  const role: Role = user?.role ?? "USER";

  return {
    role,
    isAdmin: role === "ADMIN",
    isResearcher: role === "RESEARCHER",
    isUser: role === "USER",

    /** Check if user can perform action on resource */
    can: (resource: Resource, action: Action) => checkPermission(role, resource, action),

    // ── Convenience shortcuts ────────────────────────────
    canCreateAlerts: checkPermission(role, "alerts", "create"),
    canDeleteAlerts: checkPermission(role, "alerts", "delete"),
    canUpdateWatchlist: checkPermission(role, "watchlist", "update"),
    canDeleteWatchlist: checkPermission(role, "watchlist", "delete"),
    canManageUsers: checkPermission(role, "users", "manage"),
    canAccessAdmin: checkPermission(role, "admin_panel", "read"),
    canManageChat: checkPermission(role, "chat", "manage"),
  };
}
