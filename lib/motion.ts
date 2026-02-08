"use client";

/**
 * Shared Animation Variants
 *
 * Reusable Framer Motion animation presets for consistent
 * transitions across the application.
 */

import type { Variants } from "framer-motion";

/** Staggered fade-up entrance — pass `custom={index}` to control delay */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

/** Quick scale-in for error banners / toasts */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};
