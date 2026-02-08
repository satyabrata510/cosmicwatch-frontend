"use client";

/**
 * NEO Info Header Component
 *
 * Displays the header information for a NEO, including its name,
 * hazard status, reference ID, and absolute magnitude.
 */

import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, Orbit, Shield, Telescope } from "lucide-react";
import type { NeoObject } from "@/types";

interface Props {
  neo: NeoObject;
}

export default function NeoInfoHeader({ neo }: Props) {
  const isHazardous = neo.is_potentially_hazardous_asteroid;
  const diamMin = neo.estimated_diameter.kilometers.estimated_diameter_min;
  const diamMax = neo.estimated_diameter.kilometers.estimated_diameter_max;

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Name row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${isHazardous ? "bg-danger/10" : "bg-accent/10"}`}>
            {isHazardous ? (
              <AlertTriangle className="h-6 w-6 text-danger" />
            ) : (
              <Orbit className="h-6 w-6 text-accent" />
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
            {neo.name}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isHazardous && (
            <span className="text-[10px] uppercase tracking-wider text-danger bg-danger/10 border border-danger/20 rounded-full px-2.5 py-1 font-body flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Potentially Hazardous
            </span>
          )}
          {neo.is_sentry_object && (
            <span className="text-[10px] uppercase tracking-wider text-warning bg-warning/10 border border-warning/20 rounded-full px-2.5 py-1 font-body flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Sentry Monitored
            </span>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-body text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Telescope className="h-3.5 w-3.5 text-accent" />
          ID: {neo.neo_reference_id}
        </span>
        <span>
          Magnitude:{" "}
          <span className="text-foreground">{neo.absolute_magnitude_h.toFixed(2)} H</span>
        </span>
        <span>
          Diameter:{" "}
          <span className="text-foreground">
            {diamMin.toFixed(3)} – {diamMax.toFixed(3)} km
          </span>
        </span>
        <a
          href={neo.nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-accent hover:text-accent-hover transition-colors"
        >
          JPL Data <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}
