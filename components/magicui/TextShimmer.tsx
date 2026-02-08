"use client";

/**
 * Text Shimmer Component
 *
 * An animated gradient shimmer effect applied to text.
 * Adapted from Magic UI.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export default function TextShimmer({ children, className, duration = 3 }: TextShimmerProps) {
  return (
    <motion.span
      className={cn(
        "inline-flex bg-clip-text text-transparent",
        "bg-[length:200%_100%] bg-gradient-to-r from-[#f0f0f0] via-[#6c63ff] to-[#f0f0f0]",
        className
      )}
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}
