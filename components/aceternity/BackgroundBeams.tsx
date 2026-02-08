"use client";

/**
 * Background Beams Component
 *
 * An animated background effect featuring gradient beams moving across the screen.
 * Adapted from Aceternity UI.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundBeamsProps {
  className?: string;
}

export default function BackgroundBeams({ className }: BackgroundBeamsProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Primary beam */}
      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #6c63ff 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Secondary beam */}
      <motion.div
        className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #4dc3ff 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -120, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Tertiary beam */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #ff4d6a 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
