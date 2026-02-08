/**
 * Utils Tests
 */

import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
    it("merges class names correctly", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
        expect(cn("base", true && "active", false && "hidden")).toBe("base active");
    });

    it("handles arrays of class names", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    it("handles empty inputs", () => {
        expect(cn()).toBe("");
        expect(cn("")).toBe("");
        expect(cn(null, undefined)).toBe("");
    });

    it("merges Tailwind classes correctly (removes conflicts)", () => {
        expect(cn("p-2", "p-4")).toBe("p-4");
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("handles object syntax", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    it("handles mixed inputs", () => {
        expect(cn("base", ["arr1", "arr2"], { conditional: true })).toBe(
            "base arr1 arr2 conditional"
        );
    });
});
