"use client";

/**
 * NEO Feed Table Component
 *
 * A sortable table displaying Near-Earth Objects (NEOs).
 * Highlights potentially hazardous asteroids and provides sorting by various metrics.
 */

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useNeoStore } from "@/stores/neo-store";
import type { NeoObject } from "@/types";

type SortKey = "name" | "diameter" | "velocity" | "distance" | "hazardous";
type SortDir = "asc" | "desc";

function getDiameter(neo: NeoObject) {
  return neo.estimated_diameter.kilometers.estimated_diameter_max;
}

function getVelocity(neo: NeoObject) {
  return parseFloat(neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour ?? "0");
}

function getDistance(neo: NeoObject) {
  return parseFloat(neo.close_approach_data?.[0]?.miss_distance?.kilometers ?? "0");
}

export default function NeoFeedTable() {
  const { neos, isLoading, error } = useNeoStore();
  const [sortKey, setSortKey] = useState<SortKey>("distance");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    if (!neos.length) return [];
    return [...neos].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "diameter":
          cmp = getDiameter(a) - getDiameter(b);
          break;
        case "velocity":
          cmp = getVelocity(a) - getVelocity(b);
          break;
        case "distance":
          cmp = getDistance(a) - getDistance(b);
          break;
        case "hazardous":
          cmp =
            Number(b.is_potentially_hazardous_asteroid) -
            Number(a.is_potentially_hazardous_asteroid);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [neos, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl bg-danger/5 border border-danger/20 p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-danger mx-auto mb-2" />
        <p className="text-danger font-body text-sm">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl bg-card border border-border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-display text-lg tracking-tight text-foreground">Near-Earth Objects</h2>
        <Link
          href="/neo"
          className="text-xs font-body text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-secondary border-b border-border">
              {(
                [
                  ["name", "Name"],
                  ["diameter", "Diameter (km)"],
                  ["velocity", "Speed (km/h)"],
                  ["distance", "Miss Dist (km)"],
                  ["hazardous", "Hazard"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  className="px-5 py-3 cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => toggleSort(key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {sortKey === key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </span>
                </th>
              ))}
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 w-20 rounded bg-white/[0.04] animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-secondary">
                  No near-earth objects found for this date range.
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {sorted.map((neo, idx) => (
                  <NeoRow key={neo.id} neo={neo} index={idx} />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ── Individual row ─────────────────────────────────────────
function NeoRow({ neo, index }: { neo: NeoObject; index: number }) {
  const isHazardous = neo.is_potentially_hazardous_asteroid;
  const diameter = getDiameter(neo);
  const velocity = getVelocity(neo);
  const distance = getDistance(neo);

  return (
    <motion.tr
      className={`border-b border-border/50 transition-colors hover:bg-white/[0.02] ${
        isHazardous ? "bg-danger/[0.03]" : ""
      }`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      layout
    >
      {/* Name */}
      <td className="px-5 py-3.5">
        <Link
          href={`/neo/${neo.id}`}
          className="text-foreground font-medium hover:text-accent transition-colors"
        >
          {neo.name}
        </Link>
      </td>

      {/* Diameter */}
      <td className="px-5 py-3.5 text-secondary tabular-nums">{diameter.toFixed(3)}</td>

      {/* Velocity */}
      <td className="px-5 py-3.5 text-secondary tabular-nums">
        {velocity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </td>

      {/* Miss Distance */}
      <td className="px-5 py-3.5 tabular-nums">
        <span className={distance < 1_000_000 ? "text-warning font-medium" : "text-secondary"}>
          {distance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      </td>

      {/* Hazardous badge */}
      <td className="px-5 py-3.5">
        {isHazardous ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 border border-danger/20 px-2.5 py-0.5 text-xs text-danger">
            <AlertTriangle className="h-3 w-3" />
            YES
          </span>
        ) : (
          <span className="text-xs text-muted">NO</span>
        )}
      </td>

      {/* JPL Link */}
      <td className="px-5 py-3.5">
        <a
          href={neo.nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:text-accent transition-colors"
          aria-label={`View ${neo.name} on JPL`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </td>
    </motion.tr>
  );
}
