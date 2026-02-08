"use client";

/**
 * Date Range Picker Component
 *
 * Allows users to select a start and end date for filtering data.
 * Includes preset options for quick selection (e.g., Today, 3 Days, 7 Days).
 */

import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";
import { today } from "@/services/neo";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  isLoading: boolean;
  onSearch: (start: string, end: string) => void;
}

const fmt = (d: Date) => d.toISOString().slice(0, 10);

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return fmt(d);
}

const PRESETS = [
  { label: "Today", days: 0 },
  { label: "3 Days", days: 2 },
  { label: "7 Days", days: 6 },
] as const;

export default function DateRangePicker({
  startDate,
  endDate,
  isLoading,
  onSearch,
}: DateRangePickerProps) {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  const applyPreset = (days: number) => {
    const e = today(); // end = today
    const s = days === 0 ? e : addDays(e, -days); // start = today - N days (past)
    setStart(s);
    setEnd(e);
    onSearch(s, e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(start, end);
  };

  const inputCls =
    "h-9 px-3 rounded-lg bg-white/[0.03] border border-white/10 text-white/80 text-xs font-body placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors";

  return (
    <motion.div
      className="rounded-2xl bg-card border border-border p-4 mb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-start sm:items-end gap-3"
      >
        {/* Start date */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] uppercase tracking-wider text-secondary mb-1 font-body">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={`${inputCls} w-full pl-8`}
            />
          </div>
        </div>

        {/* End date */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] uppercase tracking-wider text-secondary mb-1 font-body">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className={`${inputCls} w-full pl-8`}
            />
          </div>
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={isLoading}
          className="h-9 px-4 rounded-lg bg-accent text-white text-xs font-medium flex items-center gap-1.5 hover:bg-accent-hover transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          Search
        </button>

        {/* Presets */}
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.days)}
              disabled={isLoading}
              className="h-9 px-3 rounded-lg border border-white/10 text-xs text-secondary hover:text-white hover:border-white/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </form>
    </motion.div>
  );
}
