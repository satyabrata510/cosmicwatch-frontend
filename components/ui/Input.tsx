/**
 * Input Component
 *
 * A reusable input field with support for labels, icons, errors, and password toggling.
 */

"use client";

import { clsx } from "clsx";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-secondary">{label}</label>}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={clsx(
              "w-full h-11 px-4 rounded-xl bg-card border border-border text-foreground text-sm",
              "placeholder:text-muted",
              "transition-all duration-200",
              "hover:border-border-hover",
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
