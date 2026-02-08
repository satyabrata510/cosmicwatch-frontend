/**
 * Constants Tests
 */

import { describe, expect, it } from "vitest";
import {
    APP_NAME,
    APP_DESCRIPTION,
    API_BASE_URL,
    AUTH_COOKIE_KEY,
    REFRESH_COOKIE_KEY,
} from "@/lib/constants";

describe("constants", () => {
    it("exports APP_NAME as a string", () => {
        expect(typeof APP_NAME).toBe("string");
        expect(APP_NAME).toBe("Cosmic Watch");
    });

    it("exports APP_DESCRIPTION as a string", () => {
        expect(typeof APP_DESCRIPTION).toBe("string");
        expect(APP_DESCRIPTION.length).toBeGreaterThan(0);
    });

    it("exports API_BASE_URL as a string", () => {
        expect(typeof API_BASE_URL).toBe("string");
        expect(API_BASE_URL).toContain("/api/v1");
    });

    it("exports AUTH_COOKIE_KEY as a string", () => {
        expect(typeof AUTH_COOKIE_KEY).toBe("string");
        expect(AUTH_COOKIE_KEY).toBe("cw_access_token");
    });

    it("exports REFRESH_COOKIE_KEY as a string", () => {
        expect(typeof REFRESH_COOKIE_KEY).toBe("string");
        expect(REFRESH_COOKIE_KEY).toBe("cw_refresh_token");
    });
});
