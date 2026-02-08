"use client";

/**
 * Geomagnetic Storm List Component
 *
 * Lists geomagnetic storm events with Kp index gauges and temporal readings.
 * Visualizes storm intensity using color-coded metrics.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Activity, ExternalLink } from "lucide-react";
import type { GeoStorm } from "@/types";

interface Props {
  events: GeoStorm[];
  isLoading: boolean;
}

/** Color by Kp / storm level */
function kpColor(kp: number): string {
  if (kp >= 9) return "text-danger";
  if (kp >= 7) return "text-orange-400";
  if (kp >= 5) return "text-warning";
  return "text-accent";
}

function kpBg(kp: number): string {
  if (kp >= 9) return "bg-danger";
  if (kp >= 7) return "bg-orange-400";
  if (kp >= 5) return "bg-warning";
  return "bg-accent";
}

function kpGlow(kp: number): string {
  if (kp >= 9) return "bg-danger/20";
  if (kp >= 7) return "bg-orange-400/15";
  if (kp >= 5) return "bg-warning/10";
  return "bg-accent/10";
}

export default function StormList({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <Activity className="h-8 w-8 text-accent mx-auto mb-3 opacity-40" />
        <p className="text-secondary font-body text-sm">
          No geomagnetic storm events found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {events.map((storm, i) => (
          <motion.div
            key={storm.stormId}
            className="group relative rounded-2xl bg-card border border-border p-5 overflow-hidden transition-colors hover:border-border-hover"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            {/* Ambient glow */}
            <div
              className={`absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${kpGlow(storm.maxKpIndex)}`}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {/* Kp gauge */}
                  <div className="relative h-14 w-14 flex-shrink-0">
                    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${(storm.maxKpIndex / 9) * 150.8} 150.8`}
                        className={kpColor(storm.maxKpIndex)}
                        initial={{ strokeDasharray: "0 150.8" }}
                        animate={{ strokeDasharray: `${(storm.maxKpIndex / 9) * 150.8} 150.8` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`font-display text-lg ${kpColor(storm.maxKpIndex)}`}>
                        {storm.maxKpIndex}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-sm text-foreground">
                      {formatDateTime(storm.startTime)}
                    </h3>
                    <p className={`text-xs font-body ${kpColor(storm.maxKpIndex)}`}>
                      {storm.stormLevel}
                    </p>
                  </div>
                </div>

                <a
                  href={storm.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5"
                >
                  <ExternalLink className="h-2.5 w-2.5" /> DONKI
                </a>
              </div>

              {/* Kp readings timeline */}
              {storm.kpReadings.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted mb-2 font-body">
                    Kp Readings
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {storm.kpReadings.map((reading, ri) => (
                      <motion.div
                        key={ri}
                        className="flex flex-col items-center gap-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 + ri * 0.05 + 0.4, duration: 0.3 }}
                      >
                        {/* Bar */}
                        <div className="relative h-10 w-6 rounded-sm bg-white/[0.04] overflow-hidden flex items-end">
                          <motion.div
                            className={`w-full rounded-sm ${kpBg(reading.kpIndex)}`}
                            initial={{ height: 0 }}
                            animate={{ height: `${(reading.kpIndex / 9) * 100}%` }}
                            transition={{ delay: i * 0.05 + ri * 0.05 + 0.5, duration: 0.5 }}
                          />
                        </div>
                        <span
                          className={`text-[9px] font-mono tabular-nums ${kpColor(reading.kpIndex)}`}
                        >
                          {reading.kpIndex}
                        </span>
                        <span className="text-[8px] text-muted tabular-nums whitespace-nowrap">
                          {formatTimeShort(reading.observedTime)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return iso;
  }
}

function formatTimeShort(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
