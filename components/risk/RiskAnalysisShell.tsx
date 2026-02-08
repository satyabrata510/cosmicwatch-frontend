"use client";

/**
 * Risk Analysis Dashboard Shell
 *
 * The main container for the Risk Analysis feature.
 * Allows users to filter and analyze asteroids based on their calculated risk scores.
 * Includes date range filtering, statistical summaries, and a grid of risk cards.
 */

import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Orbit, ShieldAlert, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DateRangePicker from "@/components/neo/DateRangePicker";
import { useToast } from "@/components/ui/Toast";
import { usePermission } from "@/lib/hooks/usePermission";
import { fetchNeoRisk, today } from "@/services/neo";
import type { RiskLevel, RiskScore } from "@/types";
import RiskCard from "./RiskCard";

const LEVEL_ORDER: RiskLevel[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function countByLevel(risks: RiskScore[]): Record<RiskLevel, number> {
  const counts: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  for (const r of risks) counts[r.risk_level]++;
  return counts;
}

export default function RiskAnalysisShell() {
  const toast = useToast();
  const { can } = usePermission();
  const canManageRisk = can("risk_analysis", "manage");
  const [risks, setRisks] = useState<RiskScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(today());
  const [filter, setFilter] = useState<RiskLevel | "ALL">("ALL");

  const load = useCallback(
    async (start: string, end: string) => {
      setIsLoading(true);
      setError(null);
      setStartDate(start);
      setEndDate(end);
      try {
        const data = await fetchNeoRisk(start, end);
        // Sort by risk score descending
        data.sort((a, b) => b.risk_score - a.risk_score);
        setRisks(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load risk data";
        setError(msg);
        toast.error(msg, "Risk Analysis Error");
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    load(today(), today());
  }, [load]);

  const counts = countByLevel(risks);
  const filtered = filter === "ALL" ? risks : risks.filter((r) => r.risk_level === filter);

  const highestScore = risks.length > 0 ? (risks[0]?.risk_score ?? 0) : 0;
  const avgScore =
    risks.length > 0 ? risks.reduce((s, r) => s + r.risk_score, 0) / risks.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="rounded-xl bg-danger/10 p-2">
            <ShieldAlert className="h-6 w-6 text-danger" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
            Risk <span className="text-danger">Analysis</span>
          </h1>
        </div>
        <p className="text-secondary text-sm font-body">
          Scientific risk assessment powered by the Python risk engine — 6-factor scoring with
          Torino &amp; Palermo scales
        </p>
        {canManageRisk && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-body px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning">
            <ShieldAlert className="h-3 w-3" />
            Engine management enabled
          </p>
        )}
      </motion.div>

      {/* Date picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        isLoading={isLoading}
        onSearch={(s, e) => load(s, e)}
      />

      {/* Summary stats bar */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Orbit className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Analyzed
            </span>
          </div>
          <p className="font-display text-xl text-foreground">{risks.length}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-danger" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              High+Critical
            </span>
          </div>
          <p className="font-display text-xl text-danger">{counts.HIGH + counts.CRITICAL}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3.5 w-3.5 text-warning" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Highest Score
            </span>
          </div>
          <p className="font-display text-xl text-foreground">{highestScore.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldAlert className="h-3.5 w-3.5 text-info" />
            <span className="text-[10px] text-muted font-body uppercase tracking-wider">
              Avg Score
            </span>
          </div>
          <p className="font-display text-xl text-foreground">{avgScore.toFixed(1)}</p>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {(["ALL", ...LEVEL_ORDER] as const).map((level) => {
          const count = level === "ALL" ? risks.length : counts[level];
          const isActive = filter === level;
          return (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all cursor-pointer ${
                isActive
                  ? "bg-accent text-white"
                  : "bg-white/[0.03] border border-white/10 text-secondary hover:text-white hover:border-white/20"
              }`}
            >
              {level === "ALL" ? "All" : level} ({count})
            </button>
          );
        })}
      </motion.div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-danger/5 border border-danger/20 p-6 text-center mb-6">
          <AlertTriangle className="h-8 w-8 text-danger mx-auto mb-2" />
          <p className="text-danger font-body text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
        </div>
      )}

      {/* Cards grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((risk, i) => (
            <RiskCard key={risk.asteroid_id} risk={risk} index={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <ShieldAlert className="h-12 w-12 text-muted mx-auto mb-3" />
          <p className="text-secondary font-body">
            {risks.length === 0
              ? "No risk data for this date range."
              : `No ${filter} risk objects found.`}
          </p>
        </div>
      )}
    </div>
  );
}
