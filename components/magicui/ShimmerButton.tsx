"use client";

/**
 * Shimmer Button Component
 *
 * A button component with an animated shimmer/glow border effect.
 * Adapted from Magic UI.
 */

import { type HTMLMotionProps, motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
}

export default function ShimmerButton({
  children,
  shimmerColor = "#6c63ff",
  shimmerSize = "0.1em",
  borderRadius = "12px",
  shimmerDuration = "2s",
  background = "rgba(0, 0, 0, 0.9)",
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 text-sm font-medium text-white transition-all",
        className
      )}
      style={{ borderRadius }}
      {...props}
    >
      {/* Animated shimmer border */}
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius }}>
        <div className="absolute inset-[-100%] animate-[shimmer-spin_4s_linear_infinite]">
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from 0deg, transparent 0 340deg, ${shimmerColor} 360deg)`,
            }}
          />
        </div>
      </div>

      {/* Inner background */}
      <div
        className="absolute inset-[1px] flex items-center justify-center"
        style={{ borderRadius, background }}
      >
        <span
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${shimmerColor}20 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
