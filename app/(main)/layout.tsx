/**
 * Main Application Layout
 *
 * Provides the core layout structure for authenticated routes,
 * including authentication gating, navigation, and background effects.
 */

"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import ApodBackground from "@/components/auth/ApodBackground";
import Sidebar from "@/components/layout/FloatingDock";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

export default function MainLayout({ children }: { children: ReactNode }) {
  const sidebarExpanded = useUIStore((s) => s.sidebarExpanded);
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Full-screen loading skeleton while auth state hydrates
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-xs text-white/30 font-body tracking-wide">
            Initializing mission control...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is in progress)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ApodBackground />
      <Sidebar />
      <div
        className={`relative z-10 min-h-screen transition-[padding-left] duration-300 ease-in-out ${
          sidebarExpanded ? "pl-[220px]" : "pl-[52px]"
        }`}
      >
        {children}
      </div>
    </>
  );
}
