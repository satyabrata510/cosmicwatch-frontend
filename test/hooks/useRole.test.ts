/**
 * useRole Hook Tests
 */

import { describe, expect, it, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthStore } from "@/stores/auth-store";
import { useRole } from "@/hooks/useRole";

describe("useRole hook", () => {
    beforeEach(() => {
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
    });

    describe("role defaults", () => {
        it("defaults to USER role when no user", () => {
            const { result } = renderHook(() => useRole());
            const { role, isUser, isAdmin, isResearcher } = result.current;

            expect(role).toBe("USER");
            expect(isUser).toBe(true);
            expect(isAdmin).toBe(false);
            expect(isResearcher).toBe(false);
        });
    });

    describe("ADMIN role", () => {
        beforeEach(() => {
            useAuthStore.setState({
                user: { id: "1", name: "Admin", email: "admin@test.com", role: "ADMIN" } as any,
            });
        });

        it("identifies admin correctly", () => {
            const { result } = renderHook(() => useRole());
            const { role, isAdmin, isResearcher, isUser } = result.current;

            expect(role).toBe("ADMIN");
            expect(isAdmin).toBe(true);
            expect(isResearcher).toBe(false);
            expect(isUser).toBe(false);
        });

        it("has all permissions", () => {
            const { result } = renderHook(() => useRole());
            const { can, canCreateAlerts, canDeleteAlerts, canManageUsers, canAccessAdmin, canManageChat } = result.current;

            expect(can("users", "manage")).toBe(true);
            expect(can("admin_panel", "read")).toBe(true);
            expect(canCreateAlerts).toBe(true);
            expect(canDeleteAlerts).toBe(true);
            expect(canManageUsers).toBe(true);
            expect(canAccessAdmin).toBe(true);
            expect(canManageChat).toBe(true);
        });
    });

    describe("RESEARCHER role", () => {
        beforeEach(() => {
            useAuthStore.setState({
                user: { id: "2", name: "Researcher", email: "res@test.com", role: "RESEARCHER" } as any,
            });
        });

        it("identifies researcher correctly", () => {
            const { result } = renderHook(() => useRole());
            const { role, isAdmin, isResearcher, isUser } = result.current;

            expect(role).toBe("RESEARCHER");
            expect(isAdmin).toBe(false);
            expect(isResearcher).toBe(true);
            expect(isUser).toBe(false);
        });

        it("has correct permissions", () => {
            const { result } = renderHook(() => useRole());
            const {
                can,
                canCreateAlerts,
                canDeleteAlerts,
                canUpdateWatchlist,
                canDeleteWatchlist,
                canManageUsers,
                canAccessAdmin,
            } = result.current;

            expect(can("watchlist", "create")).toBe(true);
            expect(can("admin_panel", "read")).toBe(false);
            expect(canCreateAlerts).toBe(true);
            expect(canDeleteAlerts).toBe(true);
            expect(canUpdateWatchlist).toBe(true);
            expect(canDeleteWatchlist).toBe(true);
            expect(canManageUsers).toBe(false);
            expect(canAccessAdmin).toBe(false);
        });
    });

    describe("USER role", () => {
        beforeEach(() => {
            useAuthStore.setState({
                user: { id: "3", name: "User", email: "user@test.com", role: "USER" } as any,
            });
        });

        it("identifies user correctly", () => {
            const { result } = renderHook(() => useRole());
            const { role, isAdmin, isResearcher, isUser } = result.current;

            expect(role).toBe("USER");
            expect(isAdmin).toBe(false);
            expect(isResearcher).toBe(false);
            expect(isUser).toBe(true);
        });

        it("has limited permissions", () => {
            const { result } = renderHook(() => useRole());
            const {
                can,
                canCreateAlerts,
                canDeleteAlerts,
                canUpdateWatchlist,
                canDeleteWatchlist,
                canManageUsers,
                canAccessAdmin,
                canManageChat,
            } = result.current;

            expect(can("watchlist", "create")).toBe(true);
            expect(can("watchlist", "update")).toBe(false);
            expect(canCreateAlerts).toBe(false);
            expect(canDeleteAlerts).toBe(false);
            expect(canUpdateWatchlist).toBe(false);
            expect(canDeleteWatchlist).toBe(true);
            expect(canManageUsers).toBe(false);
            expect(canAccessAdmin).toBe(false);
            expect(canManageChat).toBe(false);
        });
    });

    describe("can method", () => {
        it("checks permissions dynamically", () => {
            useAuthStore.setState({
                user: { id: "1", name: "Admin", email: "admin@test.com", role: "ADMIN" } as any,
            });

            const { result } = renderHook(() => useRole());
            const { can } = result.current;

            expect(can("neo_data", "read")).toBe(true);
            expect(can("risk_analysis", "manage")).toBe(true);
            expect(can("chat", "delete")).toBe(true);
        });
    });
});
