"use client";

/**
 * APOD Shell
 *
 * Displays NASA's Astronomy Picture of the Day — image (or video),
 * title, date, explanation, and optional copyright.
 */

import { Calendar, ExternalLink, ImageIcon, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchApodToday } from "@/services/apod";
import type { Apod } from "@/types";

export default function ApodShell() {
  const [apod, setApod] = useState<Apod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchApodToday();
      setApod(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ── Loading skeleton ─────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-6 animate-pulse py-12">
        <div className="h-8 w-64 bg-white/5 rounded-lg" />
        <div className="aspect-video w-full max-w-4xl bg-white/5 rounded-2xl" />
        <div className="space-y-2 w-full max-w-3xl">
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded mx-auto" />
          <div className="h-4 w-2/3 bg-white/5 rounded mx-auto" />
        </div>
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────── */
  if (error || !apod) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-white/40 space-y-4">
        <ImageIcon className="h-12 w-12" />
        <p className="text-sm font-body">Failed to load today&apos;s APOD.</p>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-2 text-xs font-body text-accent hover:text-accent/80 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    );
  }

  const isVideo = apod.mediaType === "video";

  return (
    <div className="flex flex-col items-center space-y-6 py-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
          {apod.title}
        </h1>
        <div className="flex items-center gap-1.5 text-white/40 text-xs font-body">
          <Calendar className="h-3.5 w-3.5" />
          {apod.date}
        </div>
      </div>

      {/* Media */}
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/[0.06] bg-black/40 shadow-2xl shadow-black/40">
        {isVideo ? (
          <iframe
            src={apod.url}
            title={apod.title}
            className="aspect-video w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <img
            src={apod.hdUrl || apod.url}
            alt={apod.title}
            className="w-full h-auto object-contain"
            loading="eager"
          />
        )}
      </div>

      {/* Open in new tab */}
      {!isVideo && (
        <a
          href={apod.hdUrl || apod.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-body text-accent hover:text-accent/80 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open full resolution
        </a>
      )}

      {/* Explanation */}
      <div className="max-w-3xl text-center px-4">
        <p className="text-sm leading-relaxed text-white/60 font-body">{apod.explanation}</p>
      </div>

      {/* Copyright */}
      {apod.copyright && <p className="text-[10px] text-white/25 font-body">© {apod.copyright}</p>}
    </div>
  );
}
