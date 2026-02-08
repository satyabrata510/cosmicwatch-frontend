"use client";

/**
 * Quick Access Navigation Grid
 *
 * A grid of cards providing quick navigation to key features of the application.
 * Cards are role-gated, showing only relevant options to the user.
 */

import { motion } from "framer-motion";
import {
  Bell,
  CloudSun,
  Eye,
  Globe,
  MessageSquare,
  Satellite,
  Settings,
  ShieldAlert,
  Telescope,
} from "lucide-react";
import Link from "next/link";
import { usePermission } from "@/lib/hooks/usePermission";
import type { Role } from "@/types";

interface QuickCard {
  href: string;
  label: string;
  description: string;
  icon: typeof Telescope;
  color: string;
  bgColor: string;
  /** If set, only these roles see this card */
  roles?: Role[];
}

const QUICK_CARDS: QuickCard[] = [
  {
    href: "/neo",
    label: "NEO Feed",
    description: "Browse near-Earth objects and close approaches",
    icon: Telescope,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
  },
  {
    href: "/risk",
    label: "Risk Analysis",
    description: "6-factor scientific risk scoring with Torino & Palermo scales",
    icon: ShieldAlert,
    color: "text-danger",
    bgColor: "bg-danger/10 border-danger/20",
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    description: "Track asteroids and get notified on close approaches",
    icon: Eye,
    color: "text-info",
    bgColor: "bg-info/10 border-info/20",
  },
  {
    href: "/alerts",
    label: "Alerts",
    description: "Hazard warnings and close-approach notifications",
    icon: Bell,
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/20",
  },
  {
    href: "/chat",
    label: "Live Chat",
    description: "Discuss asteroids and risks in real time",
    icon: MessageSquare,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/20",
  },
  {
    href: "/cneos",
    label: "CNEOS / Sentry",
    description: "Impact monitoring and Sentry virtual impactors",
    icon: Satellite,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/20",
  },
  {
    href: "/space-weather",
    label: "Space Weather",
    description: "Solar flares, CMEs, and geomagnetic storms from DONKI",
    icon: CloudSun,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
  },
  {
    href: "/explore",
    label: "3D Explorer",
    description: "Interactive orbit visualization in 3D space",
    icon: Globe,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20",
  },
  {
    href: "/admin",
    label: "Admin Panel",
    description: "System administration and user management",
    icon: Settings,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/20",
    roles: ["ADMIN"],
  },
];

export default function QuickAccess() {
  const { role } = usePermission();

  const cards = QUICK_CARDS.filter((card) => !card.roles || (role && card.roles.includes(role)));

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2 className="font-display text-lg text-foreground mb-4">Quick Access</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.04, duration: 0.35 }}
            >
              <Link
                href={card.href}
                className="group relative flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-border-hover hover:bg-card/80 overflow-hidden"
              >
                {/* Subtle glow on hover */}
                <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${card.bgColor}`}
                >
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>

                <div className="relative z-10 flex-1 min-w-0">
                  <p className="text-sm font-display text-foreground group-hover:text-accent transition-colors">
                    {card.label}
                  </p>
                  <p className="text-[11px] text-muted font-body leading-relaxed mt-0.5 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
