"use client";

/**
 * NEO Feed Shell
 *
 * The main container for the NEO Feed page. Manages data fetching
 * based on date range and displays a grid of NEO cards.
 */

import { motion } from "framer-motion";
import { AlertTriangle, Orbit } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useNeoStore } from "@/stores/neo-store";
import DateRangePicker from "./DateRangePicker";
import NeoCard from "./NeoCard";

export default function NeoFeedShell() {
  const toast = useToast();
  const { neos, elementCount, hazardousCount, isLoading, error, startDate, endDate, loadFeed } =
    useNeoStore();

  useEffect(() => {
    if (error) toast.error(error, "NEO Feed");
  }, [error, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (neos.length === 0 && !isLoading) {
      loadFeed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, loadFeed, neos.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground mb-1">
          NEO <span className="text-accent">Feed</span>
        </h1>
        <p className="text-secondary text-sm font-body">
          Near-Earth Objects tracked by NASA — browse by date range
        </p>
      </motion.div>

      {/* Date picker */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        isLoading={isLoading}
        onSearch={(s, e) => loadFeed(s, e)}
      />

      {/* Summary bar */}
      <motion.div
        className="flex items-center gap-4 mb-6 text-xs font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="inline-flex items-center gap-1.5 text-secondary">
          <Orbit className="h-3.5 w-3.5 text-accent" />
          {elementCount} objects
        </span>
        <span className="inline-flex items-center gap-1.5 text-secondary">
          <AlertTriangle className="h-3.5 w-3.5 text-danger" />
          {hazardousCount} hazardous
        </span>
        <span className="text-muted">
          {startDate === endDate ? startDate : `${startDate} → ${endDate}`}
        </span>
      </motion.div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-danger/5 border border-danger/20 p-6 text-center mb-6">
          <AlertTriangle className="h-8 w-8 text-danger mx-auto mb-2" />
          <p className="text-danger font-body text-sm">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-[180px] rounded-2xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Card grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {neos.map((neo, i) => (
            <NeoCard key={neo.id} neo={neo} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && neos.length === 0 && (
        <div className="text-center py-20">
          <Orbit className="h-12 w-12 text-muted mx-auto mb-3" />
          <p className="text-secondary font-body">
            No near-earth objects found for this date range.
          </p>
        </div>
      )}
    </div>
  );
}
