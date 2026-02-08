"use client";

/**
 * Admin Panel Shell
 *
 * The main dashboard for administrators. Provides a system overview, health checks,
 * and role-based access control (RBAC) information. Accessible only to users with the ADMIN role.
 */

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  CloudSun,
  Crown,
  Database,
  Eye,
  FlaskConical,
  Lock,
  MessageSquare,
  Server,
  Settings,
  Shield,
  Telescope,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { usePermission } from "@/lib/hooks/usePermission";
import { useAuthStore } from "@/stores/auth-store";

const ROLE_PERMS = [
  {
    role: "ADMIN",
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    perms: [
      "Full CRUD + Manage on all resources",
      "Access Admin Panel",
      "Manage users, watchlist, alerts",
      "Moderate chat messages",
      "Manage NEO data & risk analysis",
    ],
  },
  {
    role: "RESEARCHER",
    icon: FlaskConical,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    perms: [
      "Full CRUD on watchlist & alerts",
      "Read NEO data & risk analysis",
      "Create & read chat messages",
      "Read & update own profile",
      "No admin panel access",
    ],
  },
  {
    role: "USER",
    icon: User,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    perms: [
      "Create, read & delete watchlist items",
      "Read & mark alerts as read",
      "Read NEO data & risk analysis",
      "Create & read chat messages",
      "No alert creation or admin access",
    ],
  },
];

const SYSTEM_MODULES = [
  { name: "NEO Feed", icon: Telescope, status: "Online", endpoint: "/api/v1/neo" },
  { name: "Watchlist", icon: Eye, status: "Online", endpoint: "/api/v1/watchlist" },
  { name: "Alerts", icon: Bell, status: "Online", endpoint: "/api/v1/alerts" },
  {
    name: "Chat (WebSocket)",
    icon: MessageSquare,
    status: "Online",
    endpoint: "ws://localhost:4000",
  },
  { name: "Space Weather", icon: CloudSun, status: "Online", endpoint: "/api/v1/space-weather" },
  {
    name: "Risk Engine",
    icon: AlertTriangle,
    status: "Online",
    endpoint: "http://risk-engine:8000",
  },
  { name: "CNEOS / Sentry", icon: Shield, status: "Online", endpoint: "/api/v1/cneos" },
  { name: "Auth & RBAC", icon: Lock, status: "Active", endpoint: "/api/v1/auth" },
];

export default function AdminShell() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { can } = usePermission();
  const canAccessAdmin = can("admin_panel", "read");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !canAccessAdmin)) {
      toast.error("Access denied. Admin role required.", "Admin Panel");
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, canAccessAdmin, router, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-10 w-64 rounded-xl bg-card animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !canAccessAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20">
            <Settings className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl tracking-tight text-foreground">Admin Panel</h1>
            <p className="text-secondary text-xs font-body">
              System overview and role-based access control
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {[
          { label: "Active Modules", value: "9", icon: Server, color: "text-accent" },
          { label: "Auth Method", value: "JWT + RBAC", icon: Lock, color: "text-amber-400" },
          { label: "Role Types", value: "3", icon: Users, color: "text-blue-400" },
          { label: "Your Role", value: user?.role ?? "—", icon: Crown, color: "text-amber-400" },
        ].map((stat, _i) => (
          <div key={stat.label} className="rounded-2xl bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-[10px] text-muted font-body uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <p className="font-display text-xl text-foreground">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* System modules health */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent" />
          System Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SYSTEM_MODULES.map((mod) => (
            <div
              key={mod.name}
              className="rounded-2xl bg-card border border-border p-4 group hover:border-border-hover transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-white/[0.04] p-2">
                  <mod.icon className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-body text-foreground truncate">{mod.name}</p>
                  <p className="text-[9px] font-body text-muted truncate">{mod.endpoint}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-body text-emerald-400">{mod.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* RBAC Permission Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          RBAC Permission Matrix
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ROLE_PERMS.map((rp) => (
            <div key={rp.role} className={`rounded-2xl border p-5 ${rp.bg}`}>
              <div className="flex items-center gap-2 mb-4">
                <rp.icon className={`h-5 w-5 ${rp.color}`} />
                <h3 className={`font-display text-sm ${rp.color}`}>{rp.role}</h3>
              </div>
              <ul className="space-y-2">
                {rp.perms.map((perm) => (
                  <li key={perm} className="flex items-start gap-2 text-xs font-body text-white/60">
                    <span
                      className={`mt-0.5 h-1 w-1 rounded-full flex-shrink-0 ${rp.color.replace("text-", "bg-")}`}
                    />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Database info */}
      <motion.div
        className="mt-8 rounded-2xl bg-card border border-border p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-accent" />
          Infrastructure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-body">
          <div>
            <p className="text-muted mb-1">Database</p>
            <p className="text-foreground">PostgreSQL 18 (Docker)</p>
          </div>
          <div>
            <p className="text-muted mb-1">Risk Engine</p>
            <p className="text-foreground">Python 3.12 FastAPI</p>
          </div>
          <div>
            <p className="text-muted mb-1">Backend</p>
            <p className="text-foreground">Node.js 22 + Express</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
