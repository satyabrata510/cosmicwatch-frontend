"use client";

/**
 * Physical Properties Panel
 *
 * Displays critical physical characteristics of an asteroid in the context of risk.
 * Includes kinetic energy calculations (with real-world comparisons), Torino/Palermo scales,
 * impact probability, velocity, and size estimates.
 */

import { motion } from "framer-motion";
import { Rocket, Ruler, Scale, Target, Zap } from "lucide-react";
import type { RiskScore } from "@/types";

interface Props {
  risk: RiskScore;
}

// Energy comparisons from the risk engine
const ENERGY_REFS = [
  { name: "Hiroshima", mt: 0.015 },
  { name: "Chelyabinsk", mt: 0.44 },
  { name: "Tunguska", mt: 15 },
  { name: "Tsar Bomba", mt: 50 },
  { name: "Krakatoa", mt: 200 },
];

function formatEnergy(mt: number): string {
  if (mt < 0.001) return `${(mt * 1000).toFixed(2)} kT`;
  if (mt < 1000) return `${mt.toFixed(2)} MT`;
  return `${(mt / 1000).toFixed(1)}K MT`;
}

function formatProbability(p: number): string {
  if (p === 0) return "0";
  if (p < 1e-12) return `${p.toExponential(1)}`;
  if (p < 0.0001) return `1 in ${Math.round(1 / p).toLocaleString()}`;
  return `${(p * 100).toFixed(4)}%`;
}

export default function PhysicsPanel({ risk }: Props) {
  const nearestRef = ENERGY_REFS.reduce((prev, curr) =>
    Math.abs(curr.mt - risk.kinetic_energy_mt) < Math.abs(prev.mt - risk.kinetic_energy_mt)
      ? curr
      : prev
  );
  const energyMultiple = risk.kinetic_energy_mt > 0 ? risk.kinetic_energy_mt / 0.015 : 0;

  return (
    <motion.div
      className="rounded-2xl bg-card border border-border p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <h3 className="font-display text-sm tracking-tight text-foreground mb-4">
        Physical Properties
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Kinetic Energy */}
        <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-warning" />
            <span className="text-xs text-secondary font-body">Kinetic Energy</span>
          </div>
          <p className="font-display text-xl text-foreground mb-1">
            {formatEnergy(risk.kinetic_energy_mt)}
          </p>
          <p className="text-[10px] text-muted font-body">
            ≈ {energyMultiple.toLocaleString(undefined, { maximumFractionDigits: 0 })}× Hiroshima
            {" · "}Nearest ref: {nearestRef.name}
          </p>
        </div>

        {/* Torino Scale */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Scale className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Torino
            </span>
          </div>
          <p className="font-display text-lg text-foreground">{risk.torino_scale}</p>
          <p className="text-[9px] text-muted font-body">scale 0–10</p>
        </div>

        {/* Palermo Scale */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="h-3.5 w-3.5 text-info" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Palermo
            </span>
          </div>
          <p className="font-display text-lg text-foreground">{risk.palermo_scale.toFixed(1)}</p>
          <p className="text-[9px] text-muted font-body">&lt; -2 = no concern</p>
        </div>

        {/* Impact Probability */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="h-3.5 w-3.5 text-danger" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Impact Prob.
            </span>
          </div>
          <p className="font-display text-sm text-foreground">
            {formatProbability(risk.impact_probability)}
          </p>
        </div>

        {/* Velocity */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Rocket className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Velocity
            </span>
          </div>
          <p className="font-display text-sm text-foreground">
            {risk.velocity_km_s.toFixed(1)} km/s
          </p>
        </div>

        {/* Size comparison */}
        <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Ruler className="h-3.5 w-3.5 text-success" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Relative Size
            </span>
          </div>
          <p className="font-body text-sm text-foreground">
            ≈ {risk.relative_size}
            <span className="text-muted ml-2">({risk.estimated_diameter_km.toFixed(3)} km)</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
