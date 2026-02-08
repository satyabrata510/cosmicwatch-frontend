"use client";

/**
 * Dashboard Shell Component
 *
 * The main container for the dashboard. Fetches NEO data on mount
 * and orchestrates the layout of the dashboard components.
 */

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useNeoStore } from "@/stores/neo-store";
import NeoFeedTable from "./NeoFeedTable";
import StatsGrid from "./StatsGrid";
import WelcomeHeader from "./WelcomeHeader";

export default function DashboardShell() {
  const { loadFeed } = useNeoStore();

  // Fetch NEO feed on mount — auth is enforced by (main)/layout.tsx
  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <WelcomeHeader />
      <StatsGrid />

      {/* 3D Explorer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href="/explore"
          className="group relative flex items-center gap-4 rounded-2xl border border-accent/20 bg-accent/[0.04] px-6 py-4 transition-all hover:border-accent/40 hover:bg-accent/[0.08]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-display text-foreground">3D Orbit Explorer</p>
            <p className="text-xs text-secondary">
              Visualize near-Earth object orbits in an interactive 3D scene
            </p>
          </div>
          <span className="text-xs text-accent/70 group-hover:text-accent transition-colors">
            Launch →
          </span>
        </Link>
      </motion.div>

      <NeoFeedTable />
    </div>
  );
}
