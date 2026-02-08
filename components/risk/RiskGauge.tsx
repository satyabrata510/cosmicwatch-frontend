"use client";

/**
 * Radial Risk Gauge Component
 *
 * An animated SVG-based radial gauge diagram to visualize the numerical risk score (0-100).
 * Supports different sizes and risk levels, updating its color and glow effects accordingly.
 */

import { motion } from "framer-motion";
import type { RiskLevel } from "@/types";

interface Props {
  score: number;
  level: RiskLevel;
  size?: number;
}

const LEVEL_COLORS: Record<RiskLevel, { stroke: string; glow: string; text: string }> = {
  LOW: { stroke: "#4dff91", glow: "rgba(77,255,145,0.25)", text: "text-success" },
  MEDIUM: { stroke: "#ffb84d", glow: "rgba(255,184,77,0.25)", text: "text-warning" },
  HIGH: { stroke: "#ff8c4d", glow: "rgba(255,140,77,0.3)", text: "text-orange-400" },
  CRITICAL: { stroke: "#ff4d6a", glow: "rgba(255,77,106,0.35)", text: "text-danger" },
};

export default function RiskGauge({ score, level, size = 160 }: Props) {
  const colors = LEVEL_COLORS[level];
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40"
        style={{ background: colors.glow }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={8}
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut" as const, delay: 0.3 }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.span
          className={`font-display text-3xl tracking-tight ${colors.text}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {score.toFixed(0)}
        </motion.span>
        <span className="text-[9px] uppercase tracking-widest text-secondary font-body mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}

export { LEVEL_COLORS };
