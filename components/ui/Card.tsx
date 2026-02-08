/**
 * Card Component
 *
 * A generic card container with support for default and glassmorphism variants.
 */

import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
}

export default function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl p-6 transition-all duration-200",
        variant === "default" && "bg-card border border-border hover:border-border-hover",
        variant === "glass" && "glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
