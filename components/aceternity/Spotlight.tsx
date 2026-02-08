"use client";

/**
 * Spotlight Effect Component
 *
 * Adds a radial gradient glow that follows the mouse cursor within the container.
 * Adapted from Aceternity UI.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export default function Spotlight({ className, fill = "#6c63ff" }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    div.addEventListener("mousemove", handleMouseMove);
    div.addEventListener("mouseenter", () => setOpacity(1));
    div.addEventListener("mouseleave", () => setOpacity(0));

    return () => {
      div.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div ref={divRef} className={cn("pointer-events-auto absolute inset-0 z-0", className)}>
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}15, transparent 40%)`,
        }}
      />
    </div>
  );
}
