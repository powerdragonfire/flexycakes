import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    test: {
        globals: true, // so can use `describe`/`it` without importing them
        environment: "node",
        include: ["tests/**/*.test.{js,ts}"],
    },

    define: {
        __VERSION__: JSON.stringify("test-version"),
    },
});
