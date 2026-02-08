"use client";

/**
 * Border Beam Component
 *
 * An animated beam effect that travels along the border of a container.
 * Adapted from Magic UI.
 */

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export default function BorderBeam({
  size = 200,
  duration = 12,
  delay = 0,
  borderWidth = 1.5,
  colorFrom = "#6c63ff",
  colorTo = "#4dc3ff",
  className,
}: BorderBeamProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", className)}
      style={
        {
          "--border-beam-size": `${size}px`,
          "--border-beam-duration": `${duration}s`,
          "--border-beam-delay": `${delay}s`,
          "--border-beam-color-from": colorFrom,
          "--border-beam-color-to": colorTo,
          "--border-beam-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
        <div
          className="absolute -inset-[1px] animate-border-beam rounded-[inherit] border-[length:var(--border-beam-width)] border-transparent"
          style={{
            backgroundImage: `conic-gradient(from calc(var(--border-beam-angle, 0) * 1deg), transparent 0%, var(--border-beam-color-from) 10%, var(--border-beam-color-to) 20%, transparent 30%)`,
          }}
        />
      </div>
    </div>
  );
}
