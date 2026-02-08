"use client";

/**
 * Watchlist Button Component
 *
 * A reusable toggle button for adding or removing an asteroid from the user's watchlist.
 * Handles loading states and toast notifications.
 */

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useWatchlistStore } from "@/stores/watchlist-store";

interface Props {
  asteroidId: string;
  asteroidName: string;
  size?: "sm" | "md";
}

export default function WatchlistButton({ asteroidId, asteroidName, size = "sm" }: Props) {
  const { isWatched, add, remove } = useWatchlistStore();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const watched = isWatched(asteroidId);

  async function toggle() {
    setLoading(true);
    try {
      if (watched) {
        await remove(asteroidId);
      } else {
        await add({ asteroidId, asteroidName });
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : watched
            ? "Failed to remove"
            : "Failed to add to watchlist",
        "Watchlist"
      );
    } finally {
      setLoading(false);
    }
  }

  const base = size === "md" ? "px-4 py-2 text-xs gap-1.5" : "px-3 py-1.5 text-[10px] gap-1";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center rounded-lg font-body transition-colors disabled:opacity-50 ${base} ${
        watched
          ? "bg-accent/10 border border-accent/30 text-accent hover:bg-danger/10 hover:border-danger/30 hover:text-danger"
          : "bg-white/[0.04] border border-border text-secondary hover:text-accent hover:border-accent/30"
      }`}
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : watched ? (
        <EyeOff className="h-3 w-3" />
      ) : (
        <Eye className="h-3 w-3" />
      )}
      {watched ? "Watching" : "Watch"}
    </button>
  );
}
