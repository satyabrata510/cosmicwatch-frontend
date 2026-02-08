"use client";

/**
 * Close Approach Table Component
 *
 * Displays a table of close approach data for a specific NEO.
 * Includes details on date, velocity, and miss distance.
 */

import { motion } from "framer-motion";
import type { CloseApproachData } from "@/types";

interface Props {
  approaches: CloseApproachData[];
}

export default function CloseApproachTable({ approaches }: Props) {
  if (!approaches.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-8 text-center">
        <p className="text-secondary font-body text-sm">No close approach data available.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl bg-card border border-border overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
    >
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display text-lg tracking-tight text-foreground">Close Approaches</h2>
        <p className="text-xs text-muted font-body mt-0.5">
          {approaches.length} recorded encounter{approaches.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider text-secondary border-b border-border">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Velocity (km/s)</th>
              <th className="px-5 py-3">Velocity (km/h)</th>
              <th className="px-5 py-3">Miss Dist (km)</th>
              <th className="px-5 py-3">Miss Dist (lunar)</th>
              <th className="px-5 py-3">Miss Dist (AU)</th>
              <th className="px-5 py-3">Orbiting</th>
            </tr>
          </thead>
          <tbody>
            {approaches.map((a, i) => {
              const km = parseFloat(a.miss_distance.kilometers);
              return (
                <motion.tr
                  key={a.epoch_date_close_approach}
                  className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <td className="px-5 py-3 text-foreground whitespace-nowrap">
                    {a.close_approach_date_full || a.close_approach_date}
                  </td>
                  <td className="px-5 py-3 text-secondary tabular-nums">
                    {parseFloat(a.relative_velocity.kilometers_per_second).toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-secondary tabular-nums">
                    {parseFloat(a.relative_velocity.kilometers_per_hour).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td
                    className={`px-5 py-3 tabular-nums ${km < 1_000_000 ? "text-warning font-medium" : "text-secondary"}`}
                  >
                    {km.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-5 py-3 text-secondary tabular-nums">
                    {parseFloat(a.miss_distance.lunar).toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-secondary tabular-nums">
                    {parseFloat(a.miss_distance.astronomical).toFixed(6)}
                  </td>
                  <td className="px-5 py-3 text-muted">{a.orbiting_body}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
