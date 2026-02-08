"use client";

/**
 * 404 — Not Found
 *
 * Redirects authenticated users to /dashboard, unauthenticated to /login.
 * No standalone 404 page is shown.
 */

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function NotFound() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? "/dashboard" : "/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );
}
