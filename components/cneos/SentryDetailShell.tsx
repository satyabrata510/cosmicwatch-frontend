"use client";

/**
 * Sentry Detail Shell Component
 *
 * Provides a deep-dive view of a single Sentry-monitored object.
 * Displays details including physical properties and a timeline of virtual impactors.
 */

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Crosshair,
  ExternalLink,
  Eye,
  Loader2,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { fetchSentryByDesignation } from "@/services/cneos";
import type { SentryDetail, VirtualImpactor } from "@/types";

interface Props {
  designation: string;
}

function torinoColor(ts: number): string {
  if (ts === 0) return "text-success";
  if (ts <= 2) return "text-accent";
  if (ts <= 4) return "text-warning";
  if (ts <= 7) return "text-orange-400";
  return "text-danger";
}

function torinoBg(ts: number): string {
  if (ts === 0) return "bg-success/10 border-success/20";
  if (ts <= 2) return "bg-accent/10 border-accent/20";
  if (ts <= 4) return "bg-warning/10 border-warning/20";
  if (ts <= 7) return "bg-orange-400/10 border-orange-400/20";
  return "bg-danger/10 border-danger/20";
}

function palermoColor(ps: number): string {
  if (ps > 0) return "text-danger";
  if (ps > -2) return "text-warning";
  return "text-success";
}

export default function SentryDetailShell({ designation }: Props) {
  const toast = useToast();
  const [detail, setDetail] = useState<SentryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSentryByDesignation(designation);
        if (!cancelled) setDetail(data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load Sentry data";
          setError(msg);
          toast.error(msg, "Sentry Error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [designation, toast]);

  const backLink = (
    <Link
      href="/cneos"
      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors font-body mb-6"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to CNEOS Monitor
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

  if (error || !detail) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {backLink}
        <div className="rounded-2xl bg-danger/5 border border-danger/20 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-danger mx-auto mb-3" />
          <p className="text-danger font-body">{error ?? "Sentry object not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {backLink}

      {/* ── Hero card ── */}
      <motion.div
        className="rounded-2xl bg-card border border-border p-6 sm:p-8 mb-6 overflow-hidden relative"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background accent glow */}
        <div
          className={`absolute -top-20 -right-20 h-60 w-60 rounded-full blur-[80px] opacity-15 pointer-events-none ${
            detail.torinoMax > 0 ? "bg-warning" : "bg-accent"
          }`}
        />

        <div className="relative z-10">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
                  {detail.fullname}
                </h1>
                <p className="text-xs text-muted font-body">
                  Designation: {detail.designation} · Method: {detail.method}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-mono ${torinoBg(detail.torinoMax)} ${torinoColor(detail.torinoMax)}`}
              >
                Torino {detail.torinoMax}
              </span>
              <span
                className={`rounded-full bg-card border border-border px-3 py-1 text-xs font-mono ${palermoColor(detail.palermoCumulative)}`}
              >
                Palermo {detail.palermoCumulative.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatBlock
              icon={<Target className="h-4 w-4 text-danger" />}
              label="Impact Prob."
              value={detail.cumulativeImpactProbability.toExponential(2)}
            />
            <StatBlock
              icon={<Crosshair className="h-4 w-4 text-warning" />}
              label="Virtual Impactors"
              value={detail.totalVirtualImpactors.toString()}
            />
            <StatBlock
              icon={<Zap className="h-4 w-4 text-orange-400" />}
              label="Impact Energy"
              value={detail.impactEnergy ? `${detail.impactEnergy.toFixed(4)} Mt` : "—"}
            />
            <StatBlock
              icon={<Eye className="h-4 w-4 text-info" />}
              label="Observations"
              value={`${detail.totalObservations} (${detail.observationArc})`}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Physical properties ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="rounded-2xl bg-card border border-border p-5 lg:col-span-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="font-display text-sm text-foreground mb-4">Properties</h3>
          <dl className="space-y-3 text-xs font-body">
            <PropRow
              label="Diameter"
              value={detail.diameter ? `${detail.diameter.toFixed(3)} km` : "Unknown"}
            />
            <PropRow
              label="Mass"
              value={detail.mass ? `${detail.mass.toExponential(2)} kg` : "Unknown"}
            />
            <PropRow label="Abs. Magnitude" value={`${detail.absoluteMagnitude.toFixed(1)} H`} />
            <PropRow label="V∞" value={`${detail.velocityInfinity.toFixed(2)} km/s`} />
            <PropRow label="V Impact" value={`${detail.velocityImpact.toFixed(2)} km/s`} />
            <PropRow label="First Obs." value={detail.firstObservation} />
            <PropRow label="Last Obs." value={detail.lastObservation} />
          </dl>

          <a
            href={`https://cneos.jpl.nasa.gov/sentry/details.html#?des=${detail.designation}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors font-body"
          >
            <ExternalLink className="h-3 w-3" />
            View on CNEOS
          </a>
        </motion.div>

        {/* ── Virtual Impactors timeline ── */}
        <motion.div
          className="rounded-2xl bg-card border border-border p-5 lg:col-span-2 overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm text-foreground">Virtual Impactors</h3>
            <span className="text-[10px] text-muted font-body">
              {detail.virtualImpactors.length} scenarios
            </span>
          </div>

          {detail.virtualImpactors.length === 0 ? (
            <p className="text-xs text-secondary font-body text-center py-8">
              No virtual impactor data available.
            </p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto pr-2 space-y-2 scrollbar-thin">
              {detail.virtualImpactors.map((vi, i) => (
                <ImpactorRow key={`${vi.date}-${i}`} vi={vi} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-border/50 p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-muted font-body">{label}</span>
      </div>
      <p className="font-display text-lg text-foreground tabular-nums">{value}</p>
    </div>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-secondary">{label}</dt>
      <dd className="text-foreground tabular-nums">{value}</dd>
    </div>
  );
}

function ImpactorRow({ vi, index }: { vi: VirtualImpactor; index: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-border/50 px-4 py-3 hover:bg-white/[0.04] transition-colors"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
    >
      {/* Date */}
      <div className="w-28 flex-shrink-0">
        <p className="text-xs font-display text-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3 text-accent" />
          {vi.date}
        </p>
      </div>

      {/* Probability */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-[10px] text-muted mb-0.5">
          <span>IP</span>
          <span className="tabular-nums text-secondary">
            {vi.impactProbability.toExponential(2)}
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent to-warning"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(
                vi.impactProbability > 0
                  ? Math.max(5, (1 / Math.abs(Math.log10(vi.impactProbability))) * 200)
                  : 0,
                100
              )}%`,
            }}
            transition={{ delay: index * 0.02 + 0.3, duration: 0.6 }}
          />
        </div>
      </div>

      {/* Palermo */}
      <div className="w-16 text-right">
        <p className="text-[10px] text-muted">PS</p>
        <p className={`text-xs font-mono ${palermoColor(vi.palermoScale)}`}>
          {vi.palermoScale.toFixed(2)}
        </p>
      </div>

      {/* Torino */}
      <div
        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-mono ${torinoBg(vi.torinoScale)} ${torinoColor(vi.torinoScale)}`}
      >
        T{vi.torinoScale}
      </div>

      {/* Energy */}
      {vi.impactEnergy !== null && (
        <div className="w-20 text-right">
          <p className="text-[10px] text-muted">Energy</p>
          <p className="text-xs text-secondary tabular-nums font-mono">
            {vi.impactEnergy.toFixed(3)} Mt
          </p>
        </div>
      )}
    </motion.div>
  );
}
