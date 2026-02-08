"use client";

/**
 * Sentry Monitor Table Component
 *
 * Displays a list of objects monitored by the Sentry system.
 * Features impact probability bars and Palermo scale indicators.
 */

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Crosshair, Shield } from "lucide-react";
import Link from "next/link";
import type { SentryObject } from "@/types";

interface Props {
  objects: SentryObject[];
  isLoading: boolean;
}

/** Color by Torino scale value */
function torinoColor(ts: number): string {
  if (ts === 0) return "text-success";
  if (ts <= 2) return "text-accent";
  if (ts <= 4) return "text-warning";
  if (ts <= 7) return "text-orange-400";
  return "text-danger";
}

function torinoBg(ts: number): string {
  if (ts === 0) return "bg-success/10 border-success/20";
  if (ts <= 2) return "bg-accent/10 border-accent/20";
  if (ts <= 4) return "bg-warning/10 border-warning/20";
  if (ts <= 7) return "bg-orange-400/10 border-orange-400/20";
  return "bg-danger/10 border-danger/20";
}

export default function SentryTable({ objects, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!objects.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <Shield className="h-8 w-8 text-accent mx-auto mb-3 opacity-40" />
        <p className="text-secondary font-body text-sm">No Sentry-monitored objects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {objects.map((obj, i) => {
          const prob = obj.impactProbability;
          const probLog = prob > 0 ? Math.abs(Math.log10(prob)) : 0;
          // Normalize probability bar (higher probability = more fill)
          const probBarWidth = Math.min(prob > 0 ? (1 / probLog) * 100 * 2 : 0, 100);

          return (
            <motion.div
              key={obj.designation}
              className="group relative rounded-2xl bg-card border border-border p-5 overflow-hidden transition-colors hover:border-border-hover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              {/* Top accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  obj.torinoMax > 0
                    ? "bg-gradient-to-r from-warning via-danger to-warning"
                    : "bg-gradient-to-r from-accent/40 via-accent to-accent/40"
                }`}
              />

              {/* Hover glow */}
              <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/cneos/sentry/${obj.designation}`}
                      className="font-display text-sm text-foreground hover:text-accent transition-colors truncate block"
                    >
                      {obj.fullname}
                    </Link>
                    <p className="text-[10px] text-muted font-body mt-0.5">
                      Last observed: {obj.lastObservation}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono ${torinoBg(obj.torinoMax)} ${torinoColor(obj.torinoMax)}`}
                  >
                    T{obj.torinoMax}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 text-xs font-body mb-3">
                  <div>
                    <p className="text-muted uppercase tracking-wider text-[9px] mb-0.5">Impacts</p>
                    <p className="text-foreground font-display">{obj.impactCount}</p>
                  </div>
                  <div>
                    <p className="text-muted uppercase tracking-wider text-[9px] mb-0.5">Palermo</p>
                    <p
                      className={`font-display ${obj.palermoCumulative > -2 ? "text-warning" : "text-secondary"}`}
                    >
                      {obj.palermoCumulative.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted uppercase tracking-wider text-[9px] mb-0.5">Range</p>
                    <p className="text-secondary">{obj.impactDateRange}</p>
                  </div>
                </div>

                {/* Impact probability bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-muted mb-1">
                    <span>Impact Probability</span>
                    <span className="tabular-nums text-secondary">{prob.toExponential(2)}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-warning"
                      initial={{ width: 0 }}
                      animate={{ width: `${probBarWidth}%` }}
                      transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted">
                    <Crosshair className="h-3 w-3" />
                    {obj.diameter ? `${obj.diameter.toFixed(2)} km` : "Unknown size"}
                    <span className="text-muted/40">•</span>H {obj.absoluteMagnitude.toFixed(1)}
                  </div>
                  <Link
                    href={`/cneos/sentry/${obj.designation}`}
                    className="text-[10px] text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5"
                  >
                    Detail <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
