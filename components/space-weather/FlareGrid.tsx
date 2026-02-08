"use client";

/**
 * Solar Flare Grid Component
 *
 * Displays solar flare events in a grid layout.
 * Features class-based color coding (X, M, C class) and intensity bars.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Flame, Zap } from "lucide-react";
import type { SolarFlare, SolarFlareResponse } from "@/types";

interface Props {
  events: SolarFlare[];
  summary: SolarFlareResponse["summary"] | null;
  isLoading: boolean;
}

/** Class color mapping */
function classColor(cat: string): { bg: string; text: string; bar: string } {
  switch (cat.toUpperCase()) {
    case "X":
      return {
        bg: "bg-danger/10 border-danger/20",
        text: "text-danger",
        bar: "from-danger to-orange-500",
      };
    case "M":
      return {
        bg: "bg-warning/10 border-warning/20",
        text: "text-warning",
        bar: "from-warning to-orange-400",
      };
    case "C":
      return {
        bg: "bg-accent/10 border-accent/20",
        text: "text-accent",
        bar: "from-accent to-info",
      };
    default:
      return {
        bg: "bg-white/[0.04] border-border",
        text: "text-secondary",
        bar: "from-info to-accent/50",
      };
  }
}

/** Maximum intensity for normalization */
const MAX_INTENSITY: Record<string, number> = { X: 20, M: 10, C: 10 };

export default function FlareGrid({ events, summary, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <Flame className="h-8 w-8 text-warning mx-auto mb-3 opacity-40" />
        <p className="text-secondary font-body text-sm">
          No solar flare events found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {summary && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SummaryCard label="X-Class" count={summary.xClass} color="text-danger" />
          <SummaryCard label="M-Class" count={summary.mClass} color="text-warning" />
          <SummaryCard label="C-Class" count={summary.cClass} color="text-accent" />
          <SummaryCard label="Other" count={summary.other} color="text-secondary" />
        </motion.div>
      )}

      {/* Flare cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {events.map((flare, i) => {
            const colors = classColor(flare.classCategory);
            const maxInt = MAX_INTENSITY[flare.classCategory.toUpperCase()] ?? 10;
            const barWidth = Math.min((flare.intensity / maxInt) * 100, 100);

            return (
              <motion.div
                key={flare.flareId}
                className="group relative rounded-2xl bg-card border border-border p-5 overflow-hidden transition-colors hover:border-border-hover"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
              >
                {/* Top accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${colors.bar}`}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-display text-sm text-foreground">
                        {formatDate(flare.beginTime)}
                      </p>
                      <p className="text-[10px] text-muted font-body mt-0.5">
                        {formatTime(flare.beginTime)} —{" "}
                        {flare.endTime ? formatTime(flare.endTime) : "ongoing"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${colors.bg} ${colors.text}`}
                    >
                      {flare.classType}
                    </span>
                  </div>

                  {/* Intensity bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-muted mb-1">
                      <span className="flex items-center gap-1">
                        <Zap className="h-2.5 w-2.5" /> Intensity
                      </span>
                      <span className="tabular-nums">{flare.intensity.toFixed(1)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ delay: i * 0.03 + 0.3, duration: 0.7 }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-body mb-3">
                    <div>
                      <p className="text-muted text-[9px] uppercase">Peak</p>
                      <p className="text-secondary tabular-nums">{formatTime(flare.peakTime)}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[9px] uppercase">Source</p>
                      <p className="text-secondary">{flare.sourceLocation || "—"}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <a
                    href={flare.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5"
                  >
                    <ExternalLink className="h-2.5 w-2.5" /> DONKI
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="rounded-xl bg-card border border-border p-3 text-center">
      <p className={`text-xl font-display ${color}`}>{count}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted font-body">{label}</p>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
