/**
 * Authentication Layout
 *
 * Standard layout for login and signup pages, providing
 * background effects and session-aware redirection to the dashboard.
 */

"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import ApodBackground from "@/components/auth/ApodBackground";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show spinner while auth state hydrates
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render auth forms for already-authenticated users
  if (isAuthenticated) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-12">
      <ApodBackground />
      <div className="relative z-10 w-full max-w-[960px]">{children}</div>
    </div>
  );
}
