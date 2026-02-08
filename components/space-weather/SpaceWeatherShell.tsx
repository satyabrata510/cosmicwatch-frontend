"use client";

/**
 * Space Weather Shell Component
 *
 * A four-tab orchestrator for space weather data: CME, Solar Flares,
 * Geo Storms, and Notifications. Manages state and data fetching for each tab.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertTriangle, Bell, Calendar, Flame, Loader2, Sun } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  fetchCME,
  fetchGeoStorms,
  fetchSolarFlares,
  fetchSpaceWeatherNotifications,
} from "@/services/space-weather";
import type {
  CmeEvent,
  GeoStorm,
  SolarFlare,
  SolarFlareResponse,
  SpaceWeatherNotification,
} from "@/types";
import CmeTimeline from "./CmeTimeline";
import FlareGrid from "./FlareGrid";
import NotificationFeed from "./NotificationFeed";
import StormList from "./StormList";

type Tab = "cme" | "flares" | "storms" | "notifications";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "cme", label: "CME", icon: <Sun className="h-3.5 w-3.5" /> },
  { key: "flares", label: "Solar Flares", icon: <Flame className="h-3.5 w-3.5" /> },
  { key: "storms", label: "Geo Storms", icon: <Activity className="h-3.5 w-3.5" /> },
  { key: "notifications", label: "Alerts", icon: <Bell className="h-3.5 w-3.5" /> },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function SpaceWeatherShell() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("cme");
  const [startDate, setStartDate] = useState(daysAgo(30));
  const [endDate, setEndDate] = useState(today());

  // ── CME ──
  const [cmeEvents, setCmeEvents] = useState<CmeEvent[]>([]);
  const [cmeLoading, setCmeLoading] = useState(false);
  const [cmeError, setCmeError] = useState<string | null>(null);

  // ── Flares ──
  const [flares, setFlares] = useState<SolarFlare[]>([]);
  const [flareSummary, setFlareSummary] = useState<SolarFlareResponse["summary"] | null>(null);
  const [flareLoading, setFlareLoading] = useState(false);
  const [flareError, setFlareError] = useState<string | null>(null);

  // ── Storms ──
  const [storms, setStorms] = useState<GeoStorm[]>([]);
  const [stormLoading, setStormLoading] = useState(false);
  const [stormError, setStormError] = useState<string | null>(null);

  // ── Notifications ──
  const [notifications, setNotifications] = useState<SpaceWeatherNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);

  const params = useMemo(
    () => ({ start_date: startDate, end_date: endDate }),
    [startDate, endDate]
  );

  const loadCme = useCallback(async () => {
    setCmeLoading(true);
    setCmeError(null);
    try {
      const res = await fetchCME(params);
      setCmeEvents(res.events);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load CME data";
      setCmeError(msg);
      toast.error(msg, "CME Data");
    } finally {
      setCmeLoading(false);
    }
  }, [params, toast]);

  const loadFlares = useCallback(async () => {
    setFlareLoading(true);
    setFlareError(null);
    try {
      const res = await fetchSolarFlares(params);
      setFlares(res.events);
      setFlareSummary(res.summary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load solar flare data";
      setFlareError(msg);
      toast.error(msg, "Solar Flares");
    } finally {
      setFlareLoading(false);
    }
  }, [params, toast]);

  const loadStorms = useCallback(async () => {
    setStormLoading(true);
    setStormError(null);
    try {
      const res = await fetchGeoStorms(params);
      setStorms(res.events);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load storm data";
      setStormError(msg);
      toast.error(msg, "Geo Storms");
    } finally {
      setStormLoading(false);
    }
  }, [params, toast]);

  const loadNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const res = await fetchSpaceWeatherNotifications(params);
      setNotifications(res.notifications);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load notifications";
      setNotifError(msg);
      toast.error(msg, "Notifications");
    } finally {
      setNotifLoading(false);
    }
  }, [params, toast]);

  const loaders: Record<Tab, () => Promise<void>> = useMemo(
    () => ({
      cme: loadCme,
      flares: loadFlares,
      storms: loadStorms,
      notifications: loadNotifications,
    }),
    [loadCme, loadFlares, loadStorms, loadNotifications]
  );

  // Load on tab switch
  useEffect(() => {
    loaders[activeTab]();
  }, [activeTab, loaders]);

  function handleSearch() {
    loaders[activeTab]();
  }

  const isLoading =
    activeTab === "cme"
      ? cmeLoading
      : activeTab === "flares"
        ? flareLoading
        : activeTab === "storms"
          ? stormLoading
          : notifLoading;

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
          Space Weather
        </h1>
        <p className="text-secondary text-sm font-body">
          Solar activity, geomagnetic storms &amp; DONKI notifications from NASA
        </p>
      </motion.div>

      {/* Date range + Tab bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-card border border-border p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-body rounded-lg transition-colors ${
                activeTab === tab.key ? "text-foreground" : "text-secondary hover:text-foreground"
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/[0.06] border border-border-hover"
                  layoutId="sw-tab"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-end gap-2 ml-auto">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
              <Calendar className="h-2.5 w-2.5 inline mr-1" />
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 rounded-lg bg-surface border border-border px-3 text-xs text-foreground font-body focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="h-8 px-4 rounded-lg bg-accent text-background text-xs font-body hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "cme" && (
          <motion.div
            key="cme"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {cmeError ? (
              <ErrorCard message={cmeError} />
            ) : (
              <CmeTimeline events={cmeEvents} isLoading={cmeLoading} />
            )}
          </motion.div>
        )}

        {activeTab === "flares" && (
          <motion.div
            key="flares"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {flareError ? (
              <ErrorCard message={flareError} />
            ) : (
              <FlareGrid events={flares} summary={flareSummary} isLoading={flareLoading} />
            )}
          </motion.div>
        )}

        {activeTab === "storms" && (
          <motion.div
            key="storms"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {stormError ? (
              <ErrorCard message={stormError} />
            ) : (
              <StormList events={storms} isLoading={stormLoading} />
            )}
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {notifError ? (
              <ErrorCard message={notifError} />
            ) : (
              <NotificationFeed notifications={notifications} isLoading={notifLoading} />
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
