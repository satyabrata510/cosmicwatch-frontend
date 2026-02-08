import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
        include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            include: [
                "lib/**/*.ts",
                "stores/**/*.ts",
                "hooks/**/*.ts",
                "services/**/*.ts",
                "components/**/*.{ts,tsx}",
            ],
            exclude: [
                "**/*.d.ts",
                "node_modules/**",
                "test/**",
                "**/*.test.ts",
                "**/*.test.tsx",
                "services/**/index.ts",
                "services/index.ts",
                "components/explore/**",
            ],
            thresholds: {
                statements: 100,
                branches: 100,
                functions: 100,
                lines: 100,
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
});
