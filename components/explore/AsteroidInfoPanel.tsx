"use client";

/**
 * Asteroid Info Panel
 *
 * A heads-up display (HUD) overlay that shows detailed information about a selected asteroid.
 * Includes data on diameter, velocity, miss distance, and approach date.
 */

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Gauge, Orbit, Ruler, X } from "lucide-react";
import Link from "next/link";

export interface AsteroidData {
  id: string;
  name: string;
  hazardous: boolean;
  diameterMin: number;
  diameterMax: number;
  velocity: number;
  missDistance: number;
  approachDate: string;
  orbitRadius: number;
}

interface Props {
  asteroid: AsteroidData | null;
  onClose: () => void;
}

export default function AsteroidInfoPanel({ asteroid, onClose }: Props) {
  return (
    <AnimatePresence>
      {asteroid && (
        <motion.div
          className="absolute top-4 right-4 z-20 w-72 rounded-2xl bg-black/80 border border-white/10 backdrop-blur-xl p-5"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-sm text-white tracking-wide">{asteroid.name}</h3>
              {asteroid.hazardous && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-body">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  HAZARDOUS
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="space-y-2.5 text-[11px] font-body">
            <div className="flex items-center gap-2 text-white/60">
              <Ruler className="h-3 w-3 text-blue-400 flex-shrink-0" />
              <span>Diameter</span>
              <span className="ml-auto text-white/90 tabular-nums">
                {asteroid.diameterMin.toFixed(0)}–{asteroid.diameterMax.toFixed(0)} m
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <Gauge className="h-3 w-3 text-cyan-400 flex-shrink-0" />
              <span>Velocity</span>
              <span className="ml-auto text-white/90 tabular-nums">
                {Number(asteroid.velocity).toLocaleString()} km/h
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <Orbit className="h-3 w-3 text-purple-400 flex-shrink-0" />
              <span>Miss Distance</span>
              <span className="ml-auto text-white/90 tabular-nums">
                {Number(asteroid.missDistance).toLocaleString()} km
              </span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <span className="h-3 w-3 text-emerald-400 flex-shrink-0 text-center">📅</span>
              <span>Approach</span>
              <span className="ml-auto text-white/90">{asteroid.approachDate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Link
              href={`/neo/${asteroid.id}`}
              className="flex-1 text-center py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-body text-white/70 hover:text-white hover:border-white/20 transition-colors"
            >
              NEO Detail
            </Link>
            <Link
              href={`/risk/${asteroid.id}`}
              className="flex-1 text-center py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-body text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Risk Analysis
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
