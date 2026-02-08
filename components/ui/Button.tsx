/**
 * Button Component
 *
 * A reusable button component with various variants (primary, secondary, ghost, danger)
 * and sizes. Supports loading state and disabling.
 */

import { clsx } from "clsx";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variants = {
  primary: "bg-accent text-white hover:bg-accent-hover glow-accent active:scale-[0.98]",
  secondary:
    "bg-card text-foreground border border-border hover:bg-card-hover hover:border-border-hover",
  ghost: "text-secondary hover:text-foreground hover:bg-card",
  danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-ring cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
