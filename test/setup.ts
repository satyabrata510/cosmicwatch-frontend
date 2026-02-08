/**
 * Test Setup
 *
 * Global mocks and testing library configuration for the Cosmic Watch application.
 */

import "@testing-library/jest-dom/vitest";
import { vi, beforeEach } from "vitest";
import React from "react";

// ── Mock js-cookie ──────────────────────────────────────────
const cookieStore: Record<string, string> = {};

vi.mock("js-cookie", () => ({
    default: {
        get: vi.fn((key: string) => cookieStore[key]),
        set: vi.fn((key: string, value: string) => {
            cookieStore[key] = value;
        }),
        remove: vi.fn((key: string) => {
            delete cookieStore[key];
        }),
    },
}));

// ── Mock axios for API tests ────────────────────────────────
const axiosMock = {
    create: vi.fn(() => ({
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
    })),
    post: vi.fn(),
    isAxiosError: vi.fn((payload) => !!payload?.isAxiosError),
};

vi.mock("axios", () => ({
    default: axiosMock,
    isAxiosError: axiosMock.isAxiosError,
}));

// ── Mock socket.io-client ───────────────────────────────────
vi.mock("socket.io-client", () => ({
    io: vi.fn(() => ({
        on: vi.fn(),
        emit: vi.fn(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        connected: false,
    })),
}));



// ── Mock window.location correctly ──────────────────────────
const originalLocation = window.location;
Object.defineProperty(window, "location", {
    configurable: true,
    enumerable: true,
    value: {
        ...originalLocation,
        protocol: "http:",
    },
    writable: true,
});

// ── Mock ResizeObserver ─────────────────────────────────────
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// ── Mock next/navigation ────────────────────────────────────
// ── Mock next/navigation ────────────────────────────────────
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    })),
    usePathname: vi.fn(() => "/"),
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// ── Mock IntersectionObserver ───────────────────────────────
class IntersectionObserverMock {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// ── Mock framer-motion ──────────────────────────────────────
vi.mock("framer-motion", () => {
    const el = (tag: string) => ({ children, ...props }: any) => React.createElement(tag, props, children);
    return {
        motion: {
            div: el("div"),
            span: el("span"),
            h1: el("h1"),
            h2: el("h2"),
            h3: el("h3"),
            p: el("p"),
            li: el("li"),
            ul: el("ul"),
            nav: el("nav"),
            aside: el("aside"),
            section: el("section"),
            header: el("header"),
            footer: el("footer"),
            main: el("main"),
            table: el("table"),
            tbody: el("tbody"),
            tr: el("tr"),
            td: el("td"),
            a: el("a"),
            button: el("button"),
            svg: el("svg"),
            circle: el("circle"),
            path: el("path"),
            rect: el("rect"),
            line: el("line"),
            polyline: el("polyline"),
            polygon: el("polygon"),
            g: el("g"),
        },
        AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
        useScroll: () => ({ scrollY: { get: () => 0, on: vi.fn() } }),
        useMotionValueEvent: vi.fn(),
    };
});

// ── Clear mocks between tests ───────────────────────────────
beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(cookieStore).forEach((key) => delete cookieStore[key]);
});
