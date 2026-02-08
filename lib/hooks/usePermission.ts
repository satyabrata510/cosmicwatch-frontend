"use client";

/**
 * usePermission Hook
 *
 * A reactive hook that binds Role-Based Access Control (RBAC) checks
 * to the current authenticated user's role.
 */

import { type Action, hasAnyPermission, hasPermission, isAtLeast, type Resource } from "@/lib/rbac";
import { useAuthStore } from "@/stores/auth-store";
import type { Role } from "@/types";

/**
 * Returns permission-check helpers bound to the current user's role.
 *
 * All access-control decisions **must** go through `can()` or `canAny()`
 * so the permission matrix remains the single source of truth.
 *
 * @example
 * const { can, canAny, role } = usePermission();
 * if (can("alerts", "create")) { // show create alert button }
 */
export function usePermission() {
  const role = useAuthStore((s) => s.user?.role);

  return {
    /** Raw role string — use for display / cosmetic purposes ONLY */
    role,
    /** Check if the current user can perform `action` on `resource` */
    can: (resource: Resource, action: Action) => hasPermission(role, resource, action),
    /** Check if the current user can perform ANY of `actions` on `resource` */
    canAny: (resource: Resource, actions: Action[]) => hasAnyPermission(role, resource, actions),
    /** Hierarchy check — `isAtLeast("RESEARCHER")` = true for RESEARCHER & ADMIN */
    isAtLeast: (minRole: Role) => isAtLeast(role, minRole),
  };
}
