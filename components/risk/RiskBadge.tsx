"use client";

/**
 * Risk Level Badge Component
 *
 * A reusable UI component to display the categorical risk level (LOW, MEDIUM, HIGH, CRITICAL).
 * Uses consistent color coding and iconography across the application.
 */

import { AlertOctagon, AlertTriangle, Shield, Skull } from "lucide-react";
import type { RiskLevel } from "@/types";

interface Props {
  level: RiskLevel;
  size?: "sm" | "md";
}

const CONFIG: Record<
  RiskLevel,
  { bg: string; border: string; text: string; icon: React.ReactNode; label: string }
> = {
  LOW: {
    bg: "bg-success/10",
    border: "border-success/20",
    text: "text-success",
    icon: <Shield className="h-3 w-3" />,
    label: "LOW RISK",
  },
  MEDIUM: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    text: "text-warning",
    icon: <AlertTriangle className="h-3 w-3" />,
    label: "MEDIUM RISK",
  },
  HIGH: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    icon: <AlertOctagon className="h-3 w-3" />,
    label: "HIGH RISK",
  },
  CRITICAL: {
    bg: "bg-danger/10",
    border: "border-danger/20",
    text: "text-danger",
    icon: <Skull className="h-3 w-3" />,
    label: "CRITICAL",
  },
};

export default function RiskBadge({ level, size = "sm" }: Props) {
  const c = CONFIG[level];
  const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-body uppercase tracking-wider ${c.bg} ${c.border} ${c.text} ${sizeClass}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}
