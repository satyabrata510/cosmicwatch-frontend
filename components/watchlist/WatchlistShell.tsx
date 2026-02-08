"use client";

/**
 * Watchlist Shell Component
 *
 * Displays the user's tracked asteroids with options to remove details
 * and navigate to the full NEO detail view.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Check,
  Eye,
  Loader2,
  Orbit,
  Plus,
  Settings,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { usePermission } from "@/lib/hooks/usePermission";
import { useWatchlistStore } from "@/stores/watchlist-store";
import type { Role, WatchlistItem } from "@/types";

// ── Role display config (cosmetic only — NOT access control) ──
const ROLE_BADGE: Record<Role, string> = {
  ADMIN: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  RESEARCHER: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  USER: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function WatchlistShell() {
  const { items, isLoading, error, load, remove, update } = useWatchlistStore();
  const toast = useToast();
  const { can, role } = usePermission();
  const canUpdateWatchlist = can("watchlist", "update");
  const canDeleteWatchlist = can("watchlist", "delete");
  const canManageWatchlist = can("watchlist", "manage");

  // ── Edit state ────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlert, setEditAlert] = useState(true);
  const [editDistance, setEditDistance] = useState(7_500_000);
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = useCallback((item: WatchlistItem) => {
    setEditingId(item.asteroidId);
    setEditAlert(item.alertOnApproach);
    setEditDistance(item.alertDistanceKm);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingId(null);
    setIsSaving(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      await update(editingId, {
        alertOnApproach: editAlert,
        alertDistanceKm: editDistance,
      });
      toast.success("Alert settings updated", "Watchlist");
      closeEdit();
    } catch {
      toast.error("Failed to update settings", "Watchlist");
      setIsSaving(false);
    }
  }, [editingId, editAlert, editDistance, update, toast, closeEdit]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (error) toast.error(error, "Watchlist");
  }, [error, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground mb-1">
              Watchlist
            </h1>
            <p className="text-secondary text-sm font-body">
              Asteroids you&apos;re tracking — get notified on close approaches
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[9px] font-body px-2 py-1 rounded-full border ${
              ROLE_BADGE[role ?? "USER"]
            }`}
          >
            {role}
          </span>
        </div>
        {canManageWatchlist && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-body px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning">
            <Shield className="h-3 w-3" />
            Admin — managing all watchlists
          </span>
        )}
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
      {!isLoading && !error && items.length === 0 && (
        <motion.div
          className="rounded-2xl bg-card border border-border p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Eye className="h-10 w-10 text-accent/30 mx-auto mb-4" />
          <h3 className="font-display text-lg text-foreground mb-2">No asteroids tracked yet</h3>
          <p className="text-secondary text-sm font-body mb-4">
            Browse NEOs and add them to your watchlist to receive approach alerts.
          </p>
          <Link
            href="/neo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-background text-xs font-body hover:bg-accent-hover transition-colors"
          >
            <Plus className="h-3 w-3" />
            Browse NEOs
          </Link>
        </motion.div>
      )}

      {/* List */}
      {!isLoading && items.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const isEditing = editingId === item.asteroidId;

              return (
                <motion.div
                  key={item.id}
                  className="group relative rounded-2xl bg-card border border-border p-5 overflow-hidden transition-colors hover:border-border-hover"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  layout
                >
                  {/* Hover glow */}
                  <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex items-center gap-4">
                    {/* Icon */}
                    <div className="rounded-xl bg-accent/10 border border-accent/20 p-3 flex-shrink-0">
                      <Orbit className="h-5 w-5 text-accent" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/neo/${item.asteroidId}`}
                        className="font-display text-sm text-foreground hover:text-accent transition-colors block truncate"
                      >
                        {item.asteroidName}
                      </Link>
                      <p className="text-[10px] text-muted font-body mt-0.5">
                        ID: {item.asteroidId} · Tracked since {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {/* Alert config */}
                    <div className="hidden sm:flex items-center gap-3 text-xs font-body">
                      <div className="flex items-center gap-1">
                        <Bell
                          className={`h-3 w-3 ${item.alertOnApproach ? "text-warning" : "text-muted"}`}
                        />
                        <span className={item.alertOnApproach ? "text-warning" : "text-muted"}>
                          {item.alertOnApproach ? "On" : "Off"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        <Shield className="h-3 w-3 text-info" />
                        <span className="tabular-nums">
                          {formatDistanceKm(item.alertDistanceKm)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {canUpdateWatchlist && (
                        <button
                          onClick={() => (isEditing ? closeEdit() : openEdit(item))}
                          className={`rounded-lg border px-3 py-1.5 text-[10px] font-body inline-flex items-center gap-1 transition-colors ${
                            isEditing
                              ? "bg-accent/10 border-accent/30 text-accent"
                              : "bg-white/[0.04] border-border text-secondary hover:text-accent hover:border-accent/30"
                          }`}
                          title="Edit alert settings"
                        >
                          <Settings className="h-3 w-3" />
                          {isEditing ? "Close" : "Edit"}
                        </button>
                      )}
                      <Link
                        href={`/risk/${item.asteroidId}`}
                        className="rounded-lg bg-white/[0.04] border border-border px-3 py-1.5 text-[10px] text-accent hover:text-accent-hover hover:border-accent/30 transition-colors font-body"
                      >
                        Risk
                      </Link>
                      {canDeleteWatchlist && (
                        <button
                          onClick={() => remove(item.asteroidId)}
                          className="rounded-lg bg-danger/5 border border-danger/20 px-3 py-1.5 text-[10px] text-danger hover:bg-danger/10 transition-colors"
                          title="Remove from watchlist"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Inline edit panel ─────────────────── */}
                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        className="relative z-10 mt-4 pt-4 border-t border-border"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-[10px] uppercase tracking-wider text-muted font-body mb-3">
                          Alert Settings
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Toggle approach alerts */}
                          <label className="flex items-center gap-2 cursor-pointer">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={editAlert}
                              onClick={() => setEditAlert(!editAlert)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                editAlert ? "bg-accent" : "bg-white/10"
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                                  editAlert ? "translate-x-[18px]" : "translate-x-[3px]"
                                }`}
                              />
                            </button>
                            <span className="text-xs font-body text-secondary">
                              Alert on approach
                            </span>
                          </label>

                          {/* Distance threshold */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-body text-secondary">Distance:</span>
                            <select
                              value={editDistance}
                              onChange={(e) => setEditDistance(Number(e.target.value))}
                              className="bg-black/40 border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground font-body focus:outline-none focus:border-accent/50 transition-colors"
                            >
                              <option value={1_000_000}>1M km</option>
                              <option value={2_500_000}>2.5M km</option>
                              <option value={5_000_000}>5M km</option>
                              <option value={7_500_000}>7.5M km (default)</option>
                              <option value={10_000_000}>10M km</option>
                              <option value={15_000_000}>15M km</option>
                              <option value={20_000_000}>20M km</option>
                            </select>
                          </div>

                          {/* Save / Cancel */}
                          <div className="flex items-center gap-2 sm:ml-auto">
                            <button
                              onClick={closeEdit}
                              className="rounded-lg border border-border px-3 py-1.5 text-[10px] text-secondary hover:text-foreground transition-colors font-body inline-flex items-center gap-1"
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </button>
                            <button
                              onClick={saveEdit}
                              disabled={isSaving}
                              className="rounded-lg bg-accent px-3 py-1.5 text-[10px] text-background hover:bg-accent-hover transition-colors font-body inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              {isSaving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              Save
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDistanceKm(km: number) {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(1)}M km`;
  return `${(km / 1000).toFixed(0)}K km`;
}
