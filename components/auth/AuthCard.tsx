"use client";

/**
 * Auth Card Component
 *
 * A stylized container for authentication forms, featuring a glassmorphism effect
 * and a 3-column layout for additional information panels.
 */

import type { ReactNode } from "react";

interface AuthCardProps {
  /** The page title displayed at the top of the card (Electrolize font) */
  title: string;
  /** Left panel content */
  leftPanel: ReactNode;
  /** Center content (the form) */
  children: ReactNode;
  /** Right panel content */
  rightPanel: ReactNode;
}

export default function AuthCard({ title, leftPanel, children, rightPanel }: AuthCardProps) {
  return (
    <div className="animate-auth-scale-in w-full max-w-[900px] mx-auto">
      {/* ── Card ── */}
      <div
        className="relative rounded-2xl px-4 py-3 overflow-hidden"
        style={{
          backdropFilter: "brightness(0.7) blur(2px)",
          WebkitBackdropFilter: "brightness(0.7) blur(2px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderLeft: "4px solid rgba(255,255,255,0.15)",
          borderRight: "4px solid rgba(255,255,255,0.15)",
          background: "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%)",
        }}
      >
        {/* Title — Electrolize, scaled like the reference */}
        <div className="text-center py-3">
          <h1
            className="font-display text-4xl md:text-5xl font-normal text-white/60 tracking-wider"
            style={{ transform: "scaleY(0.6)" }}
          >
            {title}
          </h1>
        </div>

        {/* 3-column layout */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-0">
          {/* Left info panel */}
          <aside className="md:w-[22%] font-body text-white/50 text-[11px] space-y-4 px-2 order-2 md:order-1 flex flex-col justify-center">
            {leftPanel}
          </aside>

          {/* Center — form area */}
          <div className="md:w-[56%] flex items-center justify-center px-2 md:px-6 order-1 md:order-2">
            <div className="w-full max-w-sm">{children}</div>
          </div>

          {/* Right info panel */}
          <aside className="md:w-[22%] font-body text-white/50 text-[11px] space-y-4 px-2 order-3 flex flex-col justify-center">
            {rightPanel}
          </aside>
        </div>
      </div>
    </div>
  );
}
