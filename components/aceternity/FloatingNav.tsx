"use client";

/**
 * Floating Navigation Component
 *
 * A sticky, floating navigation bar with glassmorphism effect.
 * Becomes more prominent on scroll. Adapted from Aceternity UI.
 */

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  children: ReactNode;
  className?: string;
}

export default function FloatingNav({ children, className }: FloatingNavProps) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    setScrolled(current > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className={cn(
        "fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300",
        "bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08]",
        "shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]",
        scrolled && "bg-black/60 border-white/[0.12] shadow-[0_12px_48px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {children}
    </motion.nav>
  );
}
