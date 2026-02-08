/**
 * Role-Based Access Control (RBAC)
 *
 * Defines the application's permission matrix and provides
 * helpers for authorizing user actions.
 */

import type { Role } from "@/types";

export type Action = "create" | "read" | "update" | "delete" | "manage";
export type Resource =
  | "users"
  | "watchlist"
  | "alerts"
  | "neo_data"
  | "chat"
  | "admin_panel"
  | "risk_analysis";

type PermissionMatrix = Record<Role, Partial<Record<Resource, Action[]>>>;

const PERMISSIONS: PermissionMatrix = {
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

/**
 * Check if a role has a specific permission on a resource.
 * "manage" acts as a wildcard — grants all actions on that resource.
 */
export function hasPermission(role: Role | undefined, resource: Resource, action: Action): boolean {
  if (!role) return false;
  const actions = PERMISSIONS[role]?.[resource];
  if (!actions) return false;
  return actions.includes(action) || actions.includes("manage");
}

/** Shorthand: can this role perform any of the given actions? */
export function hasAnyPermission(
  role: Role | undefined,
  resource: Resource,
  actions: Action[]
): boolean {
  return actions.some((a) => hasPermission(role, resource, a));
}

/** Check if the role is at least the given level */
export function isAtLeast(role: Role | undefined, minRole: Role): boolean {
  if (!role) return false;
  const hierarchy: Role[] = ["USER", "RESEARCHER", "ADMIN"];
  return hierarchy.indexOf(role) >= hierarchy.indexOf(minRole);
}
