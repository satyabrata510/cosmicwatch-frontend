"use client";

/**
 * Risk Detail Shell Component
 *
 * Orchestrates the detailed risk analysis view for a specific asteroid.
 * Renders the main risk gauge, physical properties, score breakdown, and Sentry data.
 * Manages data fetching states and error handling for risk assessments.
 */

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ExternalLink, Loader2, Orbit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { fetchNeoRiskById, fetchNeoSentryRisk } from "@/services/neo";
import type { RiskScore, SentryRiskScore } from "@/types";
import PhysicsPanel from "./PhysicsPanel";
import RiskBadge from "./RiskBadge";
import RiskGauge from "./RiskGauge";
import ScoreBreakdown from "./ScoreBreakdown";
import SentryPanel from "./SentryPanel";

interface Props {
  asteroidId: string;
}

export default function RiskDetailShell({ asteroidId }: Props) {
  const toast = useToast();
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [sentry, setSentry] = useState<SentryRiskScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [riskData, sentryData] = await Promise.allSettled([
          fetchNeoRiskById(asteroidId),
          fetchNeoSentryRisk(asteroidId),
        ]);

        if (cancelled) return;

        if (riskData.status === "fulfilled") {
          setRisk(riskData.value);
        } else {
          throw new Error("Failed to load risk analysis");
        }

        if (sentryData.status === "fulfilled") {
          setSentry(sentryData.value);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load risk data";
          setError(msg);
          toast.error(msg, "Risk Analysis Error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [asteroidId, toast]);

  const backLink = (
    <Link
      href="/risk"
      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors font-body mb-6"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to Risk Analysis
    </Link>
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {backLink}
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !risk) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {backLink}
        <div className="rounded-2xl bg-danger/5 border border-danger/20 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-danger mx-auto mb-3" />
          <p className="text-danger font-body">{error ?? "Risk data not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {backLink}

      {/* Hero section with gauge */}
      <motion.div
        className="rounded-2xl bg-card border border-border p-6 sm:p-8 mb-6 overflow-hidden relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-20 -right-20 h-60 w-60 rounded-full blur-[80px] opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${risk.risk_level === "CRITICAL" ? "#ff4d6a" : risk.risk_level === "HIGH" ? "#ff8c4d" : risk.risk_level === "MEDIUM" ? "#ffb84d" : "#4dff91"}, transparent)`,
          }}
        />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Gauge */}
          <RiskGauge score={risk.risk_score} level={risk.risk_level} size={160} />

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
              <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
                {risk.name}
              </h1>
              <RiskBadge level={risk.risk_level} size="md" />
            </div>

            <p className="text-sm text-secondary font-body mb-4">
              Comprehensive risk assessment — {(risk.risk_score ?? 0).toFixed(1)} / 100
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-body">
              <div>
                <p className="text-muted uppercase tracking-wider mb-0.5">Torino</p>
                <p className="text-foreground font-display text-lg">{risk.torino_scale ?? 0}</p>
              </div>
              <div>
                <p className="text-muted uppercase tracking-wider mb-0.5">Palermo</p>
                <p className="text-foreground font-display text-lg">
                  {(risk.palermo_scale ?? 0).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-muted uppercase tracking-wider mb-0.5">Size</p>
                <p className="text-foreground">{risk.relative_size}</p>
              </div>
              <div>
                <p className="text-muted uppercase tracking-wider mb-0.5">Hazardous</p>
                <p className={risk.hazardous ? "text-danger" : "text-success"}>
                  {risk.hazardous ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/neo/${asteroidId}`}
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors font-body"
              >
                <Orbit className="h-3 w-3" />
                View Orbital Data
              </Link>
              <a
                href={`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${asteroidId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-foreground transition-colors font-body"
              >
                <ExternalLink className="h-3 w-3" />
                JPL Small-Body Database
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreBreakdown breakdown={risk.score_breakdown} />
        <PhysicsPanel risk={risk} />
        {sentry && <SentryPanel sentry={sentry} />}
      </div>
    </div>
  );
}
