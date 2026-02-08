"use client";

/**
 * Risk Card Component
 *
 * A compact, interactive card displaying a summary of an asteroid's risk profile.
 * Intended for use in lists or grids. Features a mini radial gauge, key statistics
 * (diameter, miss distance, energy), and visual indicators for risk levels.
 */

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { RiskScore } from "@/types";
import RiskBadge from "./RiskBadge";
import { LEVEL_COLORS } from "./RiskGauge";

interface Props {
  risk: RiskScore;
  index: number;
}

export default function RiskCard({ risk, index }: Props) {
  const colors = LEVEL_COLORS[risk.risk_level];
  const pct = risk.risk_score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" as const }}
    >
      <Link href={`/risk/${risk.asteroid_id}`}>
        <div className="group relative rounded-2xl bg-card border border-border p-5 transition-all duration-200 hover:border-border-hover hover:bg-card-hover cursor-pointer overflow-hidden">
          {/* Colored top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${colors.stroke} ${pct}%, transparent ${pct}%)`,
            }}
          />

          {/* Glow on hover */}
          <div
            className="absolute -top-16 -right-16 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{ background: colors.glow }}
          />

          {/* Header */}
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="text-sm font-medium text-foreground truncate mb-1">{risk.name}</h3>
              <RiskBadge level={risk.risk_level} />
            </div>

            {/* Mini gauge */}
            <div className="relative flex-shrink-0" style={{ width: 56, height: 56 }}>
              <svg width={56} height={56} className="transform -rotate-90">
                <circle
                  cx={28}
                  cy={28}
                  r={22}
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={4}
                />
                <motion.circle
                  cx={28}
                  cy={28}
                  r={22}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 22}
                  strokeDashoffset={2 * Math.PI * 22}
                  animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - pct / 100) }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                />
              </svg>
              <span
                className={`absolute inset-0 flex items-center justify-center font-display text-sm ${colors.text}`}
              >
                {pct.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-body relative z-10">
            <div>
              <p className="text-muted uppercase tracking-wider mb-0.5">Diameter</p>
              <p className="text-secondary tabular-nums">
                {risk.estimated_diameter_km.toFixed(3)} km
              </p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-0.5">Miss Dist</p>
              <p className="text-secondary tabular-nums">
                {risk.miss_distance_km < 1_000_000
                  ? `${(risk.miss_distance_km / 1000).toFixed(0)}K km`
                  : `${(risk.miss_distance_km / 1_000_000).toFixed(1)}M km`}
              </p>
            </div>
            <div>
              <p className="text-muted uppercase tracking-wider mb-0.5">Energy</p>
              <p className="text-secondary tabular-nums">
                {risk.kinetic_energy_mt < 1
                  ? `${(risk.kinetic_energy_mt * 1000).toFixed(0)} kT`
                  : `${risk.kinetic_energy_mt.toFixed(1)} MT`}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between relative z-10">
            <span className="text-[10px] text-muted font-body">≈ {risk.relative_size}</span>
            <span className="text-[10px] text-accent flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Analyze <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
