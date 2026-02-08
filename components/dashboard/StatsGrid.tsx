"use client";

/**
 * Dashboard Stats Grid Component
 *
 * Displays a grid of animated cards showing key NEO statistics,
 * such as total objects, hazardous count, closest approach, and max velocity.
 */

import { motion } from "framer-motion";
import { AlertTriangle, Gauge, Orbit, Ruler } from "lucide-react";
import { useNeoStore } from "@/stores/neo-store";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string; // tailwind text-color
  delay: number;
}

function StatCard({ label, value, icon, accent = "text-accent", delay }: StatCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 transition-colors hover:border-border-hover group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" as const }}
    >
      {/* Subtle glow */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary mb-1 font-body">{label}</p>
          <p className={`text-2xl font-display tracking-tight ${accent}`}>{value}</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5">{icon}</div>
      </div>
    </motion.div>
  );
}

export default function StatsGrid() {
  const { neos, elementCount, hazardousCount, isLoading } = useNeoStore();

  // Compute derived stats
  const closestApproach = neos.reduce<number | null>((min, neo) => {
    const dist = neo.close_approach_data?.[0]?.miss_distance?.kilometers;
    if (!dist) return min;
    const km = parseFloat(dist);
    return min === null ? km : Math.min(min, km);
  }, null);

  const maxVelocity = neos.reduce<number>((max, neo) => {
    const vel = neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour;
    if (!vel) return max;
    return Math.max(max, parseFloat(vel));
  }, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[100px] rounded-2xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  const stats: Omit<StatCardProps, "delay">[] = [
    {
      label: "Objects Today",
      value: elementCount,
      icon: <Orbit className="h-5 w-5 text-accent" />,
      accent: "text-foreground",
    },
    {
      label: "Hazardous",
      value: hazardousCount,
      icon: <AlertTriangle className="h-5 w-5 text-danger" />,
      accent: hazardousCount > 0 ? "text-danger" : "text-foreground",
    },
    {
      label: "Closest (km)",
      value: closestApproach
        ? closestApproach < 1_000_000
          ? `${(closestApproach / 1000).toFixed(0)}K`
          : `${(closestApproach / 1_000_000).toFixed(1)}M`
        : "—",
      icon: <Ruler className="h-5 w-5 text-warning" />,
      accent: "text-warning",
    },
    {
      label: "Max Speed (km/h)",
      value: maxVelocity ? `${(maxVelocity / 1000).toFixed(0)}K` : "—",
      icon: <Gauge className="h-5 w-5 text-info" />,
      accent: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} delay={i * 0.08} />
      ))}
    </div>
  );
}
