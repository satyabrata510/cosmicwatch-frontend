"use client";

/**
 * NEO Detail Shell
 *
 * The main container for the NEO detail page. Fetches and displays
 * comprehensive data about a specific Near-Earth Object, including
 * risk analysis and close approach data.
 */

import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import RiskBadge from "@/components/risk/RiskBadge";
import RiskGauge from "@/components/risk/RiskGauge";
import { useToast } from "@/components/ui/Toast";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import { fetchNeoById, fetchNeoRiskById } from "@/services/neo";
import type { NeoObject, RiskScore } from "@/types";
import CloseApproachTable from "./CloseApproachTable";
import DiameterViz from "./DiameterViz";
import NeoInfoHeader from "./NeoInfoHeader";

interface Props {
  asteroidId: string;
}

export default function NeoDetailShell({ asteroidId }: Props) {
  const toast = useToast();
  const [neo, setNeo] = useState<NeoObject | null>(null);
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [neoData, riskData] = await Promise.allSettled([
          fetchNeoById(asteroidId),
          fetchNeoRiskById(asteroidId),
        ]);
        if (cancelled) return;
        if (neoData.status === "fulfilled") {
          setNeo(neoData.value);
        } else {
          throw new Error("Failed to load asteroid data");
        }
        if (riskData.status === "fulfilled") {
          setRisk(riskData.value);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load asteroid data";
          setError(msg);
          toast.error(msg, "NEO Data Error");
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

  // Back link
  const backLink = (
    <Link
      href="/neo"
      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors font-body mb-6"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to NEO Feed
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

  if (error || !neo) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {backLink}
        <div className="rounded-2xl bg-danger/5 border border-danger/20 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-danger mx-auto mb-3" />
          <p className="text-danger font-body">{error ?? "Asteroid not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {backLink}

      <div className="flex items-start justify-between gap-4 mb-2">
        <NeoInfoHeader neo={neo} />
        <WatchlistButton asteroidId={neo.neo_reference_id} asteroidName={neo.name} size="md" />
      </div>

      {/* Two-column layout: diameter viz + close approaches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <DiameterViz neo={neo} />

          {/* Quick orbit info */}
          <motion.div
            className="rounded-2xl bg-card border border-border p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3 className="font-display text-sm tracking-tight text-foreground mb-3">
              Quick Facts
            </h3>
            <dl className="space-y-2 text-xs font-body">
              <div className="flex justify-between">
                <dt className="text-secondary">Sentry Object</dt>
                <dd className={neo.is_sentry_object ? "text-warning" : "text-muted"}>
                  {neo.is_sentry_object ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary">Hazardous</dt>
                <dd
                  className={neo.is_potentially_hazardous_asteroid ? "text-danger" : "text-muted"}
                >
                  {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary">Close Approaches</dt>
                <dd className="text-foreground">{neo.close_approach_data.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary">Abs. Magnitude</dt>
                <dd className="text-foreground tabular-nums">
                  {neo.absolute_magnitude_h.toFixed(2)} H
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Risk Analysis preview */}
          {risk && risk.risk_score != null && (
            <motion.div
              className="rounded-2xl bg-card border border-border p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className="font-display text-sm tracking-tight text-foreground mb-3">
                Risk Analysis
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <RiskGauge score={risk.risk_score} level={risk.risk_level} size={72} />
                <div>
                  <RiskBadge level={risk.risk_level} size="sm" />
                  <p className="text-xs text-secondary font-body mt-1">
                    {risk.risk_score.toFixed(1)} / 100
                  </p>
                </div>
              </div>
              <Link
                href={`/risk/${asteroidId}`}
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors font-body"
              >
                <ShieldAlert className="h-3 w-3" />
                Full Risk Analysis →
              </Link>
            </motion.div>
          )}
        </div>

        {/* Main area */}
        <div className="lg:col-span-2">
          <CloseApproachTable approaches={neo.close_approach_data} />
        </div>
      </div>
    </div>
  );
}
