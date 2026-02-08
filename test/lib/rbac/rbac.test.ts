/**
 * RBAC Tests
 */

import { describe, expect, it } from "vitest";
import { hasPermission, hasAnyPermission, isAtLeast } from "@/lib/rbac";
import type { Role } from "@/types";

describe("hasPermission", () => {
    describe("ADMIN role", () => {
        const role: Role = "ADMIN";

        it("has full access to users", () => {
            expect(hasPermission(role, "users", "create")).toBe(true);
            expect(hasPermission(role, "users", "read")).toBe(true);
            expect(hasPermission(role, "users", "update")).toBe(true);
            expect(hasPermission(role, "users", "delete")).toBe(true);
            expect(hasPermission(role, "users", "manage")).toBe(true);
        });

        it("has full access to watchlist", () => {
            expect(hasPermission(role, "watchlist", "create")).toBe(true);
            expect(hasPermission(role, "watchlist", "delete")).toBe(true);
        });

        it("has access to admin_panel via manage", () => {
            expect(hasPermission(role, "admin_panel", "read")).toBe(true);
            expect(hasPermission(role, "admin_panel", "manage")).toBe(true);
            // manage grants all actions
            expect(hasPermission(role, "admin_panel", "create")).toBe(true);
        });

        it("has access to neo_data", () => {
            expect(hasPermission(role, "neo_data", "read")).toBe(true);
            expect(hasPermission(role, "neo_data", "manage")).toBe(true);
        });
    });

    describe("RESEARCHER role", () => {
        const role: Role = "RESEARCHER";

        it("has limited access to users", () => {
            expect(hasPermission(role, "users", "read")).toBe(true);
            expect(hasPermission(role, "users", "update")).toBe(true);
            expect(hasPermission(role, "users", "create")).toBe(false);
            expect(hasPermission(role, "users", "delete")).toBe(false);
            expect(hasPermission(role, "users", "manage")).toBe(false);
        });

        it("has full watchlist access except manage", () => {
            expect(hasPermission(role, "watchlist", "create")).toBe(true);
            expect(hasPermission(role, "watchlist", "read")).toBe(true);
            expect(hasPermission(role, "watchlist", "update")).toBe(true);
            expect(hasPermission(role, "watchlist", "delete")).toBe(true);
            expect(hasPermission(role, "watchlist", "manage")).toBe(false);
        });

        it("has no access to admin_panel", () => {
            expect(hasPermission(role, "admin_panel", "read")).toBe(false);
        });

        it("can create and read chat", () => {
            expect(hasPermission(role, "chat", "create")).toBe(true);
            expect(hasPermission(role, "chat", "read")).toBe(true);
            expect(hasPermission(role, "chat", "delete")).toBe(false);
        });
    });

    describe("USER role", () => {
        const role: Role = "USER";

        it("has limited user access", () => {
            expect(hasPermission(role, "users", "read")).toBe(true);
            expect(hasPermission(role, "users", "update")).toBe(true);
            expect(hasPermission(role, "users", "delete")).toBe(false);
        });

        it("cannot update watchlist items", () => {
            expect(hasPermission(role, "watchlist", "create")).toBe(true);
            expect(hasPermission(role, "watchlist", "read")).toBe(true);
            expect(hasPermission(role, "watchlist", "update")).toBe(false);
            expect(hasPermission(role, "watchlist", "delete")).toBe(true);
        });

        it("can only read and update alerts", () => {
            expect(hasPermission(role, "alerts", "read")).toBe(true);
            expect(hasPermission(role, "alerts", "update")).toBe(true);
            expect(hasPermission(role, "alerts", "create")).toBe(false);
        });
    });

    describe("edge cases", () => {
        it("returns false for undefined role", () => {
            expect(hasPermission(undefined, "users", "read")).toBe(false);
        });

        it("returns false for undefined resource permissions", () => {
            // Users don't have admin_panel permissions defined
            expect(hasPermission("USER", "admin_panel", "read")).toBe(false);
        });
    });
});

describe("hasAnyPermission", () => {
    it("returns true if any action is allowed", () => {
        expect(hasAnyPermission("USER", "alerts", ["create", "read"])).toBe(true);
    });

    it("returns false if no actions are allowed", () => {
        expect(hasAnyPermission("USER", "admin_panel", ["read", "manage"])).toBe(false);
    });

    it("works with single action array", () => {
        expect(hasAnyPermission("ADMIN", "users", ["manage"])).toBe(true);
    });

    it("returns false for undefined role", () => {
        expect(hasAnyPermission(undefined, "users", ["read"])).toBe(false);
    });
});

describe("isAtLeast", () => {
    it("returns true when role equals minRole", () => {
        expect(isAtLeast("USER", "USER")).toBe(true);
        expect(isAtLeast("RESEARCHER", "RESEARCHER")).toBe(true);
        expect(isAtLeast("ADMIN", "ADMIN")).toBe(true);
    });

    it("returns true when role is higher than minRole", () => {
        expect(isAtLeast("RESEARCHER", "USER")).toBe(true);
        expect(isAtLeast("ADMIN", "USER")).toBe(true);
        expect(isAtLeast("ADMIN", "RESEARCHER")).toBe(true);
    });

    it("returns false when role is lower than minRole", () => {
        expect(isAtLeast("USER", "RESEARCHER")).toBe(false);
        expect(isAtLeast("USER", "ADMIN")).toBe(false);
        expect(isAtLeast("RESEARCHER", "ADMIN")).toBe(false);
    });

    it("returns false for undefined role", () => {
        expect(isAtLeast(undefined, "USER")).toBe(false);
    });
});
