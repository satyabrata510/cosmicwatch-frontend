/**
 * usePermission Hook Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePermission } from "@/lib/hooks/usePermission";
import { useAuthStore } from "@/stores/auth-store";

describe("usePermission hook", () => {
    beforeEach(() => {
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
    });

    describe("can", () => {
        it("returns true when permission matches", () => {
            useAuthStore.setState({
                user: { role: "ADMIN" } as any,
            });

            const { result } = renderHook(() => usePermission());

            expect(result.current.can("users", "manage")).toBe(true);
        });

        it("returns false when permission denied", () => {
            useAuthStore.setState({
                user: { role: "USER" } as any,
            });

            const { result } = renderHook(() => usePermission());

            expect(result.current.can("users", "manage")).toBe(false);
        });
    });

    describe("canAny", () => {
        it("returns true if at least one permission matches", () => {
            useAuthStore.setState({
                user: { role: "USER" } as any, // User can read users but not manage
            });

            const { result } = renderHook(() => usePermission());

            expect(result.current.canAny("users", ["read", "manage"])).toBe(true);
        });

        it("returns false if no permissions match", () => {
            useAuthStore.setState({
                user: { role: "USER" } as any,
            });

            const { result } = renderHook(() => usePermission());

            expect(result.current.canAny("users", ["create", "delete"])).toBe(false);
        });
    });

    describe("isAtLeast", () => {
        it("returns true for higher roles", () => {
            useAuthStore.setState({
                user: { role: "ADMIN" } as any,
            });

            const { result } = renderHook(() => usePermission());

            expect(result.current.isAtLeast("RESEARCHER")).toBe(true);
        });

        it("returns false for lower roles", () => {
            useAuthStore.setState({
                user: { role: "USER" } as any,
            });

            const { result } = renderHook(() => usePermission());

            expect(result.current.isAtLeast("RESEARCHER")).toBe(false);
        });
    });
});
