"use client";

/**
 * CNEOS Shell Component
 *
 * A three-tab orchestrator for CNEOS data: Close Approaches, Sentry Monitor,
 * and Fireballs. Manages state and data fetching for each tab.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Crosshair,
  Filter,
  Flame,
  Loader2,
  Shield,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { fetchCloseApproaches, fetchFireballs, fetchSentryObjects } from "@/services/cneos";
import type { CloseApproach, Fireball, SentryObject } from "@/types";
import ApproachTable from "./ApproachTable";
import FireballGrid from "./FireballGrid";
import SentryTable from "./SentryTable";

type Tab = "approaches" | "sentry" | "fireballs";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "approaches", label: "Close Approaches", icon: <Crosshair className="h-3.5 w-3.5" /> },
  { key: "sentry", label: "Sentry Monitor", icon: <Shield className="h-3.5 w-3.5" /> },
  { key: "fireballs", label: "Fireballs", icon: <Flame className="h-3.5 w-3.5" /> },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}
function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function CneosShell() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("approaches");

  // ── Close Approach state ──
  const [approaches, setApproaches] = useState<CloseApproach[]>([]);
  const [approachLoading, setApproachLoading] = useState(false);
  const [approachError, setApproachError] = useState<string | null>(null);
  const [caDateMin, setCaDateMin] = useState(today());
  const [caDateMax, setCaDateMax] = useState(daysFromNow(60));
  const [caDistMax, setCaDistMax] = useState("10LD");
  const [caPha, setCaPha] = useState(false);

  // ── Sentry state ──
  const [sentryObjects, setSentryObjects] = useState<SentryObject[]>([]);
  const [sentryLoading, setSentryLoading] = useState(false);
  const [sentryError, setSentryError] = useState<string | null>(null);

  // ── Fireball state ──
  const [fireballs, setFireballs] = useState<Fireball[]>([]);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbError, setFbError] = useState<string | null>(null);
  const [fbDateMin, setFbDateMin] = useState(daysFromNow(-365));
  const [fbDateMax, setFbDateMax] = useState(today());
  const [fbEnergyMin, setFbEnergyMin] = useState<string>("");

  // ── Fetchers ──
  const loadApproaches = useCallback(async () => {
    setApproachLoading(true);
    setApproachError(null);
    try {
      const res = await fetchCloseApproaches({
        date_min: caDateMin,
        date_max: caDateMax,
        dist_max: caDistMax,
        pha: caPha || undefined,
      });
      setApproaches(res.approaches);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load close approaches";
      setApproachError(msg);
      toast.error(msg, "Close Approaches");
    } finally {
      setApproachLoading(false);
    }
  }, [caDateMin, caDateMax, caDistMax, caPha, toast]);

  const loadSentry = useCallback(async () => {
    setSentryLoading(true);
    setSentryError(null);
    try {
      const res = await fetchSentryObjects();
      setSentryObjects(res.objects);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load Sentry objects";
      setSentryError(msg);
      toast.error(msg, "Sentry Monitor");
    } finally {
      setSentryLoading(false);
    }
  }, [toast]);

  const loadFireballs = useCallback(async () => {
    setFbLoading(true);
    setFbError(null);
    try {
      const res = await fetchFireballs({
        date_min: fbDateMin,
        date_max: fbDateMax,
        energy_min: fbEnergyMin ? parseFloat(fbEnergyMin) : undefined,
        limit: 50,
        sort: "-date",
      });
      setFireballs(res.fireballs);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load fireballs";
      setFbError(msg);
      toast.error(msg, "Fireballs");
    } finally {
      setFbLoading(false);
    }
  }, [fbDateMin, fbDateMax, fbEnergyMin, toast]);

  // Load on tab switch / mount
  useEffect(() => {
    if (activeTab === "approaches") loadApproaches();
    else if (activeTab === "sentry") loadSentry();
    else if (activeTab === "fireballs") loadFireballs();
  }, [activeTab, loadApproaches, loadFireballs, loadSentry]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground mb-1">
          CNEOS Monitor
        </h1>
        <p className="text-secondary text-sm font-body">
          Close approaches, impact monitoring &amp; fireball events from JPL&apos;s Center for
          Near-Earth Object Studies
        </p>
      </motion.div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 rounded-xl bg-card border border-border p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 text-xs font-body rounded-lg transition-colors ${
              activeTab === tab.key ? "text-foreground" : "text-secondary hover:text-foreground"
            }`}
          >
            {activeTab === tab.key && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-white/[0.06] border border-border-hover"
                layoutId="cneos-tab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "approaches" && (
          <motion.div
            key="approaches"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            <div className="rounded-2xl bg-card border border-border p-4 mb-6">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
                    <Calendar className="h-2.5 w-2.5 inline mr-1" />
                    From
                  </label>
                  <input
                    type="date"
                    value={caDateMin}
                    onChange={(e) => setCaDateMin(e.target.value)}
                    className="h-8 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
                    <Calendar className="h-2.5 w-2.5 inline mr-1" />
                    To
                  </label>
                  <input
                    type="date"
                    value={caDateMax}
                    onChange={(e) => setCaDateMax(e.target.value)}
                    className="h-8 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
                    <Filter className="h-2.5 w-2.5 inline mr-1" />
                    Max Distance
                  </label>
                  <select
                    value={caDistMax}
                    onChange={(e) => setCaDistMax(e.target.value)}
                    className="h-8 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option value="5LD">5 LD</option>
                    <option value="10LD">10 LD</option>
                    <option value="20LD">20 LD</option>
                    <option value="0.05AU">0.05 AU</option>
                    <option value="0.1AU">0.1 AU</option>
                  </select>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-secondary font-body cursor-pointer h-8">
                  <input
                    type="checkbox"
                    checked={caPha}
                    onChange={(e) => setCaPha(e.target.checked)}
                    className="rounded border-border accent-accent"
                  />
                  PHA only
                </label>
                <button
                  onClick={loadApproaches}
                  disabled={approachLoading}
                  className="h-8 px-4 rounded-lg bg-accent text-background text-xs font-body hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {approachLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Search"}
                </button>
              </div>
            </div>

            {approachError ? (
              <ErrorCard message={approachError} />
            ) : (
              <ApproachTable approaches={approaches} isLoading={approachLoading} />
            )}
          </motion.div>
        )}

        {activeTab === "sentry" && (
          <motion.div
            key="sentry"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Summary banner */}
            {!sentryLoading && !sentryError && sentryObjects.length > 0 && (
              <motion.div
                className="rounded-2xl bg-card border border-border p-4 mb-6 flex flex-wrap items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center">
                  <p className="text-2xl font-display text-foreground">{sentryObjects.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Monitored</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-display text-warning">
                    {sentryObjects.filter((o) => o.palermoCumulative > -2).length}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Palermo &gt; -2</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-display text-danger">
                    {sentryObjects.filter((o) => o.torinoMax > 0).length}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Torino &gt; 0</p>
                </div>
              </motion.div>
            )}

            {sentryError ? (
              <ErrorCard message={sentryError} />
            ) : (
              <SentryTable objects={sentryObjects} isLoading={sentryLoading} />
            )}
          </motion.div>
        )}

        {activeTab === "fireballs" && (
          <motion.div
            key="fireballs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            <div className="rounded-2xl bg-card border border-border p-4 mb-6">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
                    <Calendar className="h-2.5 w-2.5 inline mr-1" />
                    From
                  </label>
                  <input
                    type="date"
                    value={fbDateMin}
                    onChange={(e) => setFbDateMin(e.target.value)}
                    className="h-8 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
                    <Calendar className="h-2.5 w-2.5 inline mr-1" />
                    To
                  </label>
                  <input
                    type="date"
                    value={fbDateMax}
                    onChange={(e) => setFbDateMax(e.target.value)}
                    className="h-8 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
                    <Zap className="h-2.5 w-2.5 inline mr-1" />
                    Min Energy (kt)
                  </label>
                  <input
                    type="number"
                    value={fbEnergyMin}
                    onChange={(e) => setFbEnergyMin(e.target.value)}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    className="h-8 w-24 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors tabular-nums"
                  />
                </div>
                <button
                  onClick={loadFireballs}
                  disabled={fbLoading}
                  className="h-8 px-4 rounded-lg bg-accent text-background text-xs font-body hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {fbLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Search"}
                </button>
              </div>
            </div>

            {fbError ? (
              <ErrorCard message={fbError} />
            ) : (
              <FireballGrid fireballs={fireballs} isLoading={fbLoading} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-danger/5 border border-danger/20 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-danger mx-auto mb-3" />
      <p className="text-danger font-body text-sm">{message}</p>
    </div>
  );
}
