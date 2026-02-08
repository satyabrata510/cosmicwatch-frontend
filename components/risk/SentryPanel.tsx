"use client";

/**
 * Sentry Data Panel
 *
 * Displays specialized data from NASA's CNEOS Sentry impact monitoring system.
 * Shows impact probabilities, potential impact dates, and earth impact effects
 * if the object is currently tracked by Sentry. Handles the "not monitored" state.
 */

import { motion } from "framer-motion";
import { Satellite } from "lucide-react";
import type { SentryRiskScore } from "@/types";

interface Props {
  sentry: SentryRiskScore;
}

export default function SentryPanel({ sentry }: Props) {
  if (!sentry.sentry_available) {
    return (
      <motion.div
        className="rounded-2xl bg-card border border-border p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Satellite className="h-4 w-4 text-muted" />
          <h3 className="font-display text-sm tracking-tight text-secondary">Sentry System</h3>
        </div>
        <p className="text-xs text-muted font-body">
          This object is not currently monitored by the CNEOS Sentry system.
        </p>
      </motion.div>
    );
  }

  const entries: { label: string; value: string }[] = [
    { label: "Designation", value: sentry.sentry_designation ?? "—" },
    { label: "Impact Probability", value: sentry.real_impact_probability?.toExponential(2) ?? "—" },
    { label: "Palermo (Cumulative)", value: sentry.real_palermo_cumulative?.toFixed(2) ?? "—" },
    { label: "Palermo (Max)", value: sentry.real_palermo_max?.toFixed(2) ?? "—" },
    { label: "Torino (Max)", value: String(sentry.real_torino_max ?? "—") },
    {
      label: "Impact Energy",
      value: sentry.real_impact_energy_mt ? `${sentry.real_impact_energy_mt.toFixed(2)} MT` : "—",
    },
    { label: "Virtual Impactors", value: sentry.total_virtual_impactors?.toLocaleString() ?? "—" },
    { label: "Data Source", value: sentry.data_source },
  ];

  return (
    <motion.div
      className="rounded-2xl bg-card border border-warning/20 p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-lg bg-warning/10 p-1.5">
          <Satellite className="h-4 w-4 text-warning" />
        </div>
        <div>
          <h3 className="font-display text-sm tracking-tight text-foreground">Sentry System</h3>
          <p className="text-[9px] text-warning font-body uppercase tracking-wider">
            Actively Monitored
          </p>
        </div>
      </div>

      <dl className="space-y-2">
        {entries.map((e) => (
          <div key={e.label} className="flex justify-between text-xs font-body">
            <dt className="text-secondary">{e.label}</dt>
            <dd className="text-foreground tabular-nums text-right max-w-[180px] truncate">
              {e.value}
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
