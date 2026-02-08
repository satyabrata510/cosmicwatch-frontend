"use client";

/**
 * Alerts Shell Component
 *
 * The main alerts page component. Displays a list of alerts with filtering options
 * (all/unread), and allows marking alerts as read.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BellOff,
  Check,
  CheckCheck,
  Eye,
  Loader2,
  Orbit,
  Shield,
  Target,
  type Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { usePermission } from "@/lib/hooks/usePermission";
import { useAlertsStore } from "@/stores/alerts-store";
import type { Alert, AlertType, RiskLevel } from "@/types";

const ALERT_TYPE_META: Record<AlertType, { label: string; icon: typeof Zap; color: string }> = {
  CLOSE_APPROACH: { label: "Close Approach", icon: Target, color: "text-warning" },
  HAZARDOUS_DETECTED: { label: "Hazardous", icon: AlertTriangle, color: "text-danger" },
  WATCHLIST_UPDATE: { label: "Watchlist", icon: Eye, color: "text-info" },
};

const RISK_COLOR: Record<RiskLevel, string> = {
  LOW: "text-info bg-info/10 border-info/20",
  MEDIUM: "text-warning bg-warning/10 border-warning/20",
  HIGH: "text-danger bg-danger/10 border-danger/20",
  CRITICAL: "text-danger bg-danger/20 border-danger/30",
};

type Filter = "all" | "unread";

export default function AlertsShell() {
  const { alerts, unreadCount, isLoading, error, load, loadUnread, markRead, markAllRead } =
    useAlertsStore();
  const toast = useToast();
  const { can } = usePermission();
  const canDeleteAlerts = can("alerts", "delete");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    load();
    loadUnread();
  }, [load, loadUnread]);

  useEffect(() => {
    if (error) toast.error(error, "Alerts");
  }, [error, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayed = filter === "unread" ? alerts.filter((a) => !a.isRead) : alerts;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground mb-1">
              Alerts
            </h1>
            <p className="text-secondary text-sm font-body">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up — no unread alerts"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canDeleteAlerts && alerts.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-body px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning">
                <Shield className="h-3 w-3" />
                Full access
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mt-4 p-1 rounded-lg bg-card border border-border w-fit">
          {(["all", "unread"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-body rounded-md transition-colors capitalize ${
                filter === f ? "bg-accent text-background" : "text-secondary hover:text-foreground"
              }`}
            >
              {f === "all" ? `All (${alerts.length})` : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl bg-danger/5 border border-danger/20 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-danger mx-auto mb-3" />
          <p className="text-danger font-body text-sm">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && displayed.length === 0 && (
        <motion.div
          className="rounded-2xl bg-card border border-border p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BellOff className="h-10 w-10 text-accent/30 mx-auto mb-4" />
          <h3 className="font-display text-lg text-foreground mb-2">
            {filter === "unread" ? "No unread alerts" : "No alerts yet"}
          </h3>
          <p className="text-secondary text-sm font-body">
            {filter === "unread"
              ? "All alerts have been read. Switch to All to see history."
              : "Add asteroids to your watchlist to receive approach and hazard alerts."}
          </p>
        </motion.div>
      )}

      {/* Alert list */}
      {!isLoading && displayed.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayed.map((alert, i) => (
              <AlertRow key={alert.id} alert={alert} index={i} onMarkRead={markRead} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ── Single Alert Row ─────────────────────────────────── */

function AlertRow({
  alert,
  index,
  onMarkRead,
}: {
  alert: Alert;
  index: number;
  onMarkRead: (id: string) => void;
}) {
  const meta = ALERT_TYPE_META[alert.alertType] ?? ALERT_TYPE_META.CLOSE_APPROACH;
  const Icon = meta.icon;
  const riskCls = RISK_COLOR[alert.riskLevel] ?? RISK_COLOR.LOW;

  return (
    <motion.div
      className={`group relative rounded-2xl border p-4 sm:p-5 transition-colors overflow-hidden ${
        alert.isRead ? "bg-card/60 border-border" : "bg-card border-accent/20"
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      layout
    >
      {/* Unread indicator bar */}
      {!alert.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-l-2xl" />
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Type icon */}
        <div className={`rounded-xl p-2.5 flex-shrink-0 ${meta.color.replace("text-", "bg-")}/10`}>
          <Icon className={`h-4 w-4 ${meta.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase tracking-wider font-body ${meta.color}`}>
              {meta.label}
            </span>
            <span
              className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border font-body ${riskCls}`}
            >
              {alert.riskLevel}
            </span>
          </div>

          <p
            className={`text-sm font-body leading-relaxed mb-1.5 ${alert.isRead ? "text-secondary" : "text-foreground"}`}
          >
            {alert.message}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted font-body">
            <Link
              href={`/neo/${alert.asteroidId}`}
              className="inline-flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
            >
              <Orbit className="h-3 w-3" />
              {alert.asteroidName}
            </Link>
            <span>·</span>
            <span>{formatDate(alert.createdAt)}</span>
            {alert.approachDate && (
              <>
                <span>·</span>
                <span>Approach: {alert.approachDate}</span>
              </>
            )}
            {alert.missDistanceKm > 0 && (
              <>
                <span>·</span>
                <span className="tabular-nums">{formatDist(alert.missDistanceKm)}</span>
              </>
            )}
          </div>
        </div>

        {/* Mark read button */}
        {!alert.isRead && (
          <button
            onClick={() => onMarkRead(alert.id)}
            className="flex-shrink-0 rounded-lg p-2 text-accent/60 hover:text-accent hover:bg-accent/10 transition-colors"
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function formatDist(km: number) {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(1)}M km`;
  return `${(km / 1000).toFixed(0)}K km`;
}
