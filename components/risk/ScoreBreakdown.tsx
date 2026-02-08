"use client";

/**
 * Risk Score Breakdown Component
 *
 * Visualizes the 6-factor risk scoring algorithm using animated progress bars.
 * Breaks down the total risk score into components: Miss Distance, Diameter,
 * Hazardous Flag, Velocity, Kinetic Energy, and Orbital Uncertainty.
 */

import { motion } from "framer-motion";
import type { RiskScore } from "@/types";

interface Props {
  breakdown: RiskScore["score_breakdown"];
}

const FACTORS = [
  {
    key: "miss_distance_points" as const,
    label: "Miss Distance",
    max: 25,
    color: "from-warning to-orange-400",
  },
  { key: "diameter_points" as const, label: "Diameter", max: 20, color: "from-info to-blue-400" },
  {
    key: "hazardous_points" as const,
    label: "Hazardous Flag",
    max: 15,
    color: "from-danger to-red-400",
  },
  {
    key: "velocity_points" as const,
    label: "Velocity",
    max: 15,
    color: "from-accent to-purple-400",
  },
  {
    key: "kinetic_energy_points" as const,
    label: "Kinetic Energy",
    max: 15,
    color: "from-orange-400 to-yellow-400",
  },
  {
    key: "orbital_uncertainty_points" as const,
    label: "Orbital Uncertainty",
    max: 10,
    color: "from-emerald-400 to-teal-400",
  },
];

export default function ScoreBreakdown({ breakdown }: Props) {
  return (
    <motion.div
      className="rounded-2xl bg-card border border-border p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h3 className="font-display text-sm tracking-tight text-foreground mb-4">Score Breakdown</h3>

      <div className="space-y-3">
        {FACTORS.map((f, i) => {
          const value = breakdown[f.key];
          const pct = (value / f.max) * 100;

          return (
            <div key={f.key}>
              <div className="flex justify-between text-xs font-body mb-1">
                <span className="text-secondary">{f.label}</span>
                <span className="text-foreground tabular-nums">
                  {value.toFixed(1)}
                  <span className="text-muted">/{f.max}</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${f.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "easeOut" as const }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-xs font-body">
        <span className="text-secondary">Total Score</span>
        <span className="text-foreground font-medium tabular-nums">
          {Object.values(breakdown)
            .reduce((a, b) => a + b, 0)
            .toFixed(1)}
          <span className="text-muted">/100</span>
        </span>
      </div>
    </motion.div>
  );
}
