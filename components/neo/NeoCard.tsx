"use client";

/**
 * NEO Card Component
 *
 * A card component displaying summary information for a Near-Earth Object (NEO).
 * Used in the NEO Feed grid.
 */

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Orbit } from "lucide-react";
import Link from "next/link";
import type { NeoObject } from "@/types";

interface NeoCardProps {
  neo: NeoObject;
  index: number;
}

export default function NeoCard({ neo, index }: NeoCardProps) {
  const isHazardous = neo.is_potentially_hazardous_asteroid;
  const diameterMax = neo.estimated_diameter.kilometers.estimated_diameter_max;
  const approach = neo.close_approach_data?.[0];
  const missKm = approach ? parseFloat(approach.miss_distance.kilometers) : null;
  const velocity = approach ? parseFloat(approach.relative_velocity.kilometers_per_hour) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" as const }}
    >
      <Link href={`/neo/${neo.id}`}>
        <div
          className={`group relative rounded-2xl bg-card border p-5 transition-all duration-200 hover:border-border-hover hover:bg-card-hover cursor-pointer ${
            isHazardous ? "border-danger/30" : "border-border"
          }`}
        >
          {/* Glow on hover */}
          <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Header row */}
          <div className="flex items-start justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1.5 ${isHazardous ? "bg-danger/10" : "bg-accent/10"}`}>
                {isHazardous ? (
                  <AlertTriangle className="h-4 w-4 text-danger" />
                ) : (
                  <Orbit className="h-4 w-4 text-accent" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground leading-tight">{neo.name}</h3>
                <p className="text-[10px] text-muted font-body">ID: {neo.neo_reference_id}</p>
              </div>
            </div>

            {isHazardous && (
              <span className="text-[9px] uppercase tracking-wider text-danger bg-danger/10 border border-danger/20 rounded-full px-2 py-0.5 font-body">
                Hazardous
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 text-xs font-body relative z-10">
            <div>
              <p className="text-muted mb-0.5">Diameter</p>
              <p className="text-secondary tabular-nums">{diameterMax.toFixed(3)} km</p>
            </div>
            <div>
              <p className="text-muted mb-0.5">Miss Dist</p>
              <p
                className={`tabular-nums ${missKm && missKm < 1_000_000 ? "text-warning" : "text-secondary"}`}
              >
                {missKm
                  ? missKm < 1_000_000
                    ? `${(missKm / 1000).toFixed(0)}K km`
                    : `${(missKm / 1_000_000).toFixed(1)}M km`
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted mb-0.5">Speed</p>
              <p className="text-secondary tabular-nums">
                {velocity ? `${(velocity / 1000).toFixed(0)}K km/h` : "—"}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between relative z-10">
            <p className="text-[10px] text-muted font-body">
              {approach?.close_approach_date ?? "—"}
            </p>
            <span className="text-[10px] text-accent flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Details <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
