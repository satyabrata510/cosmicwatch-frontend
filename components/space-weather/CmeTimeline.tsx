"use client";

/**
 * CME Timeline Component
 *
 * Displays Coronal Mass Ejection (CME) events in a vertical timeline.
 * Highlights Earth-directed CMEs and provides details like speed and arrival time.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Clock, ExternalLink, Globe, Sun, Wind, Zap } from "lucide-react";
import type { CmeEvent } from "@/types";

interface Props {
  events: CmeEvent[];
  isLoading: boolean;
}

export default function CmeTimeline({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <Sun className="h-8 w-8 text-warning mx-auto mb-3 opacity-40" />
        <p className="text-secondary font-body text-sm">No CME events found for this period.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-warning/40 via-accent/20 to-transparent hidden sm:block" />

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {events.map((cme, i) => (
            <motion.div
              key={cme.activityId}
              className="group relative rounded-2xl bg-card border border-border p-5 sm:pl-16 overflow-hidden transition-colors hover:border-border-hover"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-[18px] top-6 h-4 w-4 rounded-full border-2 border-border bg-card hidden sm:flex items-center justify-center">
                <div
                  className={`h-2 w-2 rounded-full ${cme.earthDirected ? "bg-danger animate-pulse" : "bg-accent"}`}
                />
              </div>

              {/* Earth-directed glow */}
              {cme.earthDirected && (
                <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-danger/10 blur-3xl pointer-events-none" />
              )}

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sun className="h-4 w-4 text-warning" />
                      <h3 className="font-display text-sm text-foreground">
                        {formatDateTime(cme.startTime)}
                      </h3>
                    </div>
                    <p className="text-[10px] text-muted font-body">{cme.activityId}</p>
                  </div>

                  <div className="flex gap-1.5">
                    {cme.earthDirected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 border border-danger/20 px-2 py-0.5 text-[10px] text-danger font-mono">
                        <Globe className="h-2.5 w-2.5" />
                        Earth-Directed
                      </span>
                    )}
                    {cme.type && (
                      <span className="rounded-full bg-white/[0.04] border border-border px-2 py-0.5 text-[10px] text-secondary font-mono">
                        Type {cme.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-body mb-3">
                  {cme.speed !== null && (
                    <div className="flex items-center gap-1.5">
                      <Wind className="h-3 w-3 text-info" />
                      <div>
                        <p className="text-muted text-[9px] uppercase">Speed</p>
                        <p className="text-foreground tabular-nums">{cme.speed.toFixed(0)} km/s</p>
                      </div>
                    </div>
                  )}
                  {cme.halfAngle !== null && (
                    <div>
                      <p className="text-muted text-[9px] uppercase">Half Angle</p>
                      <p className="text-foreground tabular-nums">{cme.halfAngle}°</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted text-[9px] uppercase">Source</p>
                    <p className="text-secondary">{cme.sourceLocation || "—"}</p>
                  </div>
                  {cme.estimatedArrival && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-warning" />
                      <div>
                        <p className="text-muted text-[9px] uppercase">Est. Arrival</p>
                        <p className="text-warning tabular-nums text-[11px]">
                          {formatDateTime(cme.estimatedArrival)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Note */}
                {cme.note && (
                  <p className="text-[11px] text-secondary font-body leading-relaxed line-clamp-2 mb-2">
                    {cme.note}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  {cme.instruments.length > 0 && (
                    <p className="text-[10px] text-muted">
                      <Zap className="h-2.5 w-2.5 inline mr-1" />
                      {cme.instruments.join(", ")}
                    </p>
                  )}
                  <a
                    href={cme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5 ml-auto"
                  >
                    <ExternalLink className="h-2.5 w-2.5" /> DONKI
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
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
