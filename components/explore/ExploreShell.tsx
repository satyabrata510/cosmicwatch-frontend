"use client";

/**
 * 3D Orbit Explorer Shell
 *
 * An interactive 3D visualization of Near-Earth Objects (NEOs) orbiting Earth.
 * Uses NASA data to populate asteroid objects and their orbital paths.
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Crosshair,
  Eye,
  Globe,
  Info,
  Loader2,
  Orbit,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useNeoStore } from "@/stores/neo-store";
import type { AsteroidData } from "./AsteroidInfoPanel";
import AsteroidInfoPanel from "./AsteroidInfoPanel";

const SolarSystemScene = lazy(() => import("./SolarSystemScene"));

export default function ExploreShell() {
  const toast = useToast();
  const { neos, isLoading, error, loadFeed } = useNeoStore();
  const [selected, setSelected] = useState<AsteroidData | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    if (neos.length === 0 && !isLoading) {
      loadFeed();
    }
  }, [isLoading, loadFeed, neos.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) toast.error(error, "NEO Data");
  }, [error, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-hide help after 6s
  useEffect(() => {
    const t = setTimeout(() => setShowHelp(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const handleSelectAsteroid = useCallback((data: AsteroidData) => {
    setSelected(data);
  }, []);

  const hazardousCount = neos.filter((n) => n.is_potentially_hazardous_asteroid).length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-blue-400" />
          <div>
            <h1 className="font-display text-sm tracking-wide text-white/90">3D Orbit Explorer</h1>
            <p className="text-[10px] font-body text-white/30">
              Near-Earth Object visualization powered by NASA data
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats */}
          {!isLoading && neos.length > 0 && (
            <motion.div
              className="hidden sm:flex items-center gap-4 text-[10px] font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="flex items-center gap-1.5 text-white/40">
                <Orbit className="h-3 w-3 text-accent" />
                {neos.length} objects
              </span>
              <span className="flex items-center gap-1.5 text-white/40">
                <AlertTriangle className="h-3 w-3 text-red-400" />
                {hazardousCount} hazardous
              </span>
            </motion.div>
          )}

          {/* Refresh */}
          <button
            onClick={() => loadFeed()}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors disabled:opacity-30"
            title="Refresh data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Back to dashboard */}
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-body text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Bottom controls help */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 px-5 py-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-[10px] font-body text-white/40">
              <Crosshair className="h-3 w-3 text-cyan-400" />
              Click asteroid for details
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-body text-white/40">
              <Eye className="h-3 w-3 text-purple-400" />
              Scroll to zoom · Drag to orbit
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] font-body text-white/40">
              <Info className="h-3 w-3 text-emerald-400" />
              Red rings = hazardous
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected asteroid info panel */}
      <AsteroidInfoPanel asteroid={selected} onClose={() => setSelected(null)} />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
            <p className="text-[11px] font-body text-white/40">Loading NEO data from NASA...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <p className="text-sm font-body text-red-300">{error}</p>
            <button
              onClick={() => loadFeed()}
              className="mt-2 px-4 py-1.5 rounded-lg bg-accent/20 text-accent text-[11px] font-body hover:bg-accent/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      {!error && (
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
            </div>
          }
        >
          <SolarSystemScene neos={neos} onSelectAsteroid={handleSelectAsteroid} />
        </Suspense>
      )}
    </div>
  );
}
