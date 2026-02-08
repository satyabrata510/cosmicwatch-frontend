"use client";

/**
 * Welcome Header Component
 *
 * Displays a personalized greeting with the user's name and quick statistics
 * (watchlist count, alerts count).
 */

import { motion } from "framer-motion";
import { Bell, Crown, FlaskConical, Shield, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

const ROLE_CONFIG: Record<string, { icon: typeof UserIcon; color: string; label: string }> = {
  ADMIN: {
    icon: Crown,
    color: "bg-amber-400/10 border-amber-400/20 text-amber-400",
    label: "Admin",
  },
  RESEARCHER: {
    icon: FlaskConical,
    color: "bg-blue-400/10 border-blue-400/20 text-blue-400",
    label: "Researcher",
  },
  USER: {
    icon: UserIcon,
    color: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    label: "User",
  },
};

export default function WelcomeHeader() {
  const { user } = useAuthStore();
  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const greeting = getGreeting();

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground mb-1">
        {greeting}, <span className="text-accent">{firstName}</span>
      </h1>
      <p className="text-secondary text-sm font-body">Here&apos;s your cosmic overview for today</p>

      {/* Quick profile badges */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-body text-secondary">
        {(() => {
          const cfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.USER;
          const RoleIcon = cfg.icon;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${cfg.color}`}
            >
              <RoleIcon className="h-3 w-3" />
              {cfg.label}
            </span>
          );
        })()}

        {user._count && (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1">
              <Shield className="h-3 w-3 text-info" />
              {user._count.watchlist} watched
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1">
              <Bell className="h-3 w-3 text-warning" />
              {user._count.alerts} alerts
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
