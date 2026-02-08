"use client";

/**
 * Store Hydration Provider
 *
 * A client-side provider that triggers the hydration of the authentication store
 * on component mount. Ensures persistent auth state is restored.
 */

import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function StoreProvider({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
