"use client";

/**
 * Toast Notification System
 *
 * A comprehensive system for displaying temporary notifications.
 * Includes a context provider, hook (`useToast`), and animated toast components.
 */

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

// ── Types ────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

// ── Context ──────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

let globalId = 0;

// ── Provider ─────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${++globalId}`;
      const duration = toast.duration ?? (toast.type === "error" ? 6000 : 4000);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => addToast({ type: "success", message, title }),
    [addToast]
  );
  const error = useCallback(
    (message: string, title?: string) => addToast({ type: "error", message, title }),
    [addToast]
  );
  const warning = useCallback(
    (message: string, title?: string) => addToast({ type: "warning", message, title }),
    [addToast]
  );
  const info = useCallback(
    (message: string, title?: string) => addToast({ type: "info", message, title }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ── Styling maps ─────────────────────────────────────────

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; border: string; icon: typeof Info; iconColor: string }
> = {
  success: {
    bg: "bg-success/[0.08]",
    border: "border-success/20",
    icon: CheckCircle2,
    iconColor: "text-success",
  },
  error: {
    bg: "bg-danger/[0.08]",
    border: "border-danger/20",
    icon: AlertCircle,
    iconColor: "text-danger",
  },
  warning: {
    bg: "bg-warning/[0.08]",
    border: "border-warning/20",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  info: {
    bg: "bg-info/[0.08]",
    border: "border-info/20",
    icon: Info,
    iconColor: "text-info",
  },
};

// ── Container ────────────────────────────────────────────

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Single Toast ─────────────────────────────────────────

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const style = TOAST_STYLES[toast.type];
  const Icon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`pointer-events-auto rounded-xl border ${style.bg} ${style.border} backdrop-blur-xl p-3.5 shadow-2xl shadow-black/40`}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-xs font-display text-foreground mb-0.5 tracking-tight">
              {toast.title}
            </p>
          )}
          <p className="text-xs font-body text-secondary leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-muted hover:text-foreground transition-colors p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}
