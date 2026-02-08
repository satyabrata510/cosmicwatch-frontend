"use client";

/**
 * Permission Guard Component
 *
 * A declarative wrapper that renders its children only if the current user
 * possesses the required permissions or role. Renders a fallback otherwise.
 */

import type { ReactNode } from "react";
import { usePermission } from "@/lib/hooks/usePermission";
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

interface Props {
  /** The resource to check */
  resource?: Resource;
  /** Single action to check */
  action?: Action;
  /** Multiple actions — passes if user can do ANY of them */
  anyAction?: Action[];
  /** Alternative: require a minimum role level */
  minRole?: Role;
  /** Rendered when permission is denied (defaults to nothing) */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the user has the required permission.
 *
 * @example
 * <RequirePermission resource="alerts" action="create">
 *   <CreateAlertButton />
 * </RequirePermission>
 *
 * @example
 * <RequirePermission minRole="ADMIN">
 *   <AdminPanel />
 * </RequirePermission>
 */
export default function RequirePermission({
  resource,
  action,
  anyAction,
  minRole,
  fallback = null,
  children,
}: Props) {
  const { can, canAny, isAtLeast } = usePermission();

  let allowed = false;

  if (minRole) {
    allowed = isAtLeast(minRole);
  } else if (resource && anyAction) {
    allowed = canAny(resource, anyAction);
  } else if (resource && action) {
    allowed = can(resource, action);
  }

  return allowed ? children : fallback;
}
