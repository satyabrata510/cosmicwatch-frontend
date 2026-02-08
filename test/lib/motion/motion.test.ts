/**
 * Motion Variants Tests
 */

import { describe, expect, it } from "vitest";
import { fadeUp, scaleIn } from "@/lib/motion";

describe("fadeUp variant", () => {
    it("has hidden state with opacity 0 and y offset", () => {
        expect(fadeUp.hidden).toEqual({ opacity: 0, y: 20 });
    });

    it("visible state is a function that accepts index", () => {
        expect(typeof fadeUp.visible).toBe("function");
    });

    it("visible returns correct animation for index 0", () => {
        const visibleFn = fadeUp.visible as (i: number) => object;
        const result = visibleFn(0);
        expect(result).toEqual({
            opacity: 1,
            y: 0,
            transition: { delay: 0, duration: 0.5, ease: "easeOut" },
        });
    });

    it("visible returns correct delay for index 2", () => {
        const visibleFn = fadeUp.visible as (i: number) => object;
        const result = visibleFn(2);
        expect(result).toEqual({
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5, ease: "easeOut" },
        });
    });
});

describe("scaleIn variant", () => {
    it("has hidden state with opacity 0 and scale 0.95", () => {
        expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.95 });
    });

    it("has visible state with opacity 1 and scale 1", () => {
        expect(scaleIn.visible).toEqual({
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2 },
        });
    });
});
