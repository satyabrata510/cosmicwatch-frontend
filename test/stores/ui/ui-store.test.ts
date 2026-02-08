/**
 * UI Store Tests
 */

import { describe, expect, it, beforeEach } from "vitest";
import { useUIStore } from "@/stores/ui-store";

describe("useUIStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useUIStore.setState({
            isMobileMenuOpen: false,
            sidebarExpanded: true,
        });
    });

    describe("mobile menu", () => {
        it("has initial state with menu closed", () => {
            const state = useUIStore.getState();
            expect(state.isMobileMenuOpen).toBe(false);
        });

        it("toggleMobileMenu opens the menu", () => {
            useUIStore.getState().toggleMobileMenu();
            expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
        });

        it("toggleMobileMenu closes the menu when open", () => {
            useUIStore.setState({ isMobileMenuOpen: true });
            useUIStore.getState().toggleMobileMenu();
            expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
        });

        it("closeMobileMenu always closes the menu", () => {
            useUIStore.setState({ isMobileMenuOpen: true });
            useUIStore.getState().closeMobileMenu();
            expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
        });
    });

    describe("sidebar", () => {
        it("has initial state with sidebar expanded", () => {
            const state = useUIStore.getState();
            expect(state.sidebarExpanded).toBe(true);
        });

        it("toggleSidebar collapses when expanded", () => {
            useUIStore.getState().toggleSidebar();
            expect(useUIStore.getState().sidebarExpanded).toBe(false);
        });

        it("toggleSidebar expands when collapsed", () => {
            useUIStore.setState({ sidebarExpanded: false });
            useUIStore.getState().toggleSidebar();
            expect(useUIStore.getState().sidebarExpanded).toBe(true);
        });

        it("setSidebarExpanded sets specific value", () => {
            useUIStore.getState().setSidebarExpanded(false);
            expect(useUIStore.getState().sidebarExpanded).toBe(false);

            useUIStore.getState().setSidebarExpanded(true);
            expect(useUIStore.getState().sidebarExpanded).toBe(true);
        });
    });
});
