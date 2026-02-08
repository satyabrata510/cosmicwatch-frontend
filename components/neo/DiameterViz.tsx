"use client";

/**
 * Diameter Visualization Component
 *
 * Visualizes the estimated diameter of a NEO compared to real-world objects
 * (e.g., Football field, Golden Gate Bridge, Mt. Everest).
 */

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { NeoObject } from "@/types";

interface Props {
  neo: NeoObject;
}

// Reference sizes in km for comparison
const REFERENCES = [
  { name: "Football field", km: 0.1 },
  { name: "Golden Gate Bridge", km: 2.7 },
  { name: "Mt. Everest", km: 8.849 },
] as const;

export default function DiameterViz({ neo }: Props) {
  const minKm = neo.estimated_diameter.kilometers.estimated_diameter_min;
  const maxKm = neo.estimated_diameter.kilometers.estimated_diameter_max;
  const avgKm = (minKm + maxKm) / 2;
  const minM = neo.estimated_diameter.meters.estimated_diameter_min;
  const maxM = neo.estimated_diameter.meters.estimated_diameter_max;

  return (
    <motion.div
      className="rounded-2xl bg-card border border-border p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Maximize2 className="h-4 w-4 text-accent" />
        <h2 className="font-display text-lg tracking-tight text-foreground">Estimated Diameter</h2>
      </div>

      {/* Size values */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted mb-1 font-body">
            Kilometers
          </p>
          <p className="text-sm font-body text-foreground tabular-nums">
            {minKm.toFixed(3)} – {maxKm.toFixed(3)} km
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted mb-1 font-body">Meters</p>
          <p className="text-sm font-body text-foreground tabular-nums">
            {minM.toFixed(1)} – {maxM.toFixed(1)} m
          </p>
        </div>
      </div>

      {/* Size comparison bars */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-muted font-body">Size Comparison</p>
        {REFERENCES.map((ref) => {
          const ratio = Math.min((avgKm / ref.km) * 100, 100);
          return (
            <div key={ref.name}>
              <div className="flex justify-between text-xs font-body mb-1">
                <span className="text-secondary">{ref.name}</span>
                <span className="text-muted">{ref.km} km</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio}%` }}
                  transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" as const }}
                />
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-muted font-body text-right">
          Asteroid avg: {avgKm.toFixed(3)} km
        </p>
      </div>
    </motion.div>
  );
}
