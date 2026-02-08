"use client";

/**
 * Fireball Grid Component
 *
 * Displays fireball (bolide) events in a grid layout.
 * Visualizes impact energy and provides location details.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Gauge, MapPin, Mountain, Zap } from "lucide-react";
import type { Fireball } from "@/types";

interface Props {
  fireballs: Fireball[];
  isLoading: boolean;
}

/** Energy in kilotons — max for bar normalization */
const MAX_ENERGY_KT = 10;

function energyColor(kt: number): string {
  if (kt >= 5) return "from-danger to-orange-500";
  if (kt >= 1) return "from-warning to-orange-400";
  if (kt >= 0.1) return "from-accent to-info";
  return "from-info to-accent/50";
}

function energyLabel(kt: number): string {
  if (kt >= 5) return "Major";
  if (kt >= 1) return "Significant";
  if (kt >= 0.1) return "Moderate";
  return "Minor";
}

export default function FireballGrid({ fireballs, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!fireballs.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <Flame className="h-8 w-8 text-warning mx-auto mb-3 opacity-40" />
        <p className="text-secondary font-body text-sm">
          No fireball events found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {fireballs.map((fb, i) => {
          const energy = fb.impactEnergy;
          const barWidth = Math.min((energy / MAX_ENERGY_KT) * 100, 100);

          return (
            <motion.div
              key={`${fb.date}-${i}`}
              className="group relative rounded-2xl bg-card border border-border p-5 overflow-hidden transition-colors hover:border-border-hover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              {/* Ambient glow */}
              <div
                className={`absolute -top-12 -right-12 h-24 w-24 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${
                  energy >= 1 ? "bg-warning" : "bg-accent"
                }`}
              />

              <div className="relative z-10">
                {/* Date + energy badge */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display text-sm text-foreground">
                      {formatFireballDate(fb.date)}
                    </p>
                    <p className="text-[10px] text-muted font-body mt-0.5">
                      {formatFireballTime(fb.date)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono rounded-full px-2 py-0.5 border ${
                      energy >= 1
                        ? "bg-warning/10 border-warning/20 text-warning"
                        : "bg-accent/10 border-accent/20 text-accent"
                    }`}
                  >
                    {energyLabel(energy)}
                  </span>
                </div>

                {/* Energy bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-muted mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" /> Impact Energy
                    </span>
                    <span className="tabular-nums text-secondary">{energy.toFixed(2)} kt</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${energyColor(energy)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: i * 0.04 + 0.3, duration: 0.7 }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 text-xs font-body">
                  {fb.velocity !== null && (
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Gauge className="h-3 w-3 text-info" />
                      <span className="tabular-nums">{fb.velocity.toFixed(1)} km/s</span>
                    </div>
                  )}
                  {fb.altitude !== null && (
                    <div className="flex items-center gap-1.5 text-secondary">
                      <Mountain className="h-3 w-3 text-accent" />
                      <span className="tabular-nums">{fb.altitude.toFixed(1)} km alt</span>
                    </div>
                  )}
                </div>

                {/* Location */}
                {fb.location && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[10px] text-muted">
                    <MapPin className="h-3 w-3 text-warning" />
                    <span className="truncate">{fb.location}</span>
                  </div>
                )}

                {/* Radiated energy chip */}
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
                  <Flame className="h-2.5 w-2.5 text-orange-400" />
                  <span className="tabular-nums">
                    Radiated: {fb.totalRadiatedEnergy.toExponential(2)} J
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function formatFireballDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatFireballTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "";
  }
}
