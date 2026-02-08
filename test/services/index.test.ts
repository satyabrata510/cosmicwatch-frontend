import { describe, it, expect } from "vitest";
import * as services from "@/services";

describe("Services Index", () => {
    it("exports services", () => {
        expect(services).toBeDefined();
        // Verify that the module has exports
        expect(Object.keys(services).length).toBeGreaterThan(0);
    });
});
