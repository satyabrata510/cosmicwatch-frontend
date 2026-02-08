"use client";

/**
 * Moving Border Component
 *
 * A container component with an animated gradient border effect.
 * Adapted from Aceternity UI.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MovingBorderProps {
  children: ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: "div" | "button";
  onClick?: () => void;
}

export default function MovingBorder({
  children,
  duration = 4,
  className,
  containerClassName,
  as: Component = "div",
  onClick,
}: MovingBorderProps) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-2xl p-[1px] cursor-pointer",
        containerClassName
      )}
      onClick={onClick}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg, #6c63ff, #4dc3ff, #6c63ff, transparent, #6c63ff)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner content */}
      <div className={cn("relative rounded-[15px] bg-black", className)}>{children}</div>
    </Component>
  );
}
