/**
 * Logo Component
 *
 * Displays the application logo (Orbit icon) and name "CosmicWatch".
 * Supports multiple sizes (sm, md, lg).
 */

import { clsx } from "clsx";
import { Orbit } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { icon: "h-5 w-5", text: "text-lg" },
  md: { icon: "h-6 w-6", text: "text-xl" },
  lg: { icon: "h-8 w-8", text: "text-2xl" },
};

export default function Logo({ size = "md", className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Orbit className={clsx(s.icon, "text-accent animate-pulse-glow")} />
      <span className={clsx(s.text, "font-bold tracking-tight text-foreground")}>
        Cosmic<span className="text-accent">Watch</span>
      </span>
    </div>
  );
}
