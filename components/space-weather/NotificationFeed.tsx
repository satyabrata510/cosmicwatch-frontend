"use client";

/**
 * Notification Feed Component
 *
 * A scrollable feed displaying DONKI (Database of Notifications, Knowledge, Information)
 * notifications from NASA.
 */

import { AnimatePresence, motion } from "framer-motion";
import { Activity, Bell, ExternalLink, Flame, Radio, Sun } from "lucide-react";
import type { SpaceWeatherNotification } from "@/types";

interface Props {
  notifications: SpaceWeatherNotification[];
  isLoading: boolean;
}

function typeIcon(type: string) {
  switch (type.toUpperCase()) {
    case "CME":
      return <Sun className="h-3.5 w-3.5 text-warning" />;
    case "FLR":
      return <Flame className="h-3.5 w-3.5 text-orange-400" />;
    case "GST":
      return <Activity className="h-3.5 w-3.5 text-accent" />;
    default:
      return <Radio className="h-3.5 w-3.5 text-info" />;
  }
}

function typeBadge(type: string): string {
  switch (type.toUpperCase()) {
    case "CME":
      return "bg-warning/10 border-warning/20 text-warning";
    case "FLR":
      return "bg-orange-400/10 border-orange-400/20 text-orange-400";
    case "GST":
      return "bg-accent/10 border-accent/20 text-accent";
    default:
      return "bg-info/10 border-info/20 text-info";
  }
}

export default function NotificationFeed({ notifications, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="rounded-2xl bg-card border border-border p-12 text-center">
        <Bell className="h-8 w-8 text-accent mx-auto mb-3 opacity-40" />
        <p className="text-secondary font-body text-sm">No notifications found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.messageId}
            className="rounded-xl bg-card border border-border p-4 hover:border-border-hover transition-colors"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: i * 0.02, duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-2 mt-0.5">
                {typeIcon(notif.messageType)}
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-mono ${typeBadge(notif.messageType)}`}
                  >
                    {notif.messageType}
                  </span>
                  <span className="text-[10px] text-muted font-body tabular-nums">
                    {formatDateTime(notif.issueTime)}
                  </span>
                </div>

                {/* Body preview */}
                <p className="text-xs text-secondary font-body leading-relaxed line-clamp-3">
                  {notif.body}
                </p>

                {/* Link */}
                <a
                  href={notif.messageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-[10px] text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5"
                >
                  <ExternalLink className="h-2.5 w-2.5" /> Full Message
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return iso;
  }
}
