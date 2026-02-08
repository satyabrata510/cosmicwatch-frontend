"use client";

/**
 * Close Approach Table Component
 *
 * A sortable table displaying close approach data.
 * Features distance bar visualizations to highlight proximity.
 */

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { CloseApproach } from "@/types";

interface Props {
  approaches: CloseApproach[];
  isLoading: boolean;
}

type SortKey = "date" | "distance" | "velocity" | "diameter";
type SortDir = "asc" | "desc";

/** Maximum lunar distance for the distance bar (anything above is 100%) */
const MAX_LD = 20;

export default function ApproachTable({ approaches, isLoading }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    if (!approaches.length) return [];
    return [...approaches].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = new Date(a.approachDate).getTime() - new Date(b.approachDate).getTime();
          break;
        case "distance":
          cmp = a.distanceKm - b.distanceKm;
          break;
        case "velocity":
          cmp = a.velocityRelative - b.velocityRelative;
          break;
        case "diameter":
          cmp = (a.diameter ?? 0) - (b.diameter ?? 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [approaches, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="h-5 w-48 rounded bg-white/[0.04] animate-pulse" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 border-b border-border animate-pulse bg-white/[0.02]" />
        ))}
      </div>
    );
  }

  if (!approaches.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <p className="text-secondary font-body text-sm">
          No close approaches found for this date range.
        </p>
      </div>
    );
  }

  const headers: { key: SortKey; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "distance", label: "Miss Distance" },
    { key: "velocity", label: "Velocity (km/s)" },
    { key: "diameter", label: "Diam. (km)" },
  ];

  return (
    <motion.div
      className="rounded-2xl bg-card border border-border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-secondary border-b border-border">
              <th className="px-5 py-3 font-medium">Object</th>
              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 font-medium cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => toggleSort(key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {sortKey === key ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3 text-accent" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-accent" />
                      )
                    ) : null}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Proximity</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {sorted.map((a, i) => {
                const isClose = a.distanceLunar < 5;
                const barWidth = Math.min((a.distanceLunar / MAX_LD) * 100, 100);
                const barColor =
                  a.distanceLunar < 2
                    ? "bg-danger"
                    : a.distanceLunar < 5
                      ? "bg-warning"
                      : a.distanceLunar < 10
                        ? "bg-info"
                        : "bg-accent";

                return (
                  <motion.tr
                    key={`${a.designation}-${a.approachDate}`}
                    className={`border-b border-border/50 last:border-0 transition-colors hover:bg-white/[0.02] ${isClose ? "bg-danger/[0.03]" : ""}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                  >
                    {/* Name */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {isClose && (
                          <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-foreground font-medium text-xs truncate max-w-[160px]">
                            {a.fullname?.trim() || a.designation}
                          </p>
                          <p className="text-muted text-[10px]">{a.designation}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-secondary tabular-nums whitespace-nowrap">
                      {formatDate(a.approachDate)}
                    </td>

                    {/* Distance */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-foreground tabular-nums">
                        {formatDistance(a.distanceKm)}
                      </p>
                      <p className="text-[10px] text-muted">{a.distanceLunar.toFixed(2)} LD</p>
                    </td>

                    {/* Velocity */}
                    <td className="px-4 py-3 text-xs text-secondary tabular-nums">
                      {a.velocityRelative.toFixed(1)}
                    </td>

                    {/* Diameter */}
                    <td className="px-4 py-3 text-xs text-secondary tabular-nums">
                      {a.diameter ? a.diameter.toFixed(3) : "—"}
                    </td>

                    {/* Proximity bar */}
                    <td className="px-4 py-3 w-32">
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - barWidth}%` }}
                          transition={{ delay: i * 0.02 + 0.2, duration: 0.6 }}
                        />
                      </div>
                      <p className="text-[9px] text-muted mt-0.5 text-right">
                        {a.distanceLunar < 1 ? "VERY CLOSE" : `${a.distanceLunar.toFixed(1)} LD`}
                      </p>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDistance(km: number) {
  if (km < 1_000_000) return `${(km / 1000).toFixed(0)}K km`;
  return `${(km / 1_000_000).toFixed(2)}M km`;
}
